import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, ScheduleEvent, UserSettings } from '../types';
import { addDays, format } from 'date-fns';

interface StoreState {
  hasOnboarded: boolean;
  tasks: Task[];
  schedule: ScheduleEvent[];
  settings: UserSettings;
  
  completeOnboarding: () => void;
  addTask: (task: Omit<Task, 'id' | 'isCompleted'>) => void;
  toggleTask: (id: string) => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
  logout: () => void;
}

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Алгебра: Квадратные уравнения',
    type: 'homework',
    isCompleted: false,
    deadline: format(addDays(new Date(), 2), 'yyyy-MM-dd'),
    spacedRepetition: { level: 1, nextReviewDate: format(new Date(), 'yyyy-MM-dd') }
  },
  {
    id: '2',
    title: 'История: Эссе по ВОВ',
    type: 'project',
    isCompleted: false,
    deadline: format(addDays(new Date(), 5), 'yyyy-MM-dd'),
  },
  {
    id: '3',
    title: 'Физика: Контрольная',
    type: 'exam',
    isCompleted: false,
    deadline: format(addDays(new Date(), 3), 'yyyy-MM-dd'),
  }
];

const mockSchedule: ScheduleEvent[] = [
  { id: 's1', title: 'Сон', startTime: '00:00', endTime: '07:00', type: 'sleep' },
  { id: 's2', title: 'Школа', startTime: '08:00', endTime: '14:00', type: 'school' },
  { id: 's3', title: 'Футбол', startTime: '16:00', endTime: '18:00', type: 'activity' },
];

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      hasOnboarded: false,
      tasks: mockTasks,
      schedule: mockSchedule,
      settings: {
        wakeUpTime: '07:00',
        bedTime: '23:00',
        schoolStart: '08:00',
        schoolEnd: '14:00',
      },

      completeOnboarding: () => set({ hasOnboarded: true }),

      addTask: (task) => set((state) => ({
        tasks: [...state.tasks, { ...task, id: Math.random().toString(36).substr(2, 9), isCompleted: false }]
      })),

      toggleTask: (id) => set((state) => ({
        tasks: state.tasks.map(t => t.id === id ? { ...t, isCompleted: !t.isCompleted } : t)
      })),

      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings }
      })),

      logout: () => set({ hasOnboarded: false }),
    }),
    {
      name: 'focuspoint-storage',
    }
  )
);
