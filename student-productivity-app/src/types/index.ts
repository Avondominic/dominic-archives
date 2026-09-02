export type Priority = 'Low' | 'Medium' | 'High';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  durationMinutes: number;
  deadline?: string; // ISO string, optional
  completed: boolean;
  createdAt: string;
  completedAt?: string;
  expAwarded?: number;
}

export type NewTaskInput = {
  title: string;
  description?: string;
  priority: Priority;
  durationMinutes: number;
  deadline?: string;
};

export interface FocusSession {
  blockedApps: string[];
  durationMinutes: number;
  startedAt: string; // ISO
  endsAt: string; // ISO
}

export type FriendStatus = 'focused' | 'studying' | 'idle';

export interface Friend {
  id: string;
  name: string;
  level: number;
  rank: string;
  status: FriendStatus;
  streakDays: number;
}

export interface TutorPost {
  id: string;
  tutorName: string;
  subject: string;
  title: string;
  videoUrl: string;
  durationLabel: string;
  postedAt: string;
}

export interface DistractingApp {
  id: string;
  packageName: string;
  label: string;
}
