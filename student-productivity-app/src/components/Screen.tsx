import React, { PropsWithChildren } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../constants/theme';

interface ScreenProps extends PropsWithChildren {
  style?: ViewStyle;
}

/** Shared full-bleed dark background so every tab feels like one
 * continuous environment rather than five separate "pages". */
export function Screen({ children, style }: ScreenProps) {
  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[colors.background, '#0C0C13', colors.background]}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={[styles.safeArea, style]} edges={['top', 'left', 'right']}>
        {children}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
  },
});
