export type TaskStatus = 'Backlog' | 'In Progress' | 'Done';

export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  tags: string[];
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export const STORAGE_KEY = 'everquint-task-board';
export const CURRENT_SCHEMA_VERSION = 1;

export interface StorageSchema {
  schemaVersion: number;
  tasks: Task[];
}

/**
 * Migration type for future versions
 * For now, we only have v1
 */
export interface LegacyStorageSchemaV0 {
  // Assuming v0 was just an array of tasks without versioning
  tasks?: any[];
  [key: string]: any;
}
