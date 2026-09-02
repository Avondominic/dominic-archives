package com.studentproductivity.app.focusblocker

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.os.CountDownTimer
import android.view.Gravity
import android.view.WindowManager
import android.widget.Button
import android.widget.LinearLayout
import android.widget.TextView

/**
 * Full-screen takeover shown whenever UsageMonitorService detects a
 * blocked app in the foreground. Deliberately an Activity rather than a
 * SYSTEM_ALERT_WINDOW overlay: it needs no extra "draw over other apps"
 * permission (a permission the Play Store scrutinizes heavily), and
 * `singleTask` launch mode plus the service re-triggering it on the next
 * poll tick makes it reappear immediately if the user backs out.
 *
 * Being honest about the ceiling here: without Device Owner / kiosk
 * mode provisioning, no third-party Android app can make Back or Home
 * truly inert — the OS reserves those for the user. This is a strong,
 * repeated nudge, not an unbreakable jail. See README.md "Focus Mode:
 * Android app-blocking feasibility" for the full breakdown of what each
 * approach can and can't guarantee.
 */
class BlockOverlayActivity : Activity() {

    private var countdownTimer: CountDownTimer? = null

    companion object {
        const val EXTRA_BLOCKED_PACKAGE = "blockedPackage"
        const val EXTRA_END_AT = "endAt"
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        window.addFlags(
            WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED or
                WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON
        )

        val blockedPackage = intent.getStringExtra(EXTRA_BLOCKED_PACKAGE) ?: ""
        val endAt = intent.getLongExtra(EXTRA_END_AT, System.currentTimeMillis())

        setContentView(buildLayout(blockedPackage))
        startCountdown(endAt)
    }

    private fun buildLayout(blockedPackage: String): LinearLayout {
        val root = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            gravity = Gravity.CENTER
            setBackgroundColor(0xFF08080B.toInt())
            setPadding(64, 64, 64, 64)
        }

        val title = TextView(this).apply {
            text = "Focus Session Active"
            textSize = 22f
            setTextColor(0xFFEDEDF2.toInt())
            gravity = Gravity.CENTER
        }

        val subtitle = TextView(this).apply {
            text = "${appLabel(blockedPackage)} is locked while you're studying."
            textSize = 14f
            setTextColor(0xFF8E8E9A.toInt())
            gravity = Gravity.CENTER
            setPadding(0, 16, 0, 32)
        }

        val homeButton = Button(this).apply {
            text = "Back to Focus"
            setOnClickListener {
                startActivity(
                    Intent(Intent.ACTION_MAIN).apply {
                        addCategory(Intent.CATEGORY_HOME)
                        addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                    }
                )
                finish()
            }
        }

        root.addView(title)
        root.addView(subtitle)
        root.addView(homeButton)
        return root
    }

    private fun appLabel(packageName: String): String =
        try {
            val pm = packageManager
            pm.getApplicationLabel(pm.getApplicationInfo(packageName, 0)).toString()
        } catch (e: Exception) {
            "This app"
        }

    private fun startCountdown(endAt: Long) {
        val remaining = (endAt - System.currentTimeMillis()).coerceAtLeast(0L)
        countdownTimer = object : CountDownTimer(remaining, 1000L) {
            override fun onTick(millisUntilFinished: Long) {}
            override fun onFinish() {
                finish()
            }
        }.also { it.start() }
    }

    override fun onDestroy() {
        countdownTimer?.cancel()
        super.onDestroy()
    }
}
