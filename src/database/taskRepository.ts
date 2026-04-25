import * as SQLite from 'expo-sqlite';
import { Task, CreateTaskDTO, UpdateTaskDTO } from '../types/Task';

const DB_NAME = 'tasks.db';

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!db) {
    db = await SQLite.openDatabaseAsync(DB_NAME);
  }
  return db;
}

export async function initDatabase(): Promise<void> {
  const database = await getDatabase();
  await database.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      priority TEXT NOT NULL DEFAULT 'medium' CHECK(priority IN ('low', 'medium', 'high')),
      completed INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );
  `);
}

export async function getAllTasks(): Promise<Task[]> {
  const database = await getDatabase();
  const rows = await database.getAllAsync<Task>(
    'SELECT * FROM tasks ORDER BY createdAt DESC'
  );
  return rows.map(row => ({
    ...row,
    completed: Boolean(row.completed),
  }));
}

export async function getTaskById(id: number): Promise<Task | null> {
  const database = await getDatabase();
  const row = await database.getFirstAsync<Task>(
    'SELECT * FROM tasks WHERE id = ?',
    [id]
  );
  if (!row) return null;
  return { ...row, completed: Boolean(row.completed) };
}

export async function createTask(dto: CreateTaskDTO): Promise<Task> {
  const database = await getDatabase();
  const now = new Date().toISOString();
  const result = await database.runAsync(
    `INSERT INTO tasks (title, description, priority, completed, createdAt, updatedAt)
     VALUES (?, ?, ?, 0, ?, ?)`,
    [dto.title, dto.description, dto.priority, now, now]
  );
  const task = await getTaskById(result.lastInsertRowId);
  if (!task) throw new Error('Failed to create task');
  return task;
}

export async function updateTask(id: number, dto: UpdateTaskDTO): Promise<Task> {
  const database = await getDatabase();
  const existing = await getTaskById(id);
  if (!existing) throw new Error(`Task with id ${id} not found`);

  const updated = {
    title: dto.title ?? existing.title,
    description: dto.description ?? existing.description,
    priority: dto.priority ?? existing.priority,
    completed: dto.completed !== undefined ? dto.completed : existing.completed,
    updatedAt: new Date().toISOString(),
  };

  await database.runAsync(
    `UPDATE tasks SET title = ?, description = ?, priority = ?, completed = ?, updatedAt = ?
     WHERE id = ?`,
    [updated.title, updated.description, updated.priority, updated.completed ? 1 : 0, updated.updatedAt, id]
  );

  const task = await getTaskById(id);
  if (!task) throw new Error('Failed to update task');
  return task;
}

export async function deleteTask(id: number): Promise<void> {
  const database = await getDatabase();
  await database.runAsync('DELETE FROM tasks WHERE id = ?', [id]);
}
