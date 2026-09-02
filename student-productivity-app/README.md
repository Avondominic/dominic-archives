# Student Productivity — Gamified Focus App (Prototype)

A React Native + Expo prototype: task management with EXP rewards, a
level/rank progression system, a Focus Mode app-blocker, and stubbed
Friends / Tutor Hub social tabs. Dark, restrained UI — no cartoon
gamification skin.

This README covers the three things asked for: the EXP/leveling design
rationale, the real technical story on Android app-blocking, and exact
commands to get from this source tree to an installable `.apk`.

---

## 1. Architecture & Logic

### EXP & Progression Logic

**The question was: base EXP purely on estimated time, or let a
Priority tag act as a multiplier?** Both, combined — neither alone
holds up:

- **Time alone** rewards padding. A student who marks "Reply to one
  email" as a 3-hour task earns more than one who does 45 focused
  minutes of real calculus. Any time-only formula gets gamed the first
  week.
- **Priority alone** (e.g. a flat 50/100/200 EXP per tag) rewards
  tagging everything "High" and ignores that a 3-hour task is
  genuinely more effort than a 10-minute one.

The formula in [`src/utils/exp.ts`](src/utils/exp.ts):

```
base   = sqrt(durationMinutes) × 8
exp    = base × priorityMultiplier         (Low ×0.75, Medium ×1.0, High ×1.4)
exp   ×= onTime ? 1.15 : 0.9               (only if a deadline was set)
exp    = max(5, round(exp))
```

Why square root, not linear: a 4-hour task gives ~2x the EXP of a
1-hour task, not 4x. Duration still matters, but diminishing returns
close off the "estimate everything as 6 hours" exploit while still
letting genuinely long study blocks out-earn short ones. Priority is
multiplicative on top of that, so a short-but-important task can beat
a long-but-trivial one:

| Task | Duration | Priority | Deadline hit? | EXP |
|---|---|---|---|---|
| Reorganize desk | 180 min | Low | — | 81 |
| Submit scholarship form | 20 min | High | on time | 58 |
| Study Math — Ch. 4 | 120 min | Medium | on time | 101 |
| Finish lab report | 90 min | High | **late** | 96 |
| Finish lab report | 90 min | High | on time | 122 |

(`previewTaskExp()` in the same file drives the live "~N EXP" preview
shown on the Add Task sheet and on each task card.)

**Leveling.** EXP required to clear level `n` is
`round(100 × n^1.35)` — fast early levels (hooks a new user in the
first session), a real grind by level 20+. Six rank tiers span a much
wider range of numeric levels so progression doesn't dead-end the
moment you reach a tier:

| Rank | Levels |
|---|---|
| Noob | 1–5 |
| Avg Avg | 6–10 |
| Try Hard | 11–15 |
| Geek | 16–20 |
| Nerd | 21–25 |
| Einstein | 26+ |

All of this lives in one file with no UI dependencies
(`getRankForLevel`, `applyExpGain`, `expForLevel`), so the numbers are
easy to retune without touching any screen.

### Focus Mode: Android app-blocking feasibility

**Short version: there is no public Android API for "prevent another
app from opening."** Every consumer app-blocker on the Play Store
(Freedom, One Sec, Digital Wellbeing itself) works around that with
one of a small number of techniques, each with real trade-offs:

| Approach | How it works | Ceiling |
|---|---|---|
| **UsageStatsManager polling + takeover** *(what's implemented here)* | A foreground service polls `queryEvents()` roughly once a second to see which app is in the foreground; if it's on the blocklist, launch a full-screen "locked" Activity over it. | Reliable, no scary permissions beyond Usage Access. Can't stop the user pressing Back/Home to escape for a second — it just re-triggers on the next poll tick. |
| **AccessibilityService** | Listens to window-state-changed events in real time (no polling lag) and can draw an overlay or force the user back. | More responsive, but Google's Play Store policy is strict about accessibility-service use for anything other than actual accessibility — a productivity app risks rejection or removal. |
| **VPN-based blocking** (`VpnService` + `addDisallowedApplication`) | Cuts network access for specific apps; the app opens but can't load feeds. | Doesn't require Usage Access or Overlay permissions, is Play-Store-friendlier, but only blocks *network*, not the app itself — fine for Instagram/TikTok/YouTube specifically since they're useless offline, weaker as a general solution. |
| **Device Owner (Android Enterprise / DPC)** | Full MDM-grade control — can genuinely disable app launches. | What Google Family Link uses. Requires the device to be provisioned as a managed device (factory reset + QR enrollment) — not something a normal user installs from the Play Store. Overkill for this product. |

There is no real, maintained package that does this off the shelf —
`react-native-manage-children` isn't a real published library (most
likely a mix-up with Android's *Family Link* / parental-control
tooling), and the couple of community `react-native-app-blocker`-style
packages that do exist are thin, unmaintained wrappers around exactly
the AccessibilityService technique above, with the same Play Store
risk. **The right move for this product is a small hand-rolled native
module** — it's maybe 200 lines of Kotlin, and you own exactly what
permissions it asks for.

