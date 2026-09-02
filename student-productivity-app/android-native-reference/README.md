# Focus Mode native module — wiring instructions

This folder is **reference Kotlin code**, not auto-linked. It only takes
effect after you eject the Expo managed workflow into a real Android
project (`expo prebuild`), because it needs a `UsageStatsManager`,
a foreground `Service`, and an `Activity` — none of which exist in
Expo Go or a plain managed-workflow build. See the root `README.md`
("Focus Mode: Android app-blocking feasibility") for why.

## What's here

| File | Role |
|---|---|
| `AppBlockerModule.kt` | The React Native native module — implements the JS-facing methods declared in `src/native/AppBlockerModule.ts`. |
| `AppBlockerPackage.kt` | Registers the module with React Native's package list. |
| `UsageMonitorService.kt` | Foreground service that polls `UsageStatsManager` once a second while a session is active and detects the blocked app coming to the foreground. |
| `BlockOverlayActivity.kt` | Full-screen takeover launched when a blocked app is detected. |

## One-time setup

1. Generate the native Android project (safe to re-run; it regenerates
   `android/` from `app.json` + your config plugins each time):

   ```bash
   npx expo prebuild -p android
   ```

   The `withFocusBlockerAndroid` config plugin (already wired into
   `app.json`) adds the required permissions and registers the service
   and activity in `AndroidManifest.xml` automatically on every
   prebuild. You only need to do the two manual steps below once per
   fresh `android/` folder.

2. Copy the four `.kt` files into the package folder prebuild expects
   (create the directories if they don't exist):

   ```bash
   mkdir -p android/app/src/main/java/com/studentproductivity/app/focusblocker
   cp android-native-reference/*.kt android/app/src/main/java/com/studentproductivity/app/focusblocker/
   ```

3. Register the package in `MainApplication.kt`
   (`android/app/src/main/java/com/studentproductivity/app/MainApplication.kt`).
   Find the `getPackages()` override and add one line:

   ```kotlin
   override fun getPackages(): List<ReactPackage> {
       val packages = PackageList(this).packages
       packages.add(com.studentproductivity.app.focusblocker.AppBlockerPackage()) // <-- add this
       return packages
   }
   ```

4. Rebuild:

   ```bash
   npx expo run:android
   ```

`NativeModules.AppBlockerModule` is now real. `src/native/AppBlockerModule.ts`
needs no code changes — it already feature-detects the native module and
switches out of simulation mode automatically once this exists.

## Runtime permissions the user must grant manually

Both of these are "special app access" grants — Android does not allow
requesting them through the normal runtime permission dialog:

- **Usage access** (`hasUsageAccess` / `requestUsageAccess`): Settings →
  Apps → Special app access → Usage access → (your app) → Allow.
  Required for the service to see which app is in the foreground at all.
- **Draw over other apps** (`hasOverlayPermission` / `requestOverlayPermission`):
  only needed if you extend this reference to also show a true
  `SYSTEM_ALERT_WINDOW` overlay (see the note in `AppBlockerModule.kt`).
  The default blocking strategy here (an `Activity` takeover) does not
  require it.

Build a small onboarding step in `FocusScreen` that calls
`AppBlocker.hasUsageAccess()` and, if `false`, shows a prompt with a
button that calls `AppBlocker.requestUsageAccess()` before letting the
user start a session — otherwise the block silently does nothing.
