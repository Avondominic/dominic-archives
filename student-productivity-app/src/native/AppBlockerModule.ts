import { NativeModules, Platform } from 'react-native';

/**
 * Bridge to a native Android module that does the real app-blocking work
 * (UsageStatsManager polling + a full-screen overlay). See
 * android-native-reference/ for the Kotlin implementation this interface
 * maps to, and README.md ("Focus Mode: Android app-blocking feasibility")
 * for why this can't be pure JavaScript.
 *
 * This file is safe to import from Expo Go / the managed workflow even
 * before the native module exists: every method feature-detects
 * `NativeModules.AppBlockerModule` and falls back to a harmless no-op
 * ("simulation mode") so the JS timer/UI in FocusScreen still works for
 * demoing the product experience. Once you run `expo prebuild` and wire
 * in the Kotlin files, the same calls start doing real OS-level blocking
 * with zero changes to the screen code.
 */
interface AppBlockerNativeInterface {
  startBlocking(packages: string[], durationMs: number): Promise<void>;
  stopBlocking(): Promise<void>;
  hasUsageAccess(): Promise<boolean>;
  requestUsageAccess(): Promise<void>;
  hasOverlayPermission(): Promise<boolean>;
  requestOverlayPermission(): Promise<void>;
}

const NativeAppBlocker: AppBlockerNativeInterface | undefined = NativeModules.AppBlockerModule;

const isSupported = Platform.OS === 'android' && !!NativeAppBlocker;

async function warnIfUnsupported(method: string) {
  if (!isSupported) {
    console.log(
      `[AppBlocker] ${method}() called but native module is unavailable ` +
        '(Expo Go, iOS, or prebuild not run yet) — running in simulation mode.'
    );
  }
}

export const AppBlocker = {
  isSupported,

  async startBlocking(packages: string[], durationMs: number): Promise<void> {
    await warnIfUnsupported('startBlocking');
    if (isSupported) return NativeAppBlocker!.startBlocking(packages, durationMs);
  },

  async stopBlocking(): Promise<void> {
    await warnIfUnsupported('stopBlocking');
    if (isSupported) return NativeAppBlocker!.stopBlocking();
  },

  async hasUsageAccess(): Promise<boolean> {
    if (isSupported) return NativeAppBlocker!.hasUsageAccess();
    return false;
  },

  async requestUsageAccess(): Promise<void> {
    await warnIfUnsupported('requestUsageAccess');
    if (isSupported) return NativeAppBlocker!.requestUsageAccess();
  },

  async hasOverlayPermission(): Promise<boolean> {
    if (isSupported) return NativeAppBlocker!.hasOverlayPermission();
    return false;
  },

  async requestOverlayPermission(): Promise<void> {
    await warnIfUnsupported('requestOverlayPermission');
    if (isSupported) return NativeAppBlocker!.requestOverlayPermission();
  },
};
