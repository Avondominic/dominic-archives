const { withAndroidManifest } = require('@expo/config-plugins');

/**
 * Expo config plugin: adds the Android manifest entries Focus Mode needs
 * (permissions + the service/activity pair) during `expo prebuild`, so
 * you don't have to hand-edit AndroidManifest.xml after every prebuild.
 * The .kt source files themselves still need to be copied in manually —
 * see android-native-reference/README.md.
 */
const PERMISSIONS = [
  'android.permission.PACKAGE_USAGE_STATS',
  'android.permission.SYSTEM_ALERT_WINDOW',
  'android.permission.FOREGROUND_SERVICE',
];

function withFocusBlockerAndroid(config) {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults;
    const app = manifest.manifest.application[0];

    manifest.manifest.$['xmlns:tools'] = manifest.manifest.$['xmlns:tools'] || 'http://schemas.android.com/tools';
    manifest.manifest['uses-permission'] = manifest.manifest['uses-permission'] || [];

    PERMISSIONS.forEach((name) => {
      const exists = manifest.manifest['uses-permission'].some((p) => p.$['android:name'] === name);
      if (exists) return;

      const entry = { $: { 'android:name': name } };
      if (name === 'android.permission.PACKAGE_USAGE_STATS') {
        entry.$['tools:ignore'] = 'ProtectedPermissions';
      }
      manifest.manifest['uses-permission'].push(entry);
    });

    app.service = app.service || [];
    const hasService = app.service.some((s) => s.$['android:name'] === '.focusblocker.UsageMonitorService');
    if (!hasService) {
      app.service.push({
        $: {
          'android:name': '.focusblocker.UsageMonitorService',
          'android:exported': 'false',
          'android:foregroundServiceType': 'specialUse',
        },
      });
    }

    app.activity = app.activity || [];
    const hasActivity = app.activity.some((a) => a.$['android:name'] === '.focusblocker.BlockOverlayActivity');
    if (!hasActivity) {
      app.activity.push({
        $: {
          'android:name': '.focusblocker.BlockOverlayActivity',
          'android:exported': 'false',
          'android:launchMode': 'singleTask',
          'android:theme': '@style/Theme.AppCompat.NoActionBar',
        },
      });
    }

    return config;
  });
}

module.exports = withFocusBlockerAndroid;
