import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../../src/components/Screen';
import { TaskCard } from '../../src/components/TaskCard';
import { AddTaskSheet } from '../../src/components/AddTaskSheet';
import { LevelHeader } from '../../src/components/LevelHeader';
import { useAppStore } from '../../src/state/useAppStore';
import { colors, radius, spacing } from '../../src/constants/theme';

type Filter = 'active' | 'completed';

export default function TasksScreen() {
  const tasks = useAppStore((s) => s.tasks);
  const level = useAppStore((s) => s.level);
  const expIntoLevel = useAppStore((s) => s.expIntoLevel);
  const addTask = useAppStore((s) => s.addTask);
  const completeTask = useAppStore((s) => s.completeTask);
  const deleteTask = useAppStore((s) => s.deleteTask);
  const lastGain = useAppStore((s) => s.lastGain);
  const clearLastGain = useAppStore((s) => s.clearLastGain);

  const [sheetVisible, setSheetVisible] = useState(false);
  const [filter, setFilter] = useState<Filter>('active');

  const filtered = useMemo(
    () => tasks.filter((t) => (filter === 'active' ? !t.completed : t.completed)),
    [tasks, filter]
  );

  useEffect(() => {
    if (!lastGain) return;
    const timer = setTimeout(clearLastGain, 2600);
    return () => clearTimeout(timer);
  }, [lastGain, clearLastGain]);

  return (
    <Screen>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Your Tasks</Text>
          <Text style={styles.subGreeting}>
            {tasks.filter((t) => !t.completed).length} pending
          </Text>
        </View>
        <LevelHeader level={level} expIntoLevel={expIntoLevel} compact />
      </View>

      <View style={styles.tabsRow}>
        {(['active', 'completed'] as Filter[]).map((f) => (
          <Pressable
            key={f}
            onPress={() => setFilter(f)}
            style={[styles.filterTab, filter === f && styles.filterTabActive]}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f === 'active' ? 'Active' : 'Completed'}
            </Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(t) => t.id}
        renderItem={({ item }) => (
          <TaskCard task={item} onToggle={completeTask} onDelete={deleteTask} />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="moon-outline" size={28} color={colors.textMuted} />
            <Text style={styles.emptyText}>
              {filter === 'active'
                ? 'Nothing on deck. Add a task to get moving.'
                : 'No completed tasks yet.'}
            </Text>
          </View>
        }
      />

      {lastGain && (
        <View style={styles.toast}>
          <Ionicons name="flash" size={16} color={colors.accent} />
          <Text style={styles.toastText}>
            +{lastGain.amount} EXP — {lastGain.taskTitle}
            {lastGain.leveledUp ? ' · Level up!' : ''}
          </Text>
        </View>
      )}

      <Pressable style={styles.fab} onPress={() => setSheetVisible(true)}>
        <Ionicons name="add" size={28} color={colors.background} />
      </Pressable>

      <AddTaskSheet
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        onSubmit={addTask}
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
  },
  greeting: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: '800',
  },
  subGreeting: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
  tabsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  filterTab: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterTabActive: {
    borderColor: colors.accent,
    backgroundColor: colors.accentSoft,
  },
  filterText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  filterTextActive: {
    color: colors.accent,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 120,
  },
  empty: {
    alignItems: 'center',
    marginTop: 80,
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.accent,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  toast: {
    position: 'absolute',
    bottom: 96,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.backgroundElevated,
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: radius.pill,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  toastText: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
});
