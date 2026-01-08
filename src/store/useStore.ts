import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, ScheduleEvent, UserSettings } from '../types';
import { addDays, format } from 'date-fns';

interface StoreState {
  hasOnboarded: boolean;
  tasks: Task[];
  schedule: ScheduleEvent[];
  settings: UserSettings;
  user?: { name: string; surname: string } | null;
  
  // UI State
  isNotificationsOpen: boolean;
  isAddTaskOpen: boolean;
  isAddScheduleOpen: boolean;
  setNotificationsOpen: (isOpen: boolean) => void;
  setAddTaskOpen: (isOpen: boolean) => void;
  setAddScheduleOpen: (isOpen: boolean) => void;
  
  completeOnboarding: () => void;
  updateUser: (name: string, surname: string) => void;
  addScheduleEvent: (event: Omit<ScheduleEvent, 'id'>) => void;
  updateScheduleEvent: (id: string, event: Partial<ScheduleEvent>) => void;
  removeScheduleEvent: (id: string) => void;
  addTask: (task: Omit<Task, 'id' | 'isCompleted'>) => void;
  removeTask: (id: string) => void;
  toggleTask: (id: string) => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
  logout: () => void;
}

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Квадратные уравнения',
    subject: 'Алгебра',
    type: 'homework',
    isCompleted: false,
    deadline: format(addDays(new Date(), 2), 'yyyy-MM-dd'),
    spacedRepetition: { level: 1, nextReviewDate: format(new Date(), 'yyyy-MM-dd') }
  },
  {
    id: '2',
    title: 'Эссе по ВОВ',
    subject: 'История',
    type: 'project',
    isCompleted: false,
    deadline: format(addDays(new Date(), 5), 'yyyy-MM-dd'),
  },
  {
    id: '3',
    title: 'Контрольная',
    subject: 'Физика',
    type: 'exam',
    isCompleted: false,
    deadline: format(addDays(new Date(), 3), 'yyyy-MM-dd'),
  }
];

const mockSchedule: ScheduleEvent[] = [
  { id: 's1', title: 'Сон', date: format(new Date(), 'yyyy-MM-dd'), startTime: '00:00', endTime: '07:00', type: 'sleep' },
  { id: 's2', title: 'Школа', date: format(new Date(), 'yyyy-MM-dd'), startTime: '08:00', endTime: '14:00', type: 'school' },
  { id: 's3', title: 'Футбол', date: format(new Date(), 'yyyy-MM-dd'), startTime: '16:00', endTime: '18:00', type: 'activity' },
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
        breakfastTime: '07:30',
        lunchTime: '13:00',
        dinnerTime: '19:00',
        schoolStart: '08:00',
        schoolEnd: '14:00',
      },
      user: null,

      // UI State
      isNotificationsOpen: false,
      isAddTaskOpen: false,
      isAddScheduleOpen: false,
      setNotificationsOpen: (isOpen) => set({ isNotificationsOpen: isOpen }),
      setAddTaskOpen: (isOpen) => set({ isAddTaskOpen: isOpen }),
      setAddScheduleOpen: (isOpen) => set({ isAddScheduleOpen: isOpen }),

      completeOnboarding: () => set({ hasOnboarded: true }),

      updateUser: (name, surname) => set({ user: { name, surname } }),

      addScheduleEvent: (event) => set((state) => ({
        schedule: [...state.schedule, { ...event, id: Math.random().toString(36).substr(2, 9) }]
      })),

      updateScheduleEvent: (id, updatedEvent) => set((state) => ({
        schedule: state.schedule.map(e => e.id === id ? { ...e, ...updatedEvent } : e)
      })),

      removeScheduleEvent: (id) => set((state) => ({
        schedule: state.schedule.filter(e => e.id !== id)
      })),

      addTask: (task) => set((state) => ({
        tasks: [...state.tasks, { ...task, id: Math.random().toString(36).substr(2, 9), isCompleted: false }]
      })),

      removeTask: (id) => set((state) => ({
        tasks: state.tasks.filter(t => t.id !== id)
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
