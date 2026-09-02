import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, rankColors } from '../constants/theme';

interface RankBadgeProps {
  rank: string;
  size?: 'sm' | 'md';
}

export function RankBadge({ rank, size = 'md' }: RankBadgeProps) {
  const tint = rankColors[rank] ?? colors.accent;
  const isSmall = size === 'sm';

  return (
    <View
      style={[
        styles.badge,
        {
          borderColor: tint,
          backgroundColor: `${tint}22`,
          paddingVertical: isSmall ? 3 : 6,
          paddingHorizontal: isSmall ? 8 : 12,
        },
      ]}
    >
      <View style={[styles.dot, { backgroundColor: tint }]} />
      <Text style={[styles.text, { color: tint, fontSize: isSmall ? 11 : 13 }]}>{rank}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  text: {
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
