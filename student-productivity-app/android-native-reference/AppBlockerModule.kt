package com.studentproductivity.app.focusblocker

import android.app.AppOpsManager
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.Process
import android.provider.Settings
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableArray

/**
 * JS-facing bridge for Focus Mode. Exposed to React Native as
 * `NativeModules.AppBlockerModule`, matching src/native/AppBlockerModule.ts
 * on the JS side one-to-one. See android-native-reference/README.md for
 * how this plugs into a prebuilt Android project.
 */
class AppBlockerModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName() = "AppBlockerModule"

    @ReactMethod
    fun startBlocking(packages: ReadableArray, durationMs: Double, promise: Promise) {
        val ctx = reactApplicationContext
        val blockedList = ArrayList<String>()
        for (i in 0 until packages.size()) {
            blockedList.add(packages.getString(i))
        }

        val intent = Intent(ctx, UsageMonitorService::class.java).apply {
            action = UsageMonitorService.ACTION_START
            putStringArrayListExtra(UsageMonitorService.EXTRA_BLOCKED_PACKAGES, blockedList)
            putExtra(UsageMonitorService.EXTRA_END_AT, System.currentTimeMillis() + durationMs.toLong())
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            ctx.startForegroundService(intent)
        } else {
            ctx.startService(intent)
        }
        promise.resolve(null)
    }

    @ReactMethod
    fun stopBlocking(promise: Promise) {
        val ctx = reactApplicationContext
        ctx.startService(
            Intent(ctx, UsageMonitorService::class.java).apply {
                action = UsageMonitorService.ACTION_STOP
            }
        )
        promise.resolve(null)
    }

    /**
     * PACKAGE_USAGE_STATS is a "special app access" permission — it
     * cannot be requested through the normal runtime permission dialog
     * (ActivityCompat.requestPermissions). The only way to grant it is
     * for the user to flip it on manually in system Settings, which is
     * why this checks current state rather than requesting it directly.
     */
    @ReactMethod
    fun hasUsageAccess(promise: Promise) {
        val ctx = reactApplicationContext
        val appOps = ctx.getSystemService(Context.APP_OPS_SERVICE) as AppOpsManager
        val mode = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            appOps.unsafeCheckOpNoThrow(
                AppOpsManager.OPSTR_GET_USAGE_STATS, Process.myUid(), ctx.packageName
            )
        } else {
            @Suppress("DEPRECATION")
            appOps.checkOpNoThrow(
                AppOpsManager.OPSTR_GET_USAGE_STATS, Process.myUid(), ctx.packageName
            )
        }
        promise.resolve(mode == AppOpsManager.MODE_ALLOWED)
    }

    @ReactMethod
    fun requestUsageAccess(promise: Promise) {
        val ctx = reactApplicationContext
        val intent = Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS).apply {
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            data = Uri.parse("package:${ctx.packageName}")
        }
        ctx.startActivity(intent)
        promise.resolve(null)
    }

    /**
     * Not required by the default blocking strategy in this reference
     * (see UsageMonitorService — it uses an Activity takeover, not a
     * system overlay window), but exposed for teams that want to layer
     * a true SYSTEM_ALERT_WINDOW overlay on top for zero-flicker
     * blocking. See README.md "Focus Mode" section for the trade-off.
     */
    @ReactMethod
    fun hasOverlayPermission(promise: Promise) {
        val ctx = reactApplicationContext
        val granted = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            Settings.canDrawOverlays(ctx)
        } else {
            true
        }
        promise.resolve(granted)
    }

    @ReactMethod
    fun requestOverlayPermission(promise: Promise) {
        val ctx = reactApplicationContext
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            ctx.startActivity(
                Intent(
                    Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                    Uri.parse("package:${ctx.packageName}")
                ).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            )
        }
        promise.resolve(null)
    }
}
