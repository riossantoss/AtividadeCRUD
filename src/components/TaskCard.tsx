import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Task } from '../types/Task';
import { colors, typography, spacing, radius } from './theme';

interface TaskCardProps {
  task: Task;
  onPress: () => void;
  onToggle: () => void;
  onDelete: () => void;
}

const PRIORITY_COLORS = {
  low: colors.priorityLow,
  medium: colors.priorityMedium,
  high: colors.priorityHigh,
};

const PRIORITY_LABELS = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
};

export function TaskCard({ task, onPress, onToggle, onDelete }: TaskCardProps) {
  const priorityColor = PRIORITY_COLORS[task.priority];

  const handleDelete = () => {
    Alert.alert(
      'Excluir tarefa',
      `Deseja excluir "${task.title}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: onDelete },
      ]
    );
  };

  return (
    <TouchableOpacity
      style={[styles.card, task.completed && styles.cardCompleted]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      {/* Priority bar */}
      <View style={[styles.priorityBar, { backgroundColor: priorityColor }]} />

      <View style={styles.content}>
        {/* Header row */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={onToggle} style={styles.checkbox}>
            {task.completed ? (
              <Ionicons name="checkmark-circle" size={22} color={colors.accent} />
            ) : (
              <Ionicons name="ellipse-outline" size={22} color={colors.textMuted} />
            )}
          </TouchableOpacity>

          <Text
            style={[styles.title, task.completed && styles.titleCompleted]}
            numberOfLines={1}
          >
            {task.title}
          </Text>

          <TouchableOpacity onPress={handleDelete} style={styles.deleteBtn}>
            <Ionicons name="trash-outline" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Description */}
        {task.description.length > 0 && (
          <Text style={styles.description} numberOfLines={2}>
            {task.description}
          </Text>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <View style={[styles.badge, { borderColor: priorityColor + '55', backgroundColor: priorityColor + '15' }]}>
            <View style={[styles.badgeDot, { backgroundColor: priorityColor }]} />
            <Text style={[styles.badgeText, { color: priorityColor }]}>
              {PRIORITY_LABELS[task.priority]}
            </Text>
          </View>

          <Text style={styles.date}>
            {new Date(task.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardCompleted: {
    opacity: 0.5,
  },
  priorityBar: {
    width: 3,
  },
  content: {
    flex: 1,
    padding: spacing.md,
    gap: spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  checkbox: {
    padding: 2,
  },
  title: {
    flex: 1,
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
    color: colors.text,
    letterSpacing: -0.3,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
  deleteBtn: {
    padding: 4,
  },
  description: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    lineHeight: 18,
    marginLeft: 30,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 30,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  badgeDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  badgeText: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  date: {
    fontSize: typography.size.xs,
    color: colors.textMuted,
  },
});
