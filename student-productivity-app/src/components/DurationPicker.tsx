import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../constants/theme';

interface DurationPickerProps {
  options: number[];
  value: number;
  onChange: (minutes: number) => void;
}

export function DurationPicker({ options, value, onChange }: DurationPickerProps) {
  return (
    <View style={styles.row}>
      {options.map((minutes) => {
        const selected = minutes === value;
        return (
          <Pressable
            key={minutes}
            onPress={() => onChange(minutes)}
            style={[styles.option, selected && styles.optionSelected]}
          >
            <Text style={[styles.value, selected && styles.valueSelected]}>{minutes}</Text>
            <Text style={[styles.unit, selected && styles.valueSelected]}>min</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  option: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  optionSelected: {
    borderColor: colors.accent,
    backgroundColor: colors.accentSoft,
  },
  value: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  unit: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  valueSelected: {
    color: colors.accent,
  },
});