That's what's in **[`android-native-reference/`](android-native-reference/)**:
`UsageStatsManager` polling in a foreground `Service`
(`UsageMonitorService.kt`) that launches a full-screen takeover
`Activity` (`BlockOverlayActivity.kt`) when a blocked package comes to
the foreground, bridged to JS via `AppBlockerModule.kt`. See that
folder's `README.md` for exact wiring steps, and
`src/native/AppBlockerModule.ts` for the JS-side interface (which
already runs in a safe "simulation mode" — real timer, no real
blocking — when the native module isn't present, so `FocusScreen`
works today in Expo Go without any native code).

**Important constraint this implies:** none of this works inside Expo
Go or a plain managed-workflow build — it needs `expo prebuild` (the
"bare"/custom-dev-client workflow) because it's real native code. The
build instructions below cover both paths.

**Two permissions, both "special access" — neither can be requested
via a normal runtime dialog:**

- `PACKAGE_USAGE_STATS` — user must enable it manually at Settings →
  Apps → Special app access → Usage access.
- `SYSTEM_ALERT_WINDOW` — declared for teams that want to extend this
  reference with a true overlay window; the default implementation
  here doesn't need it (see the note in `AppBlockerModule.kt`).

### Social & Community Features

Friends and Tutor Hub are UI-complete but data-mocked
(`src/constants/mockData.ts`) — no backend in this prototype. To make
them real: a backend (Firebase/Supabase, or a custom REST API) for
friend requests and live study-status, plus auth; Tutor Hub posts here
just deep-link out to a video URL (works fine for YouTube links as-is)
— for native in-app video you'd add a player component and, for
actual tutor uploads, a hosting pipeline (Mux, Cloudflare Stream, or
S3 + presigned uploads).

---

## 2. Core Code — what's included

```
student-productivity-app/
├─ app/                          Expo Router screens (file-based routing)
│  ├─ _layout.tsx                Root layout: gesture handler, safe area, status bar
│  └─ (tabs)/
│     ├─ _layout.tsx             Bottom tab navigator
│     ├─ index.tsx               Tasks — list, add, complete, EXP toast
│     ├─ focus.tsx               Focus Mode — app picker, duration, live countdown
│     ├─ profile.tsx             Level, EXP bar, full rank ladder
│     ├─ friends.tsx             Friends list (mock data)
│     └─ tutors.tsx              Tutor Hub video feed (mock data)
├─ src/
│  ├─ types/index.ts             Task, FocusSession, Friend, TutorPost, etc.
│  ├─ utils/exp.ts                EXP + leveling formulas (see above)
│  ├─ utils/date.ts               Deadline/duration/countdown formatting
│  ├─ state/useAppStore.ts        Zustand store — tasks, level/EXP, focus session; persisted to AsyncStorage
│  ├─ native/AppBlockerModule.ts  JS bridge to the native blocker, with a safe no-op fallback
│  ├─ constants/theme.ts          Colors, spacing, radius, rank colors
│  ├─ constants/mockData.ts       Distracting-apps list, mock friends & tutor posts
│  └─ components/                 Screen, TaskCard, AddTaskSheet, LevelHeader, ProgressBar, RankBadge, AppChip, DurationPicker
├─ android-native-reference/      Real Kotlin: the actual app-blocker (see its own README)
├─ plugins/withFocusBlockerAndroid.js   Expo config plugin — adds manifest entries on `expo prebuild`
├─ app.json, eas.json, babel.config.js, tsconfig.json, package.json
```

State management is a single Zustand store (`useAppStore`) — no
Redux boilerplate, and it's the only thing screens talk to. Adding a
task, completing it (which runs the EXP formula and handles
level-ups with carryover across multiple levels in one gain), and
managing the active focus session all live there. It's persisted to
`AsyncStorage` automatically, so progress survives an app restart.

