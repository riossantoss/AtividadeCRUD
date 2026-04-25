import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from './theme';

export function EmptyState() {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Ionicons name="checkbox-outline" size={40} color={colors.accent} />
      </View>
      <Text style={styles.title}>Nenhuma tarefa</Text>
      <Text style={styles.subtitle}>
        Toque no botão{' '}
        <Text style={styles.highlight}>+</Text>
        {' '}para adicionar sua primeira tarefa
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.accentFaint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: colors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  highlight: {
    color: colors.accent,
    fontWeight: typography.weight.bold,
    fontSize: typography.size.md,
  },
});
