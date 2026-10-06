# Video Diary

A React Native (Expo) app to keep a diary of short video moments: import a video, pick the
5 seconds you care about, give it a name and description, and keep it in a list you can come
back to.

Built for the SevenApps React Native case study.

## Features

| Area | What's there |
| --- | --- |
| **Clip list** (`/`) | Persistent list of cropped clips with poster thumbnails, duration badge and date. Tap to open. Empty and error states. |
| **Details** (`/video/[id]`) | Plays the clip (native controls, looping) with its name, description, date and length. Edit and delete actions. |
| **Crop modal** (`/crop`) | 3 steps with a progress indicator: **1. Select** a video from the library → **2. Trim** with a filmstrip scrubber and a draggable 5 s window (live looping preview of the selection) → **3. Details** (name + description) and **Crop & save**. |
| **Cropping** | `trimVideo` from `expo-trim-video`, run through a TanStack Query mutation. |
| **Edit** (`/video/[id]/edit`) — bonus | Edit name and description; changes are persisted. |
| **Settings** (`/settings`) | Gear icon on the clip list. **Appearance:** System / Light / Dark. **Language:** device language, English, Türkçe, Deutsch, Español. Both choices are saved and applied instantly. |
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

1. Tap **Crop your first clip** (or **New clip** once you have some).
2. **Choose from library** and pick a video.
3. Drag the purple frame along the filmstrip, or tap the strip to jump. The preview loops the
   selected 5 seconds. Tap the video to pause/play. Tap **Next**.
4. Enter a name (required, 2–60 chars) and an optional description (≤ 500 chars), then
   **Crop & save**. You land on the new clip's details page.
5. From details, use **Edit details** to change the text, or **Delete clip**.
6. Tap the gear icon on the clip list to open **Settings** and change the theme or language.

Videos shorter than 5 s are kept whole. Videos shorter than 1 s are rejected.

## Architecture

```
src/
├── app/                      # Expo Router routes (screens only)
│   ├── _layout.tsx           # Providers, theme, root stack, splash until hydrated
│   ├── index.tsx             # Clip list
│   ├── video/[id]/index.tsx  # Details
│   ├── video/[id]/edit.tsx   # Edit (modal)
│   ├── settings.tsx          # Theme + language
│   └── crop/                 # Crop modal: its own stack
│       ├── _layout.tsx
│       ├── index.tsx         # Step 1 – select
│       ├── trim.tsx          # Step 2 – scrub
│       └── details.tsx       # Step 3 – metadata + crop
├── components/               # VideoPlayer/VideoFrame, TrimScrubber, MetadataForm, VideoCard, ui/*
├── hooks/                    # TanStack mutations, filmstrip frames
├── services/                 # cropVideo pipeline, file storage
├── i18n/                     # i18next setup, supported languages, locales/{en,tr,de,es}.ts
├── db/                       # SQLite client, migrations, repository
├── store/                    # Zustand: video list, crop draft, persisted settings
├── lib/                      # constants, time math, Yup schema, theme, preferences, query client
└── types/
```

### Data flow

```
         ┌─────────── TanStack Query mutation (useCropVideoMutation) ───────────┐
Step 3 → │ trimVideo() → move clip to documents → thumbnail → INSERT into SQLite │ → Zustand add()
         └───────────────────────────────────────────────────────────────────────┘
App start: SQLite (source of truth) ──hydrate()──▶ Zustand video store ──selectors──▶ screens
```

- **SQLite is the source of truth.** All SQL lives in `db/videoRepository.ts`; schema changes
  go through versioned migrations (`PRAGMA user_version`) in `db/migrations.ts`.
- **Zustand** holds the in-memory list (`ids` + `byId`) hydrated at launch, plus the
  ephemeral crop-modal draft (`cropDraftStore`) shared by the three steps. List rows subscribe
  to their own record, so editing one clip re-renders only that row.
- **TanStack Query** runs every async write as a mutation (crop, update, delete), giving
  pending/error state to the UI. The crop modal can't be swiped away while a crop is running
  (`useIsMutating`). Mutations don't retry automatically since they write to disk.
- **Files.** The trimmer writes to a temp/cache location; the clip is moved to
  `Documents/videos/<id>.mp4` and a poster frame to `Documents/thumbnails/<id>.jpg`. Only
  **file names** go into the database, and URIs are resolved at runtime, because the iOS app
  container path can change between installs/updates. If the DB insert fails, the written
  files are removed.

### Notable details

- **Scrubber** (`TrimScrubber`): the filmstrip comes from `player.generateThumbnailsAsync`.
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
- **Scalability**: FlashList with memoized, self-subscribing rows; `expo-image` with
  `recyclingKey` for thumbnails; an index on `created_at`.
- **Reusable components**: `VideoPlayer` (self-contained) / `VideoFrame` (screen-driven
  player), `MetadataForm` (used by both the crop flow and the edit screen), `Button`,
  `EmptyState`, `StepIndicator`.
- **Theme**: the choice is applied with NativeWind's `colorScheme.set()`, which overrides
  React Native's app-wide `Appearance`. So Tailwind `dark:` classes, `useColorScheme()`-based
  colours (headers, icons) and native UI (alerts, keyboard, video controls) all switch
  together. "System" follows the device.
- **Settings persistence**: a Zustand `persist` store backed by `expo-sqlite/kv-store`'s
  **synchronous** API. Preferences are restored before the first render, so there's no
  flash of the wrong theme or language on launch.
- **i18n**: i18next with bundled resources, initialised synchronously. "Device language" picks
  the first supported language from the device's list (falls back to English) and is
  re-checked when the app returns to the foreground (Android doesn't restart on a language
  change). Translations are typed: every locale must match `locales/en.ts`, so a missing key
  fails `tsc`, and a unit test checks that every locale uses the same `{{placeholders}}`.
  Validation and crop errors carry translation keys, not English text, so they're translated
  at render time. Dates are formatted for the active language.

### Adding a language

1. Copy `src/i18n/locales/en.ts` to e.g. `fr.ts` and translate it (typed as `Translation`).
2. Add the code to `SUPPORTED_LANGUAGES` and `NATIVE_LANGUAGE_NAMES` in `src/i18n/languages.ts`,
   and register it in `resources` in `src/i18n/index.ts`.
3. Add a `languages.fr` name to every locale, and `fr` to `supportedLocales` of the
   `expo-localization` plugin in `app.json`.

## Testing

```bash
npm test
```

Unit tests cover segment math and formatting, the Yup schema, both Zustand stores, the
crop pipeline (trim → store → persist, rollback on DB failure, error mapping) with native
modules mocked, device-language selection, and locale completeness (same keys and
placeholders in every language).

Tested manually with dev builds on an **iOS Simulator** (iPhone 17 Pro, iOS 26.3, Xcode 27) and
an **Android emulator** (Pixel 9 Pro): select → scrub → validate → crop & save, a source shorter
than 5 s, editing, deleting (row and files removed), persistence across app restarts, and dark
mode. Saved clips were checked with `ffprobe` (exactly 5.000 s for a normal segment).

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
