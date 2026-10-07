# Video Diary

A React Native (Expo) app to keep a diary of short video moments: import a video, pick the
5 seconds you care about, give it a name and description, and keep it in a list you can come
back to.

Built for the SevenApps React Native case study.

## Features

| Area | What's there |
| --- | --- |
| **Clip list** (`/`) | Archive of cropped clips with a total count; each entry is a compact row (still, date, length, title, description). Tap to open. Typographic empty and error states. |
| **Details** (`/videos/[id]`) | Plays the clip (native controls, looping) with its name, description, date and length. Edit and delete actions. |
| **Crop modal** (on the list screen) | A React Native `Modal` (iOS page sheet; on Android a bottom sheet over a dimmed backdrop that closes when dragged down) with 3 steps with a progress indicator: **1. Select** a video from the library → **2. Trim** with a film-strip scrubber and a draggable 5 s window (live looping preview of the selection) → **3. Details** (name + description) and **Crop & save**. |
| **Cropping** | `trimVideo` from `expo-trim-video`, run through a TanStack Query mutation. |
| **Edit** (`/videos/[id]/edit`) — bonus | Edit name and description; changes are persisted. |
| **Settings** (`/settings`) | Settings icon at the top right of the archive. **Appearance:** System / Light / Dark. **Language:** device language, English, Türkçe, Deutsch, Español. Both choices are saved and applied instantly. |
| **Bonus tech** | Expo SQLite for storage, Reanimated for the scrubber/press/entering animations, Yup validation (via react-hook-form). |

## Tech stack

Expo SDK 57 · Expo Router · Zustand · TanStack Query · expo-trim-video · NativeWind 4 ·
expo-video · Expo SQLite · Reanimated 4 + Gesture Handler · Yup + react-hook-form ·
FlashList · expo-image · i18next + react-i18next + expo-localization · React Compiler.

## Getting started

### Prerequisites

- Node 20+ and npm
- **iOS**: **Xcode 26.4 or newer** (required by Expo SDK 57) with its iOS platform/simulator
  runtime installed (Xcode → Settings → Components, or `xcodebuild -downloadPlatform iOS`),
  and CocoaPods
- **Android**: Android Studio with an emulator or a device

> `expo-trim-video` is a native module that isn't bundled in Expo Go, so the app runs as a
> **development build**.

### Run

```bash
npm install
npx expo run:ios       # or: npx expo run:android
```

`expo run:*` generates the native projects (`ios/`, `android/` — git-ignored), builds and
installs the app, then starts Metro. Afterwards `npm start` is enough while the native side
doesn't change.

If CocoaPods fails with a Unicode/encoding error, run with a UTF-8 locale:
`LANG=en_US.UTF-8 npx expo run:ios`.

**Getting test videos onto a simulator:** drag a video file onto the Simulator window, or
`xcrun simctl addmedia booted ~/path/to/video.mp4`.

### Scripts

| Command | Purpose |
| --- | --- |
| `npm start` | Start Metro for an installed dev build |
| `npm run ios` / `npm run android` | Build & run the native app |
| `npm test` | Unit tests (jest-expo) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint (`eslint-config-expo`, includes React Compiler rules) |

## Usage

1. Tap **+ New clip** in the header (the empty archive points to it).
2. **Choose from library** and pick a video.
3. Drag the red selection window along the film strip, or tap the strip to jump. The preview loops the
   selected 5 seconds. Tap the video to pause/play. Tap **Next**.
4. Enter a name (required, 2–60 chars) and an optional description (≤ 500 chars), then
   **Crop & save**. The modal closes and the new clip appears at the top of the list.
5. From details, use **Edit details** to change the text, or **Delete clip**.
6. Tap the settings icon at the top right of the archive to change the theme or language.

Videos shorter than 5 s are kept whole. Videos shorter than 1 s are rejected.

## Architecture

