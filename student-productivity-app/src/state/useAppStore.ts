import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FocusSession, NewTaskInput, Task } from '../types';
import { applyExpGain, calculateTaskExp } from '../utils/exp';

function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

interface AppState {
  tasks: Task[];
  level: number;
  expIntoLevel: number;
  totalExpEarned: number;
  tasksCompleted: number;
  /** Most recent EXP gain, shown as a toast/animation then cleared. */
  lastGain: { amount: number; leveledUp: boolean; taskTitle: string } | null;
  focusSession: FocusSession | null;

  addTask: (input: NewTaskInput) => void;
  completeTask: (id: string) => void;
  deleteTask: (id: string) => void;
  clearLastGain: () => void;

  startFocusSession: (blockedApps: string[], durationMinutes: number) => void;
  endFocusSession: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      tasks: [],
      level: 1,
      expIntoLevel: 0,
      totalExpEarned: 0,
      tasksCompleted: 0,
      lastGain: null,
      focusSession: null,

      addTask: (input) => {
        const task: Task = {
          id: generateId(),
          title: input.title.trim(),
          description: input.description?.trim() || undefined,
          priority: input.priority,
          durationMinutes: input.durationMinutes,
          deadline: input.deadline,
          completed: false,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ tasks: [task, ...state.tasks] }));
      },

      completeTask: (id) => {
        const task = get().tasks.find((t) => t.id === id);
        if (!task || task.completed) return;

        const completedAt = new Date().toISOString();
        const gained = calculateTaskExp({
          durationMinutes: task.durationMinutes,
          priority: task.priority,
          deadline: task.deadline,
          completedAt,
        });

        const result = applyExpGain(get().level, get().expIntoLevel, gained);

        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, completed: true, completedAt, expAwarded: gained } : t
          ),
          level: result.level,
          expIntoLevel: result.expIntoLevel,
          totalExpEarned: state.totalExpEarned + gained,
          tasksCompleted: state.tasksCompleted + 1,
          lastGain: { amount: gained, leveledUp: result.leveledUp, taskTitle: task.title },
        }));
      },

      deleteTask: (id) => {
        set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }));
      },

      clearLastGain: () => set({ lastGain: null }),

      startFocusSession: (blockedApps, durationMinutes) => {
        const startedAt = new Date();
        const endsAt = new Date(startedAt.getTime() + durationMinutes * 60_000);
        set({
          focusSession: {
            blockedApps,
            durationMinutes,
            startedAt: startedAt.toISOString(),
            endsAt: endsAt.toISOString(),
          },
        });
      },

      endFocusSession: () => set({ focusSession: null }),
    }),
    {
      name: 'student-productivity-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        tasks: state.tasks,
        level: state.level,
        expIntoLevel: state.expIntoLevel,
        totalExpEarned: state.totalExpEarned,
        tasksCompleted: state.tasksCompleted,
        focusSession: state.focusSession,
      }),
    }
  )
);
