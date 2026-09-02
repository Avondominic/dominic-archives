import { DistractingApp, Friend, TutorPost } from '../types';

/**
 * Prototype-only mock data. In production, `DISTRACTING_APPS` would come
 * from the device's installed-app list (another native call — see
 * android-native-reference/), and Friends/Tutor Hub would come from a
 * backend (see README.md "Social & Community Features" notes).
 */
export const DISTRACTING_APPS: DistractingApp[] = [
  { id: 'instagram', packageName: 'com.instagram.android', label: 'Instagram' },
  { id: 'tiktok', packageName: 'com.zhiliaoapp.musically', label: 'TikTok' },
  { id: 'youtube', packageName: 'com.google.android.youtube', label: 'YouTube' },
  { id: 'twitter', packageName: 'com.twitter.android', label: 'X / Twitter' },
  { id: 'snapchat', packageName: 'com.snapchat.android', label: 'Snapchat' },
  { id: 'reddit', packageName: 'com.reddit.frontpage', label: 'Reddit' },
];

export const FOCUS_DURATION_PRESETS = [40, 60, 90, 120];

export const MOCK_FRIENDS: Friend[] = [
  { id: 'f1', name: 'Maya Chen', level: 14, rank: 'Try Hard', status: 'focused', streakDays: 12 },
  { id: 'f2', name: 'Diego Ramos', level: 27, rank: 'Einstein', status: 'studying', streakDays: 41 },
  { id: 'f3', name: 'Amara Osei', level: 8, rank: 'Avg Avg', status: 'idle', streakDays: 3 },
  { id: 'f4', name: 'Liam Park', level: 19, rank: 'Geek', status: 'focused', streakDays: 6 },
];

export const MOCK_TUTOR_POSTS: TutorPost[] = [
  {
    id: 't1',
    tutorName: 'Ms. Whitfield',
    subject: 'Calculus',
    title: 'Related Rates in 8 Minutes',
    videoUrl: 'https://www.youtube.com/watch?v=dummy1',
    durationLabel: '8:12',
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: 't2',
    tutorName: 'Prof. Adeyemi',
    subject: 'Chemistry',
    title: 'Balancing Redox Equations Fast',
    videoUrl: 'https://www.youtube.com/watch?v=dummy2',
    durationLabel: '11:45',
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
  },
  {
    id: 't3',
    tutorName: 'Mr. Okafor',
    subject: 'Essay Writing',
    title: 'Building a Thesis That Actually Argues Something',
    videoUrl: 'https://www.youtube.com/watch?v=dummy3',
    durationLabel: '6:30',
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString(),
  },
];
