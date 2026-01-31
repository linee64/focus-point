export interface Task {
  id: string;
  title: string;
  subject?: string;
  deadline?: string; // ISO Date
  isCompleted: boolean;
  type: 'homework' | 'project' | 'exam' | 'other';
  spacedRepetition?: {
    level: number; // 0, 1, 2, 3 (0=new, 1=1d, 2=3d, 3=7d)
    nextReviewDate: string;
  };
}

export interface ScheduleEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  type: 'school' | 'sleep' | 'activity' | 'study' | 'break';
  taskId?: string; // If linked to a task
  subtasks?: string[];
  room?: string; // Room/classroom number
}

export interface UserSettings {
  wakeUpTime: string;
  bedTime: string;
  breakfastTime: string;
  lunchTime: string;
  dinnerTime: string;
  schoolStart: string;
  schoolEnd: string;
  commuteTime: number; // Время в пути в минутах
  routineActivities: {
    title: string;
    startTime: string;
    endTime: string;
    type: string;
    days?: number[]; // 0-6, where 0 is Sunday or 1-7 (let's use 1-7 for Mon-Sun as it's more common in RU)
  }[];
  group?: string; // User's study group
  grade?: string; // User's school class/grade
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string; // ISO string
  sourceUrl?: string;
  type: 'video' | 'text' | 'file';
}

export interface PlanItem {
  start: string;
  end: string;
  title: string;
  type: 'rest' | 'productivity' | 'activity' | 'routine' | 'school' | 'sleep' | 'meal';
  isRecommendation: boolean;
  id: string;
  isCompleted: boolean;
}

export interface AIPlan {
  items: PlanItem[];
  analysis: string;
  lastGenerated: string;
  fingerprint: string;
}
