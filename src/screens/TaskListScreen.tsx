import React, { useEffect, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { TaskListNavigationProp } from '../types/Navigation';
import { useTasks } from '../hooks/useTasks';
import { TaskCard } from '../components/TaskCard';
import { EmptyState } from '../components/EmptyState';
import { colors, typography, spacing, radius } from '../components/theme';
import { Task } from '../types/Task';

export function TaskListScreen() {
  const navigation = useNavigation<TaskListNavigationProp>();
  const { tasks, loading, error, fetchTasks, toggleComplete, deleteTask } = useTasks();

  useFocusEffect(
    React.useCallback(() => {
      fetchTasks();
    }, [fetchTasks])
  );

  const pending = tasks.filter(t => !t.completed).length;
  const done = tasks.filter(t => t.completed).length;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerLabel}>MINHAS TAREFAS</Text>
          <Text style={styles.headerTitle}>
            {pending > 0 ? `${pending} pendente${pending !== 1 ? 's' : ''}` : 'Tudo feito! 🎉'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('TaskForm')}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={24} color={colors.bg} />
        </TouchableOpacity>
      </View>

      {/* Stats bar */}
      {tasks.length > 0 && (
        <View style={styles.statsBar}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{tasks.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={[styles.statNumber, { color: colors.accent }]}>{pending}</Text>
            <Text style={styles.statLabel}>Pendentes</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={[styles.statNumber, { color: colors.priorityLow }]}>{done}</Text>
            <Text style={styles.statLabel}>Concluídas</Text>
          </View>
        </View>
      )}

      {/* Content */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.accent} size="large" />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Ionicons name="alert-circle-outline" size={40} color={colors.danger} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={fetchTasks} style={styles.retryBtn}>
            <Text style={styles.retryText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList<Task>
          data={tasks}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <TaskCard
              task={item}
              onPress={() => navigation.navigate('TaskDetail', { taskId: item.id })}
              onToggle={() => toggleComplete(item.id, !item.completed)}
              onDelete={() => deleteTask(item.id)}
            />
          )}
          ListEmptyComponent={<EmptyState />}
          contentContainerStyle={[
            styles.list,
            tasks.length === 0 && styles.listEmpty,
          ]}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },
  headerLabel: {
    fontSize: typography.size.xs,
    color: colors.textMuted,
    fontWeight: typography.weight.bold,
    letterSpacing: 2,
  },
  headerTitle: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.text,
    letterSpacing: -0.8,
    marginTop: 2,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsBar: {
    flexDirection: 'row',
    marginHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
    paddingVertical: spacing.md,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  statNumber: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: colors.text,
  },
  statLabel: {
    fontSize: typography.size.xs,
    color: colors.textMuted,
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginVertical: 4,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  listEmpty: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  errorText: {
    color: colors.danger,
    fontSize: typography.size.base,
  },
  retryBtn: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  retryText: {
    color: colors.accent,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
  },
});