Everything renders through a shared `<Screen>` wrapper (dark gradient
background + safe area) so the five tabs read as one continuous
environment. Nothing here pulls in a UI kit — it's plain
`StyleSheet` — so there's no dependency risk from a design library
going stale.

---

## 3. Build Instructions

This folder is already a complete, ready-to-run Expo project — you
don't need to scaffold anything with `create-expo-app`.

### Prerequisites

- Node.js 18+ and npm
- A phone (or emulator) with **Expo Go** installed, for the fastest
  iteration loop — [expo.dev/go](https://expo.dev/go)
- For **local** APK builds only: Android Studio (for the SDK + an
  emulator) and a JDK (17 recommended)
- For **cloud** APK builds (no Android Studio needed): a free
  [expo.dev](https://expo.dev) account

### Step 0 — install dependencies

```bash
cd student-productivity-app
npm install
npx expo install --fix
```

`expo install --fix` re-resolves every Expo-managed package (React
Native, Reanimated, Screens, etc.) to the exact versions your
installed Expo SDK expects — always trust it over the version numbers
committed in `package.json` here, since Expo ships new SDKs
periodically and this file will drift over time.

### Step 1 — run it now (no build needed)

```bash
npx expo start
```

Scan the QR code with Expo Go (Android) or press `a` for a connected
emulator. Tasks, EXP, leveling, Friends, and Tutor Hub all work fully
here. Focus Mode's timer and UI work too — real OS-level app-blocking
is the one thing that needs the native module below, and it degrades
gracefully to "simulation mode" (you'll see a small in-app notice)
until you build with prebuild.

### Step 2 — build an actual `.apk`

You have two options. **Option A (EAS, recommended)** builds in the
cloud and needs nothing but a browser to download the result; nothing
extra is installed on your machine. **Option B** builds fully locally
and is faster to iterate on once Android Studio is set up.

#### Option A — EAS cloud build

```bash
npm install -g eas-cli
eas login
eas build:configure          # links this project to your Expo account
eas build -p android --profile preview
```

`eas build:configure` will ask to create/confirm a project and writes
its ID into `app.json`'s `extra.eas.projectId` (replacing the
placeholder already there). The `preview` profile is already set up
in `eas.json` to produce an installable `.apk` (not the Play-Store
`.aab` the `production` profile makes) — this matches the exact
command shape mentioned in the task brief.

The build runs on Expo's servers (a few minutes); when it finishes,
the CLI prints a download link (also visible on your
[expo.dev](https://expo.dev/) dashboard). Download the `.apk` to your
phone and install it (enable "Install unknown apps" for your browser/
file manager if prompted).

> Note: this generates the app **without** the hand-wired native
> Focus-Mode blocker — Focus Mode will run in simulation mode. EAS
> builds from the checked-in source, and the native `.kt` files in
> `android-native-reference/` are deliberately not auto-copied in (see
> why in that folder's README). To ship the real blocker via EAS, run
> Option B's `expo prebuild` + wiring steps locally first, commit the
> resulting `android/` folder, then EAS build will pick it up.

#### Option B — local build with Gradle

```bash
npx expo prebuild -p android
```

This generates a real `android/` project from `app.json` + the
`withFocusBlockerAndroid` plugin (already wired in), including the
manifest permissions and component declarations Focus Mode needs.

To make the real app-blocker work (optional — skip this if you just
want the UI/EXP/task features on an APK): follow
[`android-native-reference/README.md`](android-native-reference/README.md)
to copy the four Kotlin files in and register the package — two small
manual edits, one time per fresh `prebuild`.

Then build:

```bash
cd android
./gradlew assembleDebug
```

The APK lands at:

```
android/app/build/outputs/apk/debug/app-debug.apk
```

Install it on a connected device or emulator:

```bash
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

(`assembleRelease` instead of `assembleDebug` produces a release-mode
build — faster/smaller, but unsigned unless you configure a signing
key in `android/app/build.gradle`; stick with `assembleDebug` for
testing on your own device.)

### Testing Focus Mode's real blocking

1. Install the APK on a **physical device** (emulators usually don't
   have Instagram/TikTok/etc. installed, and Usage Access behaves
   inconsistently on some emulator images).
2. Open the app once, then grant Usage Access manually: Settings →
   Apps → Special app access → Usage access → Student Productivity →
   Allow. (There's no in-app runtime prompt for this — it's an
   OS-level manual grant, see the feasibility section above.)
3. Start a Focus session, then try opening a blocked app — the
   takeover screen should appear within about a second.
