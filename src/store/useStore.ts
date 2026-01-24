import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, ScheduleEvent, UserSettings, Note, AIPlan, PlanItem } from '../types';
import { addDays, format, differenceInDays, parseISO } from 'date-fns';
import { supabase } from '../services/supabase';

interface StoreState {
  hasOnboarded: boolean;
  tasks: Task[];
  schedule: ScheduleEvent[];
  notes: Note[];
  settings: UserSettings;
  user?: { name: string; surname: string } | null;
  aiPlans: Record<string, AIPlan>;
  streak: number;
  lastLoginDate?: string | null;
  
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
  clearSchoolSchedule: () => void;
  addTask: (task: Omit<Task, 'id' | 'isCompleted'>) => void;
  removeTask: (id: string) => void;
  toggleTask: (id: string) => void;
  addNote: (note: Omit<Note, 'id' | 'createdAt'>) => void;
  removeNote: (id: string) => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
  setAIPlan: (date: string, plan: AIPlan) => void;
  updateAIPlanItem: (date: string, itemId: string, updates: Partial<PlanItem>) => void;
  removeAIPlanItem: (date: string, itemId: string) => void;
  toggleAIPlanItem: (date: string, itemId: string) => void;
  updateStreak: () => void;
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
      tasks: [],
      schedule: [],
      notes: [],
      settings: {
        wakeUpTime: '07:00',
        bedTime: '23:00',
        breakfastTime: '07:30',
        lunchTime: '13:00',
        dinnerTime: '19:00',
        schoolStart: '08:00',
        schoolEnd: '14:00',
        commuteTime: 30,
        routineActivities: [],
      },
      user: null,
      aiPlans: {},
      streak: 0,
      lastLoginDate: null,

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

      clearSchoolSchedule: () => set((state) => ({
        schedule: state.schedule.filter(e => e.type !== 'school')
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

      addNote: (note) => set((state) => ({
        notes: [...state.notes, { ...note, id: Math.random().toString(36).substr(2, 9), createdAt: new Date().toISOString() }]
      })),

      removeNote: (id) => set((state) => ({
        notes: state.notes.filter(n => n.id !== id)
      })),

      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings }
      })),

      setAIPlan: (date, plan) => set((state) => ({
        aiPlans: { ...state.aiPlans, [date]: plan }
      })),

      updateAIPlanItem: (date, itemId, updates) => set((state) => {
        const plan = state.aiPlans[date];
        if (!plan) return state;
        return {
          aiPlans: {
            ...state.aiPlans,
            [date]: {
              ...plan,
              items: plan.items.map(item => item.id === itemId ? { ...item, ...updates } : item)
            }
          }
        };
      }),

      removeAIPlanItem: (date, itemId) => set((state) => {
        const plan = state.aiPlans[date];
        if (!plan) return state;
        return {
          aiPlans: {
            ...state.aiPlans,
            [date]: {
              ...plan,
              items: plan.items.filter(item => item.id !== itemId)
            }
          }
        };
      }),

      toggleAIPlanItem: (date: string, itemId: string) => set((state) => {
        const plan = state.aiPlans[date];
        if (!plan) return state;
        return {
          aiPlans: {
            ...state.aiPlans,
            [date]: {
              ...plan,
              items: plan.items.map(item => item.id === itemId ? { ...item, isCompleted: !item.isCompleted } : item)
            }
          }
        };
      }),

      updateStreak: () => set((state) => {
        const today = new Date();
        const todayStr = format(today, 'yyyy-MM-dd');
        
        if (!state.lastLoginDate) {
          return { streak: 1, lastLoginDate: todayStr };
        }

        const lastLogin = parseISO(state.lastLoginDate);
        const diff = differenceInDays(today, lastLogin);

        if (diff === 0) {
          return state; // Already logged in today
        } else if (diff === 1) {
          return { streak: state.streak + 1, lastLoginDate: todayStr }; // Consecutive day
        } else {
          return { streak: 1, lastLoginDate: todayStr }; // Streak broken
        }
      }),

      logout: async () => {
        await supabase.auth.signOut();
        set({ 
          hasOnboarded: false, 
          user: null, 
          tasks: [], 
          schedule: [], 
          notes: [], 
          aiPlans: {} 
        });
      },
    }),
    {
      name: 'focuspoint-storage',
    }
  )
);
