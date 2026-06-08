import { create } from 'zustand';
import { type Task, type StorageSchema, STORAGE_KEY, CURRENT_SCHEMA_VERSION } from '@types';
import { loadFromStorage, saveToStorage, migrateV0ToV1 } from '@utils/storage';

interface TaskState {
  tasks: Task[];
  migrationPerformed: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadTasks: () => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, newStatus: Task['status']) => void;
  clearMigrationToast: () => void;
}



export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  migrationPerformed: false,
  isLoading: true,
  error: null,

  loadTasks: () => {
    set({ isLoading: true });
    try {
      const data = loadFromStorage<any>(STORAGE_KEY);
      
      if (!data) {
        set({ tasks: [], isLoading: false });
        return;
      }

      let finalData: StorageSchema;

      if (data.schemaVersion === CURRENT_SCHEMA_VERSION) {
        finalData = data as StorageSchema;
        set({ tasks: finalData.tasks, isLoading: false });
      } else {
        // Perform migration
        finalData = migrateV0ToV1(data);
        saveToStorage(STORAGE_KEY, finalData);
        set({ 
          tasks: finalData.tasks, 
          migrationPerformed: true, 
          isLoading: false 
        });
      }
    } catch (err) {
      set({ error: 'Failed to load tasks', isLoading: false });
    }
  },

  addTask: (taskData) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const newTasks = [...get().tasks, newTask];
    set({ tasks: newTasks });
    saveToStorage(STORAGE_KEY, {
      schemaVersion: CURRENT_SCHEMA_VERSION,
      tasks: newTasks
    });
  },

  updateTask: (id, updates) => {
    const newTasks = get().tasks.map((task) =>
      task.id === id
        ? { ...task, ...updates, updatedAt: new Date().toISOString() }
        : task
    );
    set({ tasks: newTasks });
    saveToStorage(STORAGE_KEY, {
      schemaVersion: CURRENT_SCHEMA_VERSION,
      tasks: newTasks
    });
  },

  deleteTask: (id) => {
    const newTasks = get().tasks.filter((task) => task.id !== id);
    set({ tasks: newTasks });
    saveToStorage(STORAGE_KEY, {
      schemaVersion: CURRENT_SCHEMA_VERSION,
      tasks: newTasks
    });
  },

  moveTask: (id, newStatus) => {
    get().updateTask(id, { status: newStatus });
  },

  clearMigrationToast: () => {
    set({ migrationPerformed: false });
  },
}));