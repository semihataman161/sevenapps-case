# Architecture

How Video Diary is put together and why. For setup and usage, see the [README](../README.md).

- [Layers and wiring](#layers-and-wiring)
- [Folder conventions](#folder-conventions)
- [Data and storage](#data-and-storage)
- [State](#state)
- [Routing](#routing)
- [UI system](#ui-system)
- [Trim screen](#trim-screen)
- [Internationalisation](#internationalisation)
- [Testing conventions](#testing-conventions)

## Layers and wiring

```
types → lib, i18n → services → stores → hooks → components → setup / app
```

Layers only import downward and there are no runtime import cycles.

- **Services** (`src/services`) are self-contained classes that work like small libraries: each
  imports nothing from the app, receives its dependencies through its constructor and exports
  its own types and contract.
- **Stores** (`src/stores`) are Zustand store factories that receive what they need
  (`createVideoStore(service)`, `createSettingsStore(storage)`).
- **`services/instances`** is the composition root and the only place that creates concrete
  objects: `videoService`, `mediaPicker`, `keyValueStorage`, and the stores built from them
  (`useVideoStore`, `useSettingsStore`). Screens, hooks and components import these from
  `@/services`.
- **Startup jobs** (`src/setup`) receive their dependencies as arguments
  (`sweepOrphanedFilesIfDue({ videos, storage })`).

| Service | Responsibility | Injected dependencies |
| --- | --- | --- |
| `VideoService` | The clip library: crop (trim → store → poster → save, with rollback), get, paged listing, count, update, delete, orphaned-file clean-up, file URIs | repository, video and poster file stores, trimmer, thumbnailer |
| `MediaPicker` | Picks one video from the photo library | library launcher (defaults to `expo-image-picker`) |
| `MediaPlayer` | Wraps one `expo-video` player: settings, control, state, events with unsubscribe functions, filmstrip frames | the native player |
| `SqliteVideoRepository` | All SQL for the `videos` table | a SQLite connection |
| `SqliteDatabase` | Opens SQLite once (WAL) and runs versioned migrations | name, migrations |
| `FileStorage` | One folder in the documents directory | folder name |
| `KeyValueStorage` | Synchronous key-value store for persisted settings | backend (defaults to `expo-sqlite/kv-store`) |

Native modules (`expo-trim-video`, `expo-video-thumbnails`, `expo-image-manipulator`) are
wrapped in small adapters (`VideoService/adapters`). Every player operation goes through
`MediaPlayer`; only the video view (`VideoFrame`) receives the native player, to render it.

## Folder conventions

Every module lives in a folder named after it:

```
components/specifics/VideoEntry/
├── index.tsx     # the implementation; re-exports its types
├── types.ts      # VideoEntryProps
├── constants.ts  # behaviour constants (limits, durations), only if needed
└── styles.ts     # style constants (class maps, variants, sizes), only if needed
```

- Each top-level folder has an `index.ts` barrel, so code imports from the folder
  (`import { formatTime } from '@/lib'`). Inside a folder, modules import each other
  relatively to avoid cycles.
- `components/` has no barrel: imports name the kind explicitly
  (`@/components/commons`, `@/components/specifics`).
- Subcomponents used by one component live in its folder and aren't exported.
- `src/app/` only contains route files, as Expo Router turns every file there into a route.

## Data and storage

```
Crop & save ─▶ useCropVideoMutation ─▶ videoService.crop(): trim → move clip → poster → INSERT ─▶ store.add()
     └─ the modal closes at once; useCropJobs() lists running and failed crops in the list
Launch      ─▶ store.hydrate() ─▶ videoService.listPage() + count() ─▶ screens
Scrolling   ─▶ store.loadMore() ─▶ videoService.listPage({ after: cursor }) ─▶ appended
```

- **SQLite is the source of truth.** Queries are parameterised and select explicit columns.
  Schema changes are append-only migrations (`PRAGMA user_version`) run in one exclusive
  transaction.
- **Pagination**: 20 clips per page with keyset pagination on `(created_at, id)`, backed by a
  composite index, so pages stay stable while clips are added or removed. The header shows
  the real total from `COUNT(*)`.
- **Search** runs in SQLite (`LIKE` on name and description, with `%` / `_` escaped), is paged
  like the list, and ignores results of an outdated query.
- **Files**: clips go to `Documents/videos/<id>.mp4`, 360 px posters to
  `Documents/thumbnails/<id>.jpg`. Only file names are stored, because the iOS container path
  can change between installs. A failed insert removes the written files, and a daily sweep
  on launch deletes files no record references.
- **Errors**: services throw typed codes (`VideoServiceError`: `notFound`, `rangeOutOfBounds`,
  `sourceUnreadable`, `unknown`). The hooks map them to translated messages per operation
  (`videoErrorKey`), so the UI never shows raw native or database text.

## State

- **Zustand** holds the loaded pages (`ids`, `byId`, `total`, `nextCursor`), the search query,
  and the crop draft shared by the three crop steps. List rows subscribe to their own record,
  so editing one clip re-renders only that row. `usePick(store, keys)` reads several fields in
  one shallow-compared call.
- **TanStack Query** runs every write as a mutation. Cropping is real background work: the
  mutation lives in the `QueryClient`, so it keeps running after the modal closes. Several
  crops can run at once; failed ones stay (`gcTime: Infinity`) until **Try again** or
  **Dismiss**. Mutations don't retry automatically since they write to disk.
- **Settings** are a `persist` store on `expo-sqlite/kv-store`'s synchronous API, restored
  before the first render, so there's no flash of the wrong theme or language.

## Routing

- **Typed routes**: navigation uses object hrefs and screens read params with the route as
  the type (`useLocalSearchParams<'/videos/[id]'>()`), so a renamed route breaks the build.
- **Deep links** (`videodiary://videos/<id>`): the root stack is anchored on the list, so Back
  works. Details and edit use `useVideoRecord(id)`, which loads a clip outside the loaded pages
  from SQLite and caches it without adding it to the list.
- The root layout exports an `ErrorBoundary` (**Try again** instead of a crash), and unknown
  links land on `+not-found`. Native headers are hidden; every screen draws the same flat
  header on both platforms, and the iOS edge-swipe back gesture still works.

## UI system

**Design**: an editorial film-diary look. Warm near-monochrome palette with one accent red,
DM Serif Display for headings and Inter for UI, tracked uppercase labels, tabular numerals,
rules instead of cards, no shadows.

**Theme**: colours are defined once in `src/lib/theme/palette.ts`. `tailwind.config.ts` turns
them into CSS variables for light and dark and into tokens such as `bg-paper` and `text-ink`,
so one class follows the theme without `dark:` variants. Code that needs plain colour values
(icons, sheets, the navigation theme) reads the same palette through `useThemeColors()`.
Components merge their classes with the caller's through `cn()` (`tailwind-merge`), so the
caller's class wins on conflict.

**Components** come in two kinds:

- **`commons`**: generic, props-driven building blocks that know nothing about video diaries
  (`Typography`, `Button`, `Input`, `SearchField`, `Sheet`, `PageHeader`, `MediaItem`,
  `Stepper`, `VideoFrame`, …). Raw primitives (`Text`, `Pressable`, `TextInput`, `Modal`,
  `expo-image`, Ionicons) are used only here.
- **`specifics`**: thin components that fill commons with app data and texts (`VideoEntry`,
  `VideoListHeader`, `StepIndicator`, `CropJobRow`, `TrimScrubber`, `CropModal`, …).

Every component extends the props of what it wraps and forwards the rest, so any native prop
can be passed through.

## Trim screen

- **Playback** lives in hooks, not in the component: `useMediaPlayer` creates the player,
  `usePlayerStatus` tracks status and loading, `useSegmentPlayback` keeps the preview looping
  inside the 5 s window.
- **Preview loop**: `timeUpdate` events arrive late, which let a frame past the segment flash on
  screen. While playing, the hook checks the position every animation frame and loops back
  before the end (70 ms early on Android, which presents ~40–50 ms past the position it
  reports). Verified on Release builds: no frame after the end is shown.
- **Scrubber**: the selection window moves on the UI thread (Gesture Handler + Reanimated) and
  only seeks the preview every few pan events. The filmstrip comes from
  `generateThumbnailsAsync`; a loader stays up until the player and filmstrip are ready.
- **Trim bounds**: native trimmers reject an end past the real duration, so
  `segmentBounds()` keeps a 50 ms margin, and the player's precise duration replaces the
  picker's rounded one once loaded.
- Going back from Details to Trim reuses the mounted player and filmstrip.

## Internationalisation

i18next with bundled, typed resources: every locale must match `locales/en`, so a missing key
fails `tsc`, and a test checks placeholders. "Device language" picks the first supported
device language (falls back to English) and is re-checked when the app returns to the
foreground. Dates follow the active language.

**Adding a language** (e.g. French):

1. Copy `src/i18n/locales/en/` to `src/i18n/locales/fr/`, translate it and export it from
   `src/i18n/locales/index.ts`.
2. Add `fr` to `AppLanguage`, `SUPPORTED_LANGUAGES` and `NATIVE_LANGUAGE_NAMES`
   (`src/i18n/languages`), and to `resources` in `src/i18n/instance`.
3. Add a `languages.fr` name to every locale and `fr` to the `expo-localization` plugin's
   `supportedLocales` in `app.json`.

## Testing conventions

- One behaviour per test, named after the behaviour, written as arrange–act–assert.
- No shared state between tests: each test builds its own store, service or fake; test data
  comes from builders in `src/testing` (`buildVideo`, `buildSource`).
- Fakes instead of module mocks, typed against the real contracts
  (`jest.Mocked<Pick<VideoService, …>>`), so an API change breaks the test build.
  `jest.mock('@/services')` is used only where code reads the app's instances.
- Components are found by role, label or text and driven with `userEvent`; time-based
  behaviour uses fake timers.
- `renderWithProviders` / `renderHookWithProviders` add the app's providers (safe area, a
  fresh `QueryClient`, English i18n). Native modules are stubbed once in `jest.setup.ts`.
- Mocks reset between tests (`clearMocks`, `restoreMocks`).
