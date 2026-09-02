import React from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../../src/components/Screen';
import { RankBadge } from '../../src/components/RankBadge';
import { MOCK_FRIENDS } from '../../src/constants/mockData';
import { Friend, FriendStatus } from '../../src/types';
import { colors, radius, spacing } from '../../src/constants/theme';

const STATUS_META: Record<FriendStatus, { label: string; color: string }> = {
  focused: { label: 'In Focus Mode', color: colors.accent },
  studying: { label: 'Studying', color: colors.success },
  idle: { label: 'Idle', color: colors.textMuted },
};

function FriendRow({ friend }: { friend: Friend }) {
  const status = STATUS_META[friend.status];
  return (
    <View style={styles.row}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{friend.name.charAt(0)}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{friend.name}</Text>
        <View style={styles.metaRow}>
          <RankBadge rank={friend.rank} size="sm" />
          <Text style={styles.level}>Lvl {friend.level}</Text>
        </View>
      </View>
      <View style={styles.statusWrap}>
        <View style={styles.statusRow}>
          <View style={[styles.statusDot, { backgroundColor: status.color }]} />
          <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
        </View>
        <Text style={styles.streak}>{friend.streakDays}d streak</Text>
      </View>
    </View>
  );
}

export default function FriendsScreen() {
  return (
    <Screen>
      <View style={styles.header}>
        <View>
          <Text style={styles.heading}>Friends</Text>
          <Text style={styles.subheading}>
            Prototype data — connect a backend for real requests & live status.
          </Text>
        </View>
        <Pressable
          style={styles.addButton}
          onPress={() => Alert.alert('Add Friend', 'Not wired to a backend in this prototype.')}
        >
          <Ionicons name="person-add-outline" size={16} color={colors.accent} />
        </Pressable>
      </View>

      <FlatList
        data={MOCK_FRIENDS}
        keyExtractor={(f) => f.id}
        renderItem={({ item }) => <FriendRow friend={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    marginBottom: spacing.lg,
  },
  heading: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: '800',
  },
  subheading: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
    maxWidth: 260,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    color: colors.textPrimary,
    fontWeight: '700',
    fontSize: 16,
  },
  info: {
    flex: 1,
    gap: 6,
  },
  name: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  level: {
    color: colors.textMuted,
    fontSize: 12,
  },
  statusWrap: {
    alignItems: 'flex-end',
    gap: 4,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  streak: {
    color: colors.textMuted,
    fontSize: 10,
  },
});
