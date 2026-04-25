import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { TaskFormNavigationProp, TaskFormRouteProp } from '../types/Navigation';
import { Priority } from '../types/Task';
import { getTaskById } from '../database/taskRepository';
import { useTasks } from '../hooks/useTasks';
import { colors, typography, spacing, radius } from '../components/theme';

const PRIORITIES: { value: Priority; label: string; color: string }[] = [
  { value: 'low', label: 'Baixa', color: colors.priorityLow },
  { value: 'medium', label: 'Média', color: colors.priorityMedium },
  { value: 'high', label: 'Alta', color: colors.priorityHigh },
];

export function TaskFormScreen() {
  const navigation = useNavigation<TaskFormNavigationProp>();
  const route = useRoute<TaskFormRouteProp>();
  const taskId = route.params?.taskId;
  const isEditing = !!taskId;

  const { createTask, updateTask } = useTasks();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [loadingInitial, setLoadingInitial] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEditing && taskId) {
      getTaskById(taskId).then(task => {
        if (task) {
          setTitle(task.title);
          setDescription(task.description);
          setPriority(task.priority);
        }
        setLoadingInitial(false);
      });
    }
  }, [taskId, isEditing]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Campo obrigatório', 'O título não pode estar vazio.');
      return;
    }

    setSubmitting(true);
    try {
      if (isEditing && taskId) {
        await updateTask(taskId, { title: title.trim(), description: description.trim(), priority });
      } else {
        await createTask({ title: title.trim(), description: description.trim(), priority });
      }
      navigation.goBack();
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível salvar a tarefa.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingInitial) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.accent} size="large" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Navbar */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.navBtn}>
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>{isEditing ? 'Editar Tarefa' : 'Nova Tarefa'}</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <View style={styles.field}>
          <Text style={styles.label}>TÍTULO</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Nome da tarefa..."
            placeholderTextColor={colors.textMuted}
            maxLength={100}
          />
        </View>

        {/* Description */}
        <View style={styles.field}>
          <Text style={styles.label}>DESCRIÇÃO</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Adicione mais detalhes..."
            placeholderTextColor={colors.textMuted}
            multiline
            numberOfLines={4}
            maxLength={500}
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>{description.length}/500</Text>
        </View>

        {/* Priority */}
        <View style={styles.field}>
          <Text style={styles.label}>PRIORIDADE</Text>
          <View style={styles.priorityRow}>
            {PRIORITIES.map(p => (
              <TouchableOpacity
                key={p.value}
                style={[
                  styles.priorityOption,
                  priority === p.value && { borderColor: p.color, backgroundColor: p.color + '18' },
                ]}
                onPress={() => setPriority(p.value)}
                activeOpacity={0.8}
              >
                <View style={[styles.priorityDot, { backgroundColor: p.color }]} />
                <Text
                  style={[
                    styles.priorityLabel,
                    { color: priority === p.value ? p.color : colors.textSecondary },
                  ]}
                >
                  {p.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Submit */}
        <TouchableOpacity
          style={[styles.submitBtn, submitting && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
          activeOpacity={0.85}
        >
          {submitting ? (
            <ActivityIndicator color={colors.bg} size="small" />
          ) : (
            <>
              <Ionicons name={isEditing ? 'checkmark' : 'add'} size={20} color={colors.bg} />
              <Text style={styles.submitText}>
                {isEditing ? 'Salvar alterações' : 'Criar tarefa'}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
  },
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
  navBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
  },
  navTitle: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.bold,
    color: colors.text,
    letterSpacing: -0.3,
  },
  scroll: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  field: {
    gap: spacing.sm,
  },
  label: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
    color: colors.textMuted,
    letterSpacing: 1.5,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: typography.size.base,
    color: colors.text,
  },
  textarea: {
    minHeight: 100,
    paddingTop: spacing.md,
  },
  charCount: {
    alignSelf: 'flex-end',
    fontSize: typography.size.xs,
    color: colors.textMuted,
  },
  priorityRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  priorityOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  priorityLabel: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: spacing.md + 2,
    marginTop: spacing.md,
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitText: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.bold,
    color: colors.bg,
    letterSpacing: -0.2,
  },
});
