import React, { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../../src/components/Screen';
import { AppChip } from '../../src/components/AppChip';
import { DurationPicker } from '../../src/components/DurationPicker';
import { useAppStore } from '../../src/state/useAppStore';
import { AppBlocker } from '../../src/native/AppBlockerModule';
import { DISTRACTING_APPS, FOCUS_DURATION_PRESETS } from '../../src/constants/mockData';
import { colors, radius, spacing } from '../../src/constants/theme';
import { formatCountdown } from '../../src/utils/date';

export default function FocusScreen() {
  const focusSession = useAppStore((s) => s.focusSession);
  const startFocusSession = useAppStore((s) => s.startFocusSession);
  const endFocusSession = useAppStore((s) => s.endFocusSession);

  const [selectedApps, setSelectedApps] = useState<string[]>(['instagram', 'tiktok']);
  const [duration, setDuration] = useState(40);
  const [remainingMs, setRemainingMs] = useState(0);

  useEffect(() => {
    if (!focusSession) {
      setRemainingMs(0);
      return;
    }
    const tick = () => {
      const remaining = new Date(focusSession.endsAt).getTime() - Date.now();
      if (remaining <= 0) {
        setRemainingMs(0);
        endFocusSession();
        AppBlocker.stopBlocking();
      } else {
        setRemainingMs(remaining);
      }
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [focusSession, endFocusSession]);

  function toggleApp(id: string) {
    setSelectedApps((prev) => (prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]));
  }

  async function handleStart() {
    if (selectedApps.length === 0) {
      Alert.alert('Pick at least one app', 'Select what you want blocked during this session.');
      return;
    }
    const packages = DISTRACTING_APPS.filter((a) => selectedApps.includes(a.id)).map(
      (a) => a.packageName
    );
    startFocusSession(packages, duration);
    await AppBlocker.startBlocking(packages, duration * 60_000);
  }

  function handleEndEarly() {
    Alert.alert('End focus session?', 'Blocked apps will unlock immediately.', [
      { text: 'Keep going', style: 'cancel' },
      {
        text: 'End session',
        style: 'destructive',
        onPress: async () => {
          endFocusSession();
          await AppBlocker.stopBlocking();
        },
      },
    ]);
  }

  if (focusSession) {
    const totalMs = focusSession.durationMinutes * 60_000;
    const progress = totalMs > 0 ? 1 - remainingMs / totalMs : 0;

    return (
      <Screen>
        <View style={styles.activeContainer}>
          <Text style={styles.activeLabel}>FOCUS ACTIVE</Text>
          <Text style={styles.timer}>{formatCountdown(remainingMs)}</Text>
          <Text style={styles.activeSub}>
            {focusSession.blockedApps.length} apps locked · {focusSession.durationMinutes} min
            session
          </Text>

          <View style={styles.ringTrack}>
            <View style={[styles.ringFill, { width: `${Math.min(100, progress * 100)}%` }]} />
          </View>

          <View style={styles.lockedAppsRow}>
            {focusSession.blockedApps.map((pkg) => (
              <View key={pkg} style={styles.lockedPill}>
                <Ionicons name="lock-closed" size={12} color={colors.textMuted} />
                <Text style={styles.lockedPillText}>{pkg.split('.').pop()}</Text>
              </View>
            ))}
          </View>

          <Pressable style={styles.endButton} onPress={handleEndEarly}>
            <Text style={styles.endButtonText}>End Session Early</Text>
          </Pressable>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>Focus Mode</Text>
        <Text style={styles.subheading}>Lock distracting apps and lock in.</Text>

        {!AppBlocker.isSupported && (
          <View style={styles.noticeBox}>
            <Ionicons name="information-circle-outline" size={16} color={colors.warning} />
            <Text style={styles.noticeText}>
              Running in simulation mode — the timer and UI work here, but real OS-level app
              blocking needs the native module in android-native-reference/. Run{' '}
              <Text style={styles.noticeCode}>expo prebuild</Text> and wire it in to enable it on
              a real device.
            </Text>
          </View>
        )}

        <Text style={styles.sectionLabel}>Block these apps</Text>
        <View style={styles.chipWrap}>
          {DISTRACTING_APPS.map((app) => (
            <AppChip
              key={app.id}
              label={app.label}
              selected={selectedApps.includes(app.id)}
              onPress={() => toggleApp(app.id)}
            />
          ))}
        </View>

        <Text style={styles.sectionLabel}>Duration</Text>
        <DurationPicker options={FOCUS_DURATION_PRESETS} value={duration} onChange={setDuration} />

        <Pressable style={styles.startButton} onPress={handleStart}>
          <Ionicons name="lock-closed" size={18} color={colors.background} />
          <Text style={styles.startButtonText}>Start Focus Session</Text>
        </Pressable>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  heading: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: '800',
  },
  subheading: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 4,
    marginBottom: spacing.lg,
  },
  noticeBox: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  noticeText: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },
  noticeCode: {
    color: colors.warning,
    fontFamily: 'monospace',
  },
  sectionLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.md,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: 16,
    marginTop: spacing.xl,
  },
  startButtonText: {
    color: colors.background,
    fontWeight: '700',
    fontSize: 15,
  },
  activeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  activeLabel: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
  },
  timer: {
    color: colors.textPrimary,
    fontSize: 56,
    fontWeight: '800',
    marginTop: spacing.sm,
    fontVariant: ['tabular-nums'],
  },
  activeSub: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: spacing.sm,
  },
  ringTrack: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    marginTop: spacing.xl,
    overflow: 'hidden',
  },
  ringFill: {
    height: '100%',
    backgroundColor: colors.accent,
  },
  lockedAppsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  lockedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  lockedPillText: {
    color: colors.textMuted,
    fontSize: 11,
    textTransform: 'capitalize',
  },
  endButton: {
    marginTop: spacing.xl * 1.5,
    paddingVertical: 12,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.danger,
  },
  endButtonText: {
    color: colors.danger,
    fontWeight: '600',
    fontSize: 13,
  },
});