```
src/
├── app/                      # Expo Router routes (screens only)
│   ├── _layout.tsx           # Providers, theme, root stack (anchored on the list), splash until hydrated
│   ├── index.tsx             # Clip list
│   ├── videos/[id]/index.tsx # Details
│   ├── videos/[id]/edit.tsx  # Edit (modal)
│   ├── settings.tsx          # Theme + language
│   └── +not-found.tsx        # Unknown links / deep links
├── components/
│   ├── commons/              # Basic primitives: Typography, Icon, Row, Stack, Card, Button, Input, …
│   └── specifics/            # App components composed from commons: VideoEntry, ArchiveHeader, CropModal, …
├── hooks/                    # TanStack mutations, filmstrip frames
├── services/                 # Self-contained service classes (VideoService, SqliteDatabase, FileStorage, KeyValueStorage) + instances
├── stores/                   # Zustand: video list, crop draft, persisted settings
├── i18n/                     # i18next instance, supported languages, locales (en, tr, de, es)
├── lib/                      # constants, time math, text truncation, Yup schema, theme, layout, player helpers, query client
├── setup/                    # Startup side effects: NativeWind interop, apply saved preferences
└── types/                    # Shared domain, navigation and icon types
```

### Folder conventions

Every module lives in a folder named after it:

```
components/specifics/VideoEntry/
├── index.tsx   # the component; imports its types from ./types and re-exports them
├── constants.ts # behaviour constants: limits, durations, thresholds (only if it has any)
├── styles.ts   # style constants: class maps, variant tables, sizes (only if it has any)
└── types.ts    # VideoEntryProps
```

- `index.ts(x)` holds the implementation, `types.ts` its types. Modules without types have
  only an `index`.
- Style-related constants (Tailwind class maps per variant/tone/size, fixed dimensions,
  typography scales, theme-colour maps) live in the component's own `styles.ts`, and
  behaviour constants (character limits, animation durations, gesture thresholds, playback
  timings, step lists) in its `constants.ts`, so `index.tsx` only contains the component.
  Both files are internal and not re-exported. Route files in `src/app` are the exception:
  every file there becomes a route, so their few constants stay in the screen file.
- Each top-level folder has an `index.ts` barrel exporting everything inside it, so code
  imports from the folder: `import { formatTime, useThemeColors } from '@/lib'`.
- `components/` has no barrel of its own. Components are imported from `commons` or
  `specifics` explicitly, so every import shows which kind it is:
  `import { Button } from '@/components/commons'`,
  `import { VideoEntry } from '@/components/specifics'`.
- Inside a folder, modules import each other relatively (`../VideoFrame`), never through
  their own barrel, to avoid import cycles.
- Subcomponents used by a single component live in its folder (e.g.
  `TrimScrubber/Filmstrip`) and aren't exported from the barrel.
- Layers only import downward: `types` → `lib`, `i18n` → `services` → `stores` →
  `hooks` → `components` → `setup` / `app`. There are no runtime import cycles.
- `src/app/` is the exception: Expo Router treats every file there as a route, so route
  files stay flat and contain no component or type declarations.

### Visual design

An editorial, film-diary look rather than a card-based app UI:

- **Palette** (warm, near-monochrome; accent used sparingly): background `#F5F3EE`, text
  `#171717`, secondary `#77736C`, muted `#9A968F`, divider `#D8D4CC`, subtle surface
  `#ECE9E2`, accent `#A33A32`. A matching dark palette is defined in `tailwind.config.js` and
  `lib/theme`.
- **Type**: DM Serif Display for headings and entry titles, Inter for everything functional
  (dates, durations, buttons, forms, navigation), tracked uppercase overlines for metadata,
  tabular numerals for times and counts. Fonts load before the splash screen hides.
- **Layout**: left-aligned, rules instead of cards, 4–6 px radii, no shadows; a compact,
  scannable archive list and the video as the dominant element on the detail and trim
  screens; spacing on a 4/8/12/16/24/32/48/64 rhythm.

- **App icon**: a film strip whose middle frame is marked by the accent-red selection window
  with a play symbol, the same "pick one moment from a video" gesture as the trim screen.
  `assets/` holds only the files `app.json` uses: the app icon, the Android adaptive
  foreground and monochrome layers, the light and dark splash images and the favicon.

### Components: commons and specifics

**`components/commons/`** holds the smallest building blocks. Each one does one thing, knows
nothing about video diaries, and can be used in very different places:

