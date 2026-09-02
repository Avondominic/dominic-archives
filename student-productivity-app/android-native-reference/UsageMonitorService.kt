package com.studentproductivity.app.focusblocker

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.app.usage.UsageEvents
import android.app.usage.UsageStatsManager
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.CountDownTimer
import android.os.IBinder
import androidx.core.app.NotificationCompat

/**
 * Foreground service that polls UsageStatsManager once a second while a
 * Focus session is active. When the currently-foregrounded app matches
 * one of the blocked packages, it takes the user to BlockOverlayActivity.
 *
 * Why polling instead of a push-style callback: Android has no public
 * "foreground app changed" broadcast for third-party apps (that would be
 * a privacy hole). UsageStatsManager.queryEvents is the sanctioned way
 * to reconstruct foreground/background transitions after the fact, so
 * every app-blocker on the Play Store that isn't a Device Owner app
 * polls it the same way, at roughly this interval.
 *
 * This is a minimal reference implementation. Production hardening you'd
 * want before shipping: persist `endAt` so the service survives process
 * death and restarts correctly (START_STICKY handles the common case but
 * not a full OS reboot — re-arm from the JS side via a stored session on
 * app start, mirroring FocusScreen's own resume logic), and de-dupe
 * consecutive identical events instead of relying on `lastForegroundPackage`
 * alone.
 */
class UsageMonitorService : Service() {

    private var blockedPackages: List<String> = emptyList()
    private var endAt: Long = 0L
    private var pollTimer: CountDownTimer? = null
    private var lastForegroundPackage: String? = null

    companion object {
        const val ACTION_START = "com.studentproductivity.app.focusblocker.START"
        const val ACTION_STOP = "com.studentproductivity.app.focusblocker.STOP"
        const val EXTRA_BLOCKED_PACKAGES = "blockedPackages"
        const val EXTRA_END_AT = "endAt"
        private const val CHANNEL_ID = "focus_session"
        private const val NOTIFICATION_ID = 1001
        private const val POLL_INTERVAL_MS = 1000L
    }

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        if (intent?.action == ACTION_STOP) {
            stopMonitoring()
            return START_NOT_STICKY
        }

        blockedPackages = intent?.getStringArrayListExtra(EXTRA_BLOCKED_PACKAGES) ?: emptyList()
        endAt = intent?.getLongExtra(EXTRA_END_AT, 0L) ?: 0L
        startForeground(NOTIFICATION_ID, buildNotification())
        startMonitoring()
        return START_STICKY
    }

    private fun startMonitoring() {
        pollTimer?.cancel()
        val remaining = (endAt - System.currentTimeMillis()).coerceAtLeast(0L)

        pollTimer = object : CountDownTimer(remaining, POLL_INTERVAL_MS) {
            override fun onTick(millisUntilFinished: Long) {
                checkForegroundApp()
            }

            override fun onFinish() {
                stopMonitoring()
            }
        }.also { it.start() }
    }

    private fun stopMonitoring() {
        pollTimer?.cancel()
        pollTimer = null
        stopForeground(STOP_FOREGROUND_REMOVE)
        stopSelf()
    }

    private fun checkForegroundApp() {
        val usm = getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
        val now = System.currentTimeMillis()
        val events = usm.queryEvents(now - 10_000, now)
        var foregroundPackage: String? = null
        val event = UsageEvents.Event()

        while (events.hasNextEvent()) {
            events.getNextEvent(event)
            if (event.eventType == UsageEvents.Event.MOVE_TO_FOREGROUND) {
                foregroundPackage = event.packageName
            }
        }

        if (foregroundPackage != null && foregroundPackage != lastForegroundPackage) {
            lastForegroundPackage = foregroundPackage
            if (blockedPackages.contains(foregroundPackage)) {
                launchBlockOverlay(foregroundPackage)
            }
        }
    }

    private fun launchBlockOverlay(blockedPackage: String) {
        val intent = Intent(this, BlockOverlayActivity::class.java).apply {
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP)
            putExtra(BlockOverlayActivity.EXTRA_BLOCKED_PACKAGE, blockedPackage)
            putExtra(BlockOverlayActivity.EXTRA_END_AT, endAt)
        }
        startActivity(intent)
    }

    private fun buildNotification(): Notification {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID, "Focus Session", NotificationManager.IMPORTANCE_LOW
            )
            getSystemService(NotificationManager::class.java).createNotificationChannel(channel)
        }
        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("Focus session active")
            .setContentText("${blockedPackages.size} app(s) locked until the timer ends")
            .setSmallIcon(android.R.drawable.ic_lock_lock)
            .setOngoing(true)
            .build()
    }

    override fun onDestroy() {
        pollTimer?.cancel()
        super.onDestroy()
    }
}
