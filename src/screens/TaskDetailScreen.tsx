import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { TaskDetailNavigationProp, TaskDetailRouteProp } from '../types/Navigation';
import { Task } from '../types/Task';
import { getTaskById } from '../database/taskRepository';
import { useTasks } from '../hooks/useTasks';
import { colors, typography, spacing, radius } from '../components/theme';

const PRIORITY_COLORS = { low: colors.priorityLow, medium: colors.priorityMedium, high: colors.priorityHigh };
const PRIORITY_LABELS = { low: 'Baixa', medium: 'Média', high: 'Alta' };

export function TaskDetailScreen() {
  const navigation = useNavigation<TaskDetailNavigationProp>();
  const route = useRoute<TaskDetailRouteProp>();
  const { taskId } = route.params;

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  const { deleteTask, toggleComplete } = useTasks();

  const loadTask = async () => {
    setLoading(true);
    const data = await getTaskById(taskId);
    setTask(data);
    setLoading(false);
  };

  useFocusEffect(
    React.useCallback(() => { loadTask(); }, [taskId])
  );

  const handleDelete = () => {
    Alert.alert('Excluir tarefa', 'Tem certeza que deseja excluir esta tarefa?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir', style: 'destructive', onPress: async () => {
          await deleteTask(taskId);
          navigation.goBack();
        }
      },
    ]);
  };

  const handleToggle = async () => {
    if (!task) return;
    await toggleComplete(task.id, !task.completed);
    setTask(prev => prev ? { ...prev, completed: !prev.completed } : prev);
  };

  if (loading) {
    return <View style={styles.center}><ActivityIndicator color={colors.accent} size="large" /></View>;
  }

  if (!task) {
    return (
      <View style={styles.center}>
        <Text style={styles.notFound}>Tarefa não encontrada</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: colors.accent }}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const pColor = PRIORITY_COLORS[task.priority];

  return (
    <View style={styles.container}>
      {/* Navbar */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.navBtn}>
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.navActions}>
          <TouchableOpacity
            style={styles.navBtn}
            onPress={() => navigation.navigate('TaskForm', { taskId: task.id })}
          >
            <Ionicons name="pencil-outline" size={18} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.navBtn, styles.navBtnDanger]} onPress={handleDelete}>
            <Ionicons name="trash-outline" size={18} color={colors.danger} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Priority accent */}
        <View style={[styles.priorityAccent, { backgroundColor: pColor }]}>
          <Text style={[styles.priorityAccentText, { color: colors.bg }]}>
            {PRIORITY_LABELS[task.priority].toUpperCase()}
          </Text>
        </View>

        {/* Title */}
        <Text style={[styles.title, task.completed && styles.titleDone]}>
          {task.title}
        </Text>

        {/* Status toggle */}
        <TouchableOpacity
          style={[styles.statusBtn, task.completed && styles.statusBtnDone]}
          onPress={handleToggle}
          activeOpacity={0.8}
        >
          <Ionicons
            name={task.completed ? 'checkmark-circle' : 'ellipse-outline'}
            size={20}
            color={task.completed ? colors.bg : colors.textSecondary}
          />
          <Text style={[styles.statusText, task.completed && styles.statusTextDone]}>
            {task.completed ? 'Concluída' : 'Marcar como concluída'}
          </Text>
        </TouchableOpacity>

        {/* Description */}
        {task.description.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>DESCRIÇÃO</Text>
            <Text style={styles.description}>{task.description}</Text>
          </View>
        )}

        {/* Metadata */}
        <View style={styles.meta}>
          <View style={styles.metaRow}>
            <Ionicons name="calendar-outline" size={14} color={colors.textMuted} />
            <Text style={styles.metaText}>
              Criada em {new Date(task.createdAt).toLocaleDateString('pt-BR', {
                day: '2-digit', month: 'long', year: 'numeric'
              })}
            </Text>
          </View>
          <View style={styles.metaRow}>
            <Ionicons name="time-outline" size={14} color={colors.textMuted} />
            <Text style={styles.metaText}>
              Atualizada {new Date(task.updatedAt).toLocaleString('pt-BR', {
                day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
              })}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  notFound: { color: colors.textSecondary, fontSize: typography.size.base },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  navActions: { flexDirection: 'row', gap: spacing.sm },
  navBtn: {
    width: 36, height: 36,
    alignItems: 'center', justifyContent: 'center',
    borderRadius: radius.sm, backgroundColor: colors.surface,
  },
  navBtnDanger: { backgroundColor: colors.dangerFaint },
  scroll: { padding: spacing.lg, gap: spacing.lg },
  priorityAccent: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  priorityAccentText: {
    fontSize: typography.size.xs, fontWeight: typography.weight.bold, letterSpacing: 1.5,
  },
  title: {
    fontSize: typography.size['2xl'], fontWeight: typography.weight.bold,
    color: colors.text, letterSpacing: -1, lineHeight: 40,
  },
  titleDone: { textDecorationLine: 'line-through', color: colors.textMuted },
  statusBtn: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    paddingVertical: spacing.md, paddingHorizontal: spacing.md,
    borderRadius: radius.md, borderWidth: 1, borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  statusBtnDone: { backgroundColor: colors.accentFaint, borderColor: colors.accent + '44' },
  statusText: { fontSize: typography.size.sm, fontWeight: typography.weight.semibold, color: colors.textSecondary },
  statusTextDone: { color: colors.accent },
  section: { gap: spacing.sm },
  sectionLabel: {
    fontSize: typography.size.xs, fontWeight: typography.weight.bold,
    color: colors.textMuted, letterSpacing: 1.5,
  },
  description: {
    fontSize: typography.size.base, color: colors.textSecondary,
    lineHeight: 24, backgroundColor: colors.surface,
    borderRadius: radius.md, padding: spacing.md,
    borderWidth: 1, borderColor: colors.border,
  },
  meta: {
    gap: spacing.sm, paddingTop: spacing.md,
    borderTopWidth: 1, borderTopColor: colors.border,
  },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  metaText: { fontSize: typography.size.sm, color: colors.textMuted },
});