| Component | Purpose |
| --- | --- |
| `Typography` | All text. Serif variants (`display`, `headline`, `title`, `subtitle`) for editorial moments, sans variants (`body`, `label`, `caption`) for UI, and tracked uppercase `overline` / `meta` / `action` / `micro` (locale-aware uppercasing). `tone`, `weight`, `tabular` numerals, and `maxChars` to cut long text with an ellipsis (`truncate` from `lib`) |
| `Icon` | Ionicons with a theme-aware, monochrome-by-default `tone` |
| `Row` / `Stack` | Horizontal / vertical layout with `gap`, `align`, `justify` |
| `Divider` | 1 px rule in the divider colour |
| `Section` | Group with an optional overline heading |
| `Touchable` | The one pressable base: fade (and optional scale) on press. Every tappable area (rows, entries, the trim preview) and `Button` use it |
| `Spinner` | Activity indicator with a theme-aware `tone` |
| `Thumbnail` | `expo-image` with the app's defaults (cover, short fade-in) |
| `Button` | Every action. `primary` (ink block), `secondary` (ink outline), `danger` (accent outline) — 4 px radius, `regular` or `compact` size — and `text` (typographic action, e.g. `← BACK`, `+ NEW CLIP`). `title` is optional for icon-only buttons (pass `accessibilityLabel`) |
| `Input` | Text input drawn as a bottom rule (ink when focused, accent when invalid) |
| `FormField` | Overline label, counter and error around any input |
| `KeyboardAwareScroll` | Scroll view that keeps inputs above the keyboard |
| `Sheet` | `Modal` presented as an iOS page sheet / an Android bottom sheet (dimmed backdrop, grabber, drag down to close). Takes `onClose`, optional `onBackPress` and a `header` that is also the drag handle |
| `Header` | Uppercase title with optional `left` / `right` slots (no built-in horizontal padding) |
| `PageHeader` | Screen masthead: `meta` and `topAction` on top, serif `title` with an `action` beside it, rule below; adds the top safe area |
| `MediaItem` | Tappable list row: thumbnail (`imageUri`), `meta` overline, serif `title`, `description`, optional `titleMaxChars` / `descriptionMaxChars`, rule below |
| `Stepper` | Generic step progress: takes `steps` (labels) and `current` (index); shows `01 / 03`, the current label and a 1 px progress rule sized by the number of steps |
| `VideoFrame` | Letterboxed surface (6 px radius) for an `expo-video` player; never taller than `maxHeightRatio` of the screen (default 0.42) |

Commons don't import app data (`stores`, `services`, `hooks`) and never import specifics.
Components take everything they show through props: no translation keys, app constants or
screen-specific spacing are hard-coded inside reusable components. Generic behaviour lives in
a commons component (`Stepper`, `PageHeader`, `MediaItem`, …); a thin specifics component
fills it with the app's data and texts (`StepIndicator`, `ArchiveHeader`, `VideoEntry`, …).

Raw primitives live only inside commons: `Text` (→ `Typography`), Ionicons (→ `Icon`),
`TextInput` (→ `Input`), `Pressable` (→ `Touchable`, `Button`), `ActivityIndicator`
(→ `Spinner`), `expo-image` (→ `Thumbnail`), `Modal` (→ `Sheet`). Screens and specifics never
import them, so changing a commons component changes it everywhere it's used.

**`components/specifics/`** holds components that only make sense in this app, assembled from
commons:

