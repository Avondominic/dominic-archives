import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { NewTaskInput, Priority } from '../types';
import { colors, priorityColors, radius, spacing } from '../constants/theme';
import { previewTaskExp } from '../utils/exp';

interface AddTaskSheetProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (input: NewTaskInput) => void;
}

const PRIORITIES: Priority[] = ['Low', 'Medium', 'High'];
const DURATION_PRESETS = [15, 30, 60, 120];

export function AddTaskSheet({ visible, onClose, onSubmit }: AddTaskSheetProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [duration, setDuration] = useState('30');
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const durationMinutes = Math.max(1, parseInt(duration, 10) || 0);
  const canSubmit = title.trim().length > 0 && durationMinutes > 0;
  const expPreview = canSubmit
    ? previewTaskExp({ durationMinutes, priority, deadline: deadline?.toISOString() })
    : 0;

  function reset() {
    setTitle('');
    setDescription('');
    setPriority('Medium');
    setDuration('30');
    setDeadline(null);
  }

  function handleClose() {
    reset();
    onClose();
  }

  function handleSubmit() {
    if (!canSubmit) return;
    onSubmit({
      title,
      description,
      priority,
      durationMinutes,
      deadline: deadline?.toISOString(),
    });
    reset();
    onClose();
  }

  function onDateChange(_event: DateTimePickerEvent, selected?: Date) {
    setShowDatePicker(false);
    if (!selected) return;
    setDeadline((prev) => {
      const merged = new Date(selected);
      if (prev) merged.setHours(prev.getHours(), prev.getMinutes());
      return merged;
    });
  }

  function onTimeChange(_event: DateTimePickerEvent, selected?: Date) {
    setShowTimePicker(false);
    if (!selected) return;
    setDeadline((prev) => {
      const base = prev ?? new Date();
      const merged = new Date(base);
      merged.setHours(selected.getHours(), selected.getMinutes());
      return merged;
    });
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <View style={styles.backdrop}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.sheetWrapper}
        >
          <View style={styles.sheet}>
            <View style={styles.handle} />
            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <View style={styles.headerRow}>
                <Text style={styles.heading}>New Task</Text>
                <Pressable onPress={handleClose} hitSlop={10}>
                  <Ionicons name="close" size={22} color={colors.textSecondary} />
                </Pressable>
              </View>

              <Text style={styles.label}>Title</Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="e.g. Study Math — Chapter 4"
                placeholderTextColor={colors.textMuted}
                style={styles.input}
              />

              <Text style={styles.label}>Description (optional)</Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Any extra detail..."
                placeholderTextColor={colors.textMuted}
                style={[styles.input, styles.multiline]}
                multiline
              />

              <Text style={styles.label}>Priority</Text>
              <View style={styles.row}>
                {PRIORITIES.map((p) => {
                  const selected = p === priority;
                  const tint = priorityColors[p];
                  return (
                    <Pressable
                      key={p}
                      onPress={() => setPriority(p)}
                      style={[
                        styles.priorityOption,
                        {
                          borderColor: selected ? tint : colors.border,
                          backgroundColor: selected ? `${tint}22` : colors.surface,
                        },
                      ]}
                    >
                      <Text style={[styles.priorityText, selected && { color: tint }]}>{p}</Text>
                    </Pressable>
                  );
                })}
              </View>

              <Text style={styles.label}>Duration</Text>
              <View style={styles.row}>
                {DURATION_PRESETS.map((mins) => {
                  const selected = String(mins) === duration;
                  return (
                    <Pressable
                      key={mins}
                      onPress={() => setDuration(String(mins))}
                      style={[styles.durationChip, selected && styles.durationChipSelected]}
                    >
                      <Text
                        style={[styles.priorityText, selected && { color: colors.accent }]}
                      >
                        {mins < 60 ? `${mins}m` : `${mins / 60}h`}
                      </Text>
                    </Pressable>
                  );
                })}
                <TextInput
                  value={duration}
                  onChangeText={(t) => setDuration(t.replace(/[^0-9]/g, ''))}
                  keyboardType="number-pad"
                  style={styles.durationInput}
                />
              </View>

              <Text style={styles.label}>Deadline (optional)</Text>
              <View style={styles.row}>
                <Pressable style={styles.deadlineButton} onPress={() => setShowDatePicker(true)}>
                  <Ionicons name="calendar-outline" size={15} color={colors.textSecondary} />
                  <Text style={styles.deadlineText}>
                    {deadline ? deadline.toLocaleDateString() : 'Set date'}
                  </Text>
                </Pressable>
                <Pressable style={styles.deadlineButton} onPress={() => setShowTimePicker(true)}>
                  <Ionicons name="time-outline" size={15} color={colors.textSecondary} />
                  <Text style={styles.deadlineText}>
                    {deadline
                      ? deadline.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
                      : 'Set time'}
                  </Text>
                </Pressable>
                {deadline && (
                  <Pressable onPress={() => setDeadline(null)} hitSlop={10}>
                    <Ionicons name="close-circle" size={20} color={colors.textMuted} />
                  </Pressable>
                )}
              </View>

              {showDatePicker && (
                <DateTimePicker
                  value={deadline ?? new Date()}
                  mode="date"
                  onChange={onDateChange}
                  minimumDate={new Date()}
                />
              )}
              {showTimePicker && (
                <DateTimePicker value={deadline ?? new Date()} mode="time" onChange={onTimeChange} />
              )}

              <View style={styles.previewRow}>
                <Ionicons name="flash" size={16} color={colors.accent} />
                <Text style={styles.previewText}>
                  Worth ~{expPreview} EXP when completed{deadline ? ' on time' : ''}
                </Text>
              </View>

              <Pressable
                onPress={handleSubmit}
                disabled={!canSubmit}
                style={[styles.submitButton, !canSubmit && styles.submitButtonDisabled]}
              >
                <Text style={styles.submitText}>Add Task</Text>
              </Pressable>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  sheetWrapper: {
    maxHeight: '88%',
  },
  sheet: {
    backgroundColor: colors.backgroundElevated,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    borderBottomWidth: 0,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  heading: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
  },
  label: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.4,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    color: colors.textPrimary,
    fontSize: 15,
  },
  multiline: {
    minHeight: 70,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacing.sm,
  },
  priorityOption: {
    flex: 1,
    minWidth: 80,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  priorityText: {
    color: colors.textSecondary,
    fontWeight: '600',
    fontSize: 13,
  },
  durationChip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  durationChipSelected: {
    borderColor: colors.accent,
    backgroundColor: colors.accentSoft,
  },
  durationInput: {
    flex: 1,
    minWidth: 60,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  deadlineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  deadlineText: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.lg,
  },
  previewText: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  submitButton: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  submitButtonDisabled: {
    opacity: 0.4,
  },
  submitText: {
    color: colors.background,
    fontWeight: '700',
    fontSize: 15,
  },
});
