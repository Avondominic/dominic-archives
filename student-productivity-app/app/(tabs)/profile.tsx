import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../../src/components/Screen';
import { LevelHeader } from '../../src/components/LevelHeader';
import { useAppStore } from '../../src/state/useAppStore';
import { RANK_TIERS, getNextRank, getRankForLevel } from '../../src/utils/exp';
import { colors, radius, rankColors, spacing } from '../../src/constants/theme';

export default function ProfileScreen() {
  const level = useAppStore((s) => s.level);
  const expIntoLevel = useAppStore((s) => s.expIntoLevel);
  const totalExpEarned = useAppStore((s) => s.totalExpEarned);
  const tasksCompleted = useAppStore((s) => s.tasksCompleted);

  const currentRank = getRankForLevel(level);
  const nextRank = getNextRank(level);

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>Your Progress</Text>

        <View style={styles.card}>
          <LevelHeader level={level} expIntoLevel={expIntoLevel} />
        </View>

        {nextRank && (
          <Text style={styles.nextRankText}>
            {nextRank.minLevel - level} level{nextRank.minLevel - level === 1 ? '' : 's'} to{' '}
            <Text style={{ color: rankColors[nextRank.name] }}>{nextRank.name}</Text>
          </Text>
        )}

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons name="flash" size={18} color={colors.accent} />
            <Text style={styles.statValue}>{totalExpEarned}</Text>
            <Text style={styles.statLabel}>Total EXP</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="checkmark-done" size={18} color={colors.success} />
            <Text style={styles.statValue}>{tasksCompleted}</Text>
            <Text style={styles.statLabel}>Tasks Done</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>Rank Ladder</Text>
        <View style={styles.ladder}>
          {RANK_TIERS.map((tier, idx) => {
            const achieved = level >= tier.minLevel;
            const isCurrent = tier.name === currentRank.name;
            const tint = rankColors[tier.name];
            return (
              <View key={tier.name} style={styles.ladderRow}>
                <View style={styles.ladderLineWrap}>
                  <View
                    style={[
                      styles.ladderDot,
                      { borderColor: tint, backgroundColor: achieved ? tint : 'transparent' },
                    ]}
                  />
                  {idx < RANK_TIERS.length - 1 && (
                    <View
                      style={[
                        styles.ladderLine,
                        { backgroundColor: achieved ? tint : colors.border },
                      ]}
                    />
                  )}
                </View>
                <View style={styles.ladderInfo}>
                  <Text
                    style={[
                      styles.ladderName,
                      { color: achieved ? colors.textPrimary : colors.textMuted },
                      isCurrent && { color: tint },
                    ]}
                  >
                    {tier.name}
                    {isCurrent ? '  ·  you are here' : ''}
                  </Text>
                  <Text style={styles.ladderLevel}>Level {tier.minLevel}+</Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  heading: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    padding: spacing.lg,
  },
  nextRankText: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: spacing.sm,
    marginLeft: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    padding: spacing.md,
    alignItems: 'flex-start',
    gap: 4,
  },
  statValue: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '800',
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: 11,
  },
  sectionLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  ladder: {
    gap: 0,
  },
  ladderRow: {
    flexDirection: 'row',
  },
  ladderLineWrap: {
    alignItems: 'center',
    width: 24,
  },
  ladderDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
  },
  ladderLine: {
    width: 2,
    flex: 1,
    minHeight: 28,
  },
  ladderInfo: {
    flex: 1,
    paddingBottom: spacing.lg,
    marginLeft: spacing.sm,
  },
  ladderName: {
    fontSize: 15,
    fontWeight: '700',
  },
  ladderLevel: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
});
