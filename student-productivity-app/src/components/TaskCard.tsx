import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Task } from '../types';
import { colors, priorityColors, radius, spacing } from '../constants/theme';
import { formatDeadline, formatDuration } from '../utils/date';
import { previewTaskExp } from '../utils/exp';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, onToggle, onDelete }: TaskCardProps) {
  const deadline = formatDeadline(task.deadline);
  const expValue = task.completed ? task.expAwarded ?? 0 : previewTaskExp(task);

  return (
    <View style={[styles.card, task.completed && styles.cardCompleted]}>
      <Pressable
        onPress={() => onToggle(task.id)}
        hitSlop={8}
        style={[
          styles.checkbox,
          task.completed && { backgroundColor: colors.success, borderColor: colors.success },
        ]}
      >
        {task.completed && <Ionicons name="checkmark" size={16} color={colors.background} />}
      </Pressable>

      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text
            style={[styles.title, task.completed && styles.titleCompleted]}
            numberOfLines={1}
          >
            {task.title}
          </Text>
          <View
            style={[
              styles.priorityDot,
              { backgroundColor: priorityColors[task.priority] },
            ]}
          />
        </View>

        {!!task.description && (
          <Text style={styles.description} numberOfLines={2}>
            {task.description}
          </Text>
        )}

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={13} color={colors.textMuted} />
            <Text style={styles.metaText}>{formatDuration(task.durationMinutes)}</Text>
          </View>
          {deadline && (
            <View style={styles.metaItem}>
              <Ionicons name="calendar-outline" size={13} color={colors.textMuted} />
              <Text style={styles.metaText}>{deadline}</Text>
            </View>
          )}
          <View style={styles.metaItem}>
            <Ionicons name="flash-outline" size={13} color={colors.accent} />
            <Text style={[styles.metaText, { color: colors.accent }]}>
              {task.completed ? '+' : '~'}
              {expValue} EXP
            </Text>
          </View>
        </View>
      </View>

      <Pressable onPress={() => onDelete(task.id)} hitSlop={10} style={styles.deleteButton}>
        <Ionicons name="trash-outline" size={16} color={colors.textMuted} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    padding: spacing.md,
    marginBottom: spacing.sm,
    alignItems: 'flex-start',
  },
  cardCompleted: {
    opacity: 0.55,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginRight: spacing.md,
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
    flexShrink: 1,
    marginRight: spacing.sm,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textSecondary,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  description: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 4,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    color: colors.textMuted,
    fontSize: 12,
  },
  deleteButton: {
    padding: 4,
    marginLeft: spacing.sm,
  },
});
