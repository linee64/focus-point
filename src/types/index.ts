export interface Task {
  id: string;
  title: string;
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
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  type: 'school' | 'sleep' | 'activity' | 'study' | 'break';
  taskId?: string; // If linked to a task
}

export interface UserSettings {
  wakeUpTime: string;
  bedTime: string;
  breakfastTime: string;
  lunchTime: string;
  dinnerTime: string;
  schoolStart: string;
  schoolEnd: string;
}