| Component | Built from |
| --- | --- |
| `ArchiveHeader` | `PageHeader` filled with the archive's texts: total clips, settings icon button, title, `+ NEW CLIP` |
| `VideoEntry` / `VideoRow` | `MediaItem` filled from a `DiaryVideo` (still, date · length, title ≤ 30 chars, description ≤ 80 chars) |
| `ActionRow` | `Row` + `Typography` + `Icon` + `Divider` (full-width typographic action, e.g. `EDIT DETAILS →`, `DELETE ×`) |
| `EmptyState` | `Typography` only: accent overline, serif headline, message, optional action; `align` `start` or `center` |
| `OptionRow` | `Pressable` + `Row` + `Typography`; the selected row is a full-width inverted (ink) band |
| `InfoRow` | `Row` + `Typography` |
| `SettingsSection` | `Section` + `Divider` (full-width rules between rows, no cards) |
| `VideoPlayer` | `VideoFrame` + an owned `expo-video` player |
| `MetadataForm` | `Stack` + `FormField` + `Input` + `Button` (react-hook-form + Yup) |
| `StepIndicator` | `Stepper` with the crop flow's translated step names (select, trim, details) |
| `HeaderBackButton` | `Button` (`text` variant) + `router.back()`: the typographic `← BACK` action |
| `ScreenHeader` | `Header` + `HeaderBackButton` inside a top safe area. Native stack headers are hidden app-wide, so every screen draws the same flat header on iOS and Android (no iOS 26 glass back button); the iOS edge-swipe back gesture still works |
| `TrimScrubber` | film-strip track (sprocket bands, frames), accent selection window of `windowLength` seconds, `├──┤` bracket, start/end times; all texts come in through `labels`, `formatLength` and `formatRange` (+ its own gesture parts) |
| `CropModal` | `Sheet` + `Header` + `Button` + `StepIndicator`; its steps live in `CropModal/Steps`: `PickerStep`, `TrimStep` (`VideoFrame` + `TrimScrubber` + `Button`), `DetailsStep` (`MetadataForm`) |

