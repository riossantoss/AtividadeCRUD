import { useState, useEffect, useCallback } from 'react';
import { Task, CreateTaskDTO, UpdateTaskDTO } from '../types/Task';
import * as repo from '../database/taskRepository';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await repo.getAllTasks();
      setTasks(data);
    } catch (err) {
      setError('Erro ao carregar tarefas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = useCallback(async (dto: CreateTaskDTO): Promise<Task> => {
    const task = await repo.createTask(dto);
    setTasks(prev => [task, ...prev]);
    return task;
  }, []);

  const updateTask = useCallback(async (id: number, dto: UpdateTaskDTO): Promise<Task> => {
    const task = await repo.updateTask(id, dto);
    setTasks(prev => prev.map(t => (t.id === id ? task : t)));
    return task;
  }, []);

  const deleteTask = useCallback(async (id: number): Promise<void> => {
    await repo.deleteTask(id);
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  const toggleComplete = useCallback(async (id: number, completed: boolean): Promise<void> => {
    await updateTask(id, { completed });
  }, [updateTask]);

  return { tasks, loading, error, fetchTasks, createTask, updateTask, deleteTask, toggleComplete };
}
