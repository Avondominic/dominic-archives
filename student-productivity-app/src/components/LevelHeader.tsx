import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../constants/theme';
import { expForLevel, getRankForLevel } from '../utils/exp';
import { ProgressBar } from './ProgressBar';
import { RankBadge } from './RankBadge';

interface LevelHeaderProps {
  level: number;
  expIntoLevel: number;
  compact?: boolean;
}

export function LevelHeader({ level, expIntoLevel, compact = false }: LevelHeaderProps) {
  const rank = getRankForLevel(level);
  const needed = expForLevel(level);
  const progress = needed > 0 ? expIntoLevel / needed : 0;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View>
          <Text style={styles.levelLabel}>LEVEL</Text>
          <Text style={[styles.levelNumber, compact && styles.levelNumberCompact]}>{level}</Text>
        </View>
        <RankBadge rank={rank.name} />
      </View>
      {!compact && (
        <>
          <ProgressBar progress={progress} />
          <Text style={styles.expLabel}>
            {expIntoLevel} / {needed} EXP to level {level + 1}
          </Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  levelLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  levelNumber: {
    color: colors.textPrimary,
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  levelNumberCompact: {
    fontSize: 22,
  },
  expLabel: {
    color: colors.textSecondary,
    fontSize: 12,
  },
});
