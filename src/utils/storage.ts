import { type Task, type StorageSchema, CURRENT_SCHEMA_VERSION } from '@types';

/**
 * Migration from V0 to V1
 * V0 is assumed to be either empty or a raw array of tasks (or an object without schemaVersion)
 */
export function migrateV0ToV1(data: any): StorageSchema {
  let tasks: Task[] = [];

  if (Array.isArray(data)) {
    tasks = data;
  } else if (data && typeof data === 'object') {
    if (Array.isArray(data.tasks)) {
      tasks = data.tasks;
    }
  }

  // Ensure all tasks have required fields for V1
  const migratedTasks: Task[] = tasks.map((task: any) => ({
    id: task.id || crypto.randomUUID(),
    title: task.title || 'Untitled Task',
    description: task.description || '',
    status: task.status || 'Backlog',
    priority: task.priority || 'Medium',
    assignee: task.assignee || 'Unassigned',
    tags: Array.isArray(task.tags) ? task.tags : [],
    createdAt: task.createdAt || new Date().toISOString(),
    updatedAt: task.updatedAt || new Date().toISOString(),
  }));

  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    tasks: migratedTasks,
  };
}


export function saveToStorage<T>(key: string, value: T): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
}

export function loadFromStorage<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return null;
  }
}