Screens in `src/app/` can use both. Every component extends the props of what it wraps
(`ViewProps`, `TextProps`, `PressableProps`, `TextInputProps`, or another component's props)
and forwards the rest with `...props`, so any native prop can be passed through. A passed
`style` is merged with the component's own style, not replaced.

### Services

Every service is a class in its own folder under `src/services` and works like a small
library: it imports nothing from the app (`@/lib`, `@/types`, other services), receives
everything it depends on through its constructor, and exports its own types. Copy a folder
into another project and it works there.

| Service | Responsibility | Dependencies (injected) |
| --- | --- | --- |
| `VideoService` | Everything video: pick from the library, crop (trim → store file → poster → persist, with rollback), paged listing (`listPage`, `count`), update details, delete, orphaned-file clean-up, file URIs, filmstrip frames, player helpers (`configurePlayer`, `seek`, `pause`), error codes | `repository`, `videos` / `thumbnails` file stores, `trimmer`, `thumbnailer`, `picker`, optional `createId` / `now` |
| `VideoService/SqliteVideoRepository` | SQL for the `videos` table; one implementation of `VideoRepositoryContract` | a connection (`SqliteDatabase`) |
| `SqliteDatabase` | Opens SQLite once and runs versioned migrations | `name`, `migrations`, optional `open` |
| `FileStorage` | One folder in the documents directory: list files, resolve URIs, move files in, delete | folder name |
| `KeyValueStorage` | Synchronous key-value store (used by the persisted settings store) | backend (defaults to `expo-sqlite/kv-store`) |

The native modules (`expo-trim-video`, `expo-video-thumbnails`, `expo-image-picker`) are
wrapped in small adapters (`VideoService/adapters`). `services/instances` is the only place
that wires concrete services together and exports the instances the app uses
(`videoService`, `keyValueStorage`); the rest of the app never calls the native video
modules directly. Tests construct services with fakes, so no module mocking is needed.

### Data flow

```
         ┌─────────── TanStack Query mutation (useCropVideoMutation) ───────────┐
Step 3 → │ videoService.crop(): trim → move clip → thumbnail → INSERT into SQLite │ → Zustand add()
         └───────────────────────────────────────────────────────────────────────┘
App start: SQLite ──videoService.listPage() + count()──hydrate()──▶ Zustand video store ──▶ screens
Scrolling: list end ──loadMore()──▶ videoService.listPage({ after: cursor }) ──▶ appended to the store
```

- **SQLite is the source of truth.** All SQL lives in `VideoService/SqliteVideoRepository`;
  queries are parameterised and select explicit columns (no `SELECT *`). Schema changes go
  through append-only, versioned migrations (`PRAGMA user_version`) run in one exclusive
  transaction by `SqliteDatabase`, which opens the database asynchronously, once, in WAL
  mode; the video table's migrations live in `VideoService/migrations`.
- **Pagination.** The list loads 20 clips at a time with keyset pagination on
  `(created_at, id)` (backed by a composite index), so pages stay stable while clips are
  added or removed. The header shows the real total from `COUNT(*)`.
- **Errors.** Services report typed codes (`VideoServiceError` with `notFound`,
  `rangeOutOfBounds`, `sourceUnreadable`, `unknown`) instead of English messages; the hooks
  layer maps them to translated messages per operation (`videoErrorKey`), so the UI never
  shows raw database or native text.
- **Zustand** holds the loaded pages (`ids` + `byId`, `total`, `nextCursor`) hydrated at launch, plus the
  ephemeral crop-modal draft (`cropDraftStore`) shared by the three steps and cleared when
  the modal closes. List rows subscribe to their own record, so editing one clip re-renders
  only that row.
- **Store layout**: each store lives in `src/stores/<name>Store/` and is exposed as a
  `use<Name>Store` hook. Its types split data from behaviour (`<Name>State` for the data,
  `<Name>Actions` for the functions, `<Name>Store` for both), and its initial state is a
  single constant in `constants.ts` (`INITIAL_<NAME>_STATE`) reused by the store, its reset
  action and the tests.
- **TanStack Query** runs every async write as a mutation (crop, update, delete), giving
  pending/error state to the UI. The crop modal can't be swiped away, closed or stepped back
  while a crop is running (`useIsCropping`, built on `useIsMutating`). Mutation keys come
  from one key factory (`videoKeys`). Mutations don't retry automatically since they
  write to disk.
- **Files.** The trimmer writes to a temp/cache location; the clip is moved to
  `Documents/videos/<id>.mp4` and a poster frame to `Documents/thumbnails/<id>.jpg`. Only
  **file names** go into the database, and URIs are resolved at runtime, because the iOS app
  container path can change between installs/updates. If the DB insert fails, the written
  files are removed, and on every launch `removeOrphanedFiles()` deletes files that no
  record references (e.g. after a crash between saving a file and inserting its row).

### Notable details

- **Scrubber** (`TrimScrubber`): the filmstrip comes from `player.generateThumbnailsAsync`.
  Thumbnails are frame-accurate, so on Android a long keyframe interval makes them slow
  (~2.3 s for 8 frames on an emulator with an 8 s GOP). The trim step shows a "Preparing your
  video…" loader until the player is ready and the filmstrip is done, then reveals the
  editor in one go, and only then starts the preview.
- **Going back from Details to Trim** doesn't reload anything: the trim step stays mounted
  (hidden, preview paused) while the details step is shown, so the player and filmstrip are
  reused.
  The selection window moves on the UI thread (Gesture Handler + Reanimated) and only hops to
  JS every few pan events to seek the preview. The playhead follows `timeUpdate` events
  without re-rendering React.
- **Preview loop**: `timeUpdate` events arrive late and only every 100 ms, which let the frame
  after the segment's end flash on screen. While playing, the trim screen reads
  `player.currentTime` every animation frame and loops back if the next check would pass the
  end. Android presents ~40–50 ms past the position it reports, so it loops 70 ms early.
  Measured on Release builds by screen recording: no frame after the end is shown on either
  platform, and the last second of the segment plays in full.
- **Trim bounds**: native trimmers reject an `end` past the real duration, and picker
  durations are rounded, so `segmentBounds()` clamps the segment and keeps a 50 ms margin
  from the very end. The player's precise duration replaces the picker's once loaded.
- **Scalability**: paged loading (20 per page) into FlashList with self-subscribing rows;
  `expo-image` with `recyclingKey` for thumbnails; a composite `(created_at, id)` index.
- **Bottom buttons**: `useBottomGap()` keeps bottom actions clear of the home indicator /
  navigation bar: ≈ 50 pt from the screen edge on iOS, ≈ 64 dp on Android (gesture or
  3-button navigation), and 16 from the edge on devices without a system bar.
- **Reusable components**: see *Components: commons and specifics* above. `MetadataForm` is
  shared by the crop flow and the edit screen.
- **Theme**: the choice is applied with NativeWind's `colorScheme.set()`, which overrides
  React Native's app-wide `Appearance`. So Tailwind `dark:` classes, `useColorScheme()`-based
  colours (headers, icons) and native UI (alerts, keyboard, video controls) all switch
  together. "System" follows the device.
- **Settings persistence**: a Zustand `persist` store backed by `KeyValueStorage`, which wraps
  `expo-sqlite/kv-store`'s **synchronous** API. Only `theme` and `language` are saved, under
  the app-prefixed key `video-diary/settings`. Preferences are restored before the first
  render, so there's no flash of the wrong theme or language on launch.
- **i18n**: i18next with bundled resources, initialised synchronously. "Device language" picks
  the first supported language from the device's list (falls back to English) and is
  re-checked when the app returns to the foreground (Android doesn't restart on a language
  change). Translations are typed: every locale must match `i18n/locales/en`, so a missing key
  fails `tsc`, and a unit test checks that every locale uses the same `{{placeholders}}`.
  Validation and crop errors carry translation keys, not English text, so they're translated
  at render time. Dates are formatted for the active language.

### Adding a language

1. Copy `src/i18n/locales/en/` to e.g. `src/i18n/locales/fr/`, translate it (typed as
   `Translation`) and export it from `src/i18n/locales/index.ts`.
2. Add the code to `AppLanguage` (`src/i18n/languages/types.ts`), to `SUPPORTED_LANGUAGES` and
   `NATIVE_LANGUAGE_NAMES` (`src/i18n/languages/index.ts`), and register it in `resources` in
   `src/i18n/instance/index.ts`.
3. Add a `languages.fr` name to every locale, and `fr` to `supportedLocales` of the
   `expo-localization` plugin in `app.json`.

## Testing

```bash
npm test
```

Unit tests cover segment math, formatting and text truncation, the Yup schema, all three
Zustand stores (including settings persistence and paging), the services (`VideoService` crop
pipeline with rollback, paging, orphaned-file clean-up, details update, delete, filmstrip
timing, player helpers and error codes; `SqliteVideoRepository` SQL, parameters and row
mapping; `SqliteDatabase` migrations; `KeyValueStorage`)
using injected fakes instead of module mocks, device-language selection, and locale
completeness (same keys and placeholders in every language).

## Supported devices

- **iOS**: iPhone and iPad running **iOS 16.4 or newer** (Expo SDK 57 deployment target).
- **Android**: phones and tablets running **Android 7.0 (API 24) or newer** (`minSdkVersion`).

The layout adapts to screen size and safe areas, so no device-specific setup is needed.

## Known limitations

- The selected segment always has a fixed length (5 s, or the whole source if it's shorter).
  You choose where it starts and ends by moving the window, not by resizing it.
- Clips are kept in the app's own storage. Deleting the app deletes the diary.
- No web support: `expo-trim-video` is native-only.
- **Android trim accuracy (`expo-trim-video`).** On iOS the library re-encodes with
  `AVAssetExportSession`, so clips are frame-accurate: a 9.646–14.646 s selection produced
  exactly 150 frames, 9.667–14.633 s. On Android it copies samples without re-encoding
  (`MediaExtractor` + `MediaMuxer`) and seeks with `SEEK_TO_CLOSEST_SYNC`:
  - The **video** starts at the keyframe nearest to the selected start, which can be before or
    after it, while the **audio** starts at the selected time. When they differ, the clip opens
    on a frozen first video frame until the video catches up, and the selected segment isn't
    exactly what's kept. With a test video whose keyframes are 8.3 s apart, a 15.0–19.95 s
    selection produced audio from 0 s but video only from 1.57 s (source 16.67–19.77 s).
    Camera footage usually has a keyframe about every second, so the effect is smaller but can
    still be visible.
  - Copying stops at the first sample (audio or video) past the end, so the clip can be a few
    frames short.
  - Selections starting at 0 s are unaffected.

  The case asks for `expo-trim-video`, so the app uses it unmodified. Making Android
  frame-accurate would mean re-encoding inside the library (for example with Media3
  Transformer, which the app already ships through `expo-video`) or contributing that upstream.
- The in-app language applies to the app's own UI. System-provided screens such as the video
  picker use the device language.
