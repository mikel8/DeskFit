import { Badge } from '@/types';

export const badges: Badge[] = [
  {
    id: 'first-workout',
    name: 'First Steps',
    description: 'Complete your first workout session',
    icon: 'footsteps',
    requirement: 1,
    type: 'sessions'
  },
  {
    id: 'week-warrior',
    name: 'Week Warrior',
    description: 'Complete 7 workouts',
    icon: 'calendar-check',
    requirement: 7,
    type: 'sessions'
  },
  {
    id: 'streak-starter',
    name: 'Streak Starter',
    description: 'Maintain a 3-day streak',
    icon: 'flame',
    requirement: 3,
    type: 'streak'
  },
  {
    id: 'consistency-king',
    name: 'Consistency Champion',
    description: 'Maintain a 7-day streak',
    icon: 'crown',
    requirement: 7,
    type: 'streak'
  },
  {
    id: 'time-keeper',
    name: 'Time Keeper',
    description: 'Complete 60 minutes of exercise',
    icon: 'clock',
    requirement: 3600, // 60 minutes in seconds
    type: 'time'
  },
  {
    id: 'early-bird',
    name: 'Early Bird',
    description: 'Complete a morning workout before 9 AM',
    icon: 'sunrise',
    requirement: 1,
    type: 'special'
  }
];