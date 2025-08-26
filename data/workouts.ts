import { Workout } from '@/types';

export const workouts: Workout[] = [
  {
    id: 'week1-day1',
    title: 'Gentle Awakening',
    description: 'Start your journey with gentle movements to prepare your body',
    totalDuration: 420, // 7 minutes
    difficulty: 'beginner',
    week: 1,
    day: 1,
    coachNotes: 'Welcome to your fitness journey! Take it slow today and focus on proper form.',
    tags: ['beginner-friendly', 'full-body', 'gentle'],
    exercises: [
      { exerciseId: 'neck-rolls', duration: 30, restAfter: 10 },
      { exerciseId: 'shoulder-shrugs', duration: 20, restAfter: 10 },
      { exerciseId: 'seated-spinal-twist', duration: 45, restAfter: 15 },
      { exerciseId: 'cat-cow-stretch', duration: 40, restAfter: 10 },
      { exerciseId: 'hip-circles', duration: 30, restAfter: 10 },
      { exerciseId: 'ankle-rolls', duration: 20, restAfter: 0 }
    ]
  },
  {
    id: 'week1-day2',
    title: 'Upper Body Focus',
    description: 'Target neck, shoulders, and upper back tension',
    totalDuration: 480, // 8 minutes
    difficulty: 'beginner',
    week: 1,
    day: 2,
    coachNotes: 'Focus on releasing tension from your workday. Listen to your body.',
    tags: ['upper-body', 'tension-relief'],
    exercises: [
      { exerciseId: 'neck-rolls', duration: 30, restAfter: 10 },
      { exerciseId: 'shoulder-shrugs', duration: 30, restAfter: 15 },
      { exerciseId: 'chest-stretch', duration: 30, restAfter: 10 },
      { exerciseId: 'wall-slides', duration: 45, restAfter: 15 },
      { exerciseId: 'desk-push-ups', duration: 30, restAfter: 10 },
      { exerciseId: 'seated-spinal-twist', duration: 45, restAfter: 0 }
    ]
  },
  {
    id: 'week1-day3',
    title: 'Core & Mobility',
    description: 'Strengthen your core while improving overall mobility',
    totalDuration: 450, // 7.5 minutes
    difficulty: 'beginner',
    week: 1,
    day: 3,
    coachNotes: 'Great job staying consistent! Today we focus on building a strong foundation.',
    tags: ['core', 'mobility', 'strength'],
    exercises: [
      { exerciseId: 'cat-cow-stretch', duration: 40, restAfter: 10 },
      { exerciseId: 'hip-circles', duration: 30, restAfter: 10 },
      { exerciseId: 'leg-extensions', duration: 30, restAfter: 15 },
      { exerciseId: 'wall-slides', duration: 45, restAfter: 15 },
      { exerciseId: 'seated-spinal-twist', duration: 45, restAfter: 10 },
      { exerciseId: 'desk-push-ups', duration: 30, restAfter: 0 }
    ]
  },
  {
    id: 'week1-day4',
    title: 'Active Recovery',
    description: 'Gentle movements for recovery and circulation',
    totalDuration: 360, // 6 minutes
    difficulty: 'beginner',
    week: 1,
    day: 4,
    coachNotes: 'Recovery day! Keep it light and focus on breathing and gentle movement.',
    tags: ['recovery', 'gentle', 'circulation'],
    exercises: [
      { exerciseId: 'neck-rolls', duration: 30, restAfter: 15 },
      { exerciseId: 'shoulder-shrugs', duration: 20, restAfter: 15 },
      { exerciseId: 'ankle-rolls', duration: 20, restAfter: 15 },
      { exerciseId: 'hip-circles', duration: 30, restAfter: 15 },
      { exerciseId: 'chest-stretch', duration: 30, restAfter: 15 },
      { exerciseId: 'seated-spinal-twist', duration: 45, restAfter: 0 }
    ]
  },
  {
    id: 'week1-day5',
    title: 'Strength Builder',
    description: 'Build strength while maintaining flexibility',
    totalDuration: 540, // 9 minutes
    difficulty: 'beginner',
    week: 1,
    day: 5,
    coachNotes: 'Feeling stronger already? Today we add a bit more challenge. You\'ve got this!',
    tags: ['strength', 'full-body'],
    exercises: [
      { exerciseId: 'wall-slides', duration: 45, restAfter: 15 },
      { exerciseId: 'desk-push-ups', duration: 30, restAfter: 15 },
      { exerciseId: 'leg-extensions', duration: 30, restAfter: 15 },
      { exerciseId: 'cat-cow-stretch', duration: 40, restAfter: 15 },
      { exerciseId: 'hip-circles', duration: 30, restAfter: 15 },
      { exerciseId: 'chest-stretch', duration: 30, restAfter: 15 },
      { exerciseId: 'seated-spinal-twist', duration: 45, restAfter: 0 }
    ]
  },
  {
    id: 'week1-day6',
    title: 'Full Body Flow',
    description: 'Complete workout targeting all major areas',
    totalDuration: 600, // 10 minutes
    difficulty: 'beginner',
    week: 1,
    day: 6,
    coachNotes: 'This is your longest session yet. Take your time and maintain good form.',
    tags: ['full-body', 'comprehensive'],
    exercises: [
      { exerciseId: 'neck-rolls', duration: 30, restAfter: 10 },
      { exerciseId: 'shoulder-shrugs', duration: 20, restAfter: 10 },
      { exerciseId: 'wall-slides', duration: 45, restAfter: 15 },
      { exerciseId: 'desk-push-ups', duration: 30, restAfter: 15 },
      { exerciseId: 'cat-cow-stretch', duration: 40, restAfter: 15 },
      { exerciseId: 'leg-extensions', duration: 30, restAfter: 15 },
      { exerciseId: 'hip-circles', duration: 30, restAfter: 15 },
      { exerciseId: 'chest-stretch', duration: 30, restAfter: 15 },
      { exerciseId: 'seated-spinal-twist', duration: 45, restAfter: 0 }
    ]
  },
  {
    id: 'week1-day7',
    title: 'Week 1 Celebration',
    description: 'Complete your first week with this energizing session',
    totalDuration: 480, // 8 minutes
    difficulty: 'beginner',
    week: 1,
    day: 7,
    coachNotes: 'Congratulations on completing Week 1! You should feel proud of your consistency.',
    tags: ['celebration', 'energizing', 'full-body'],
    exercises: [
      { exerciseId: 'shoulder-shrugs', duration: 30, restAfter: 10 },
      { exerciseId: 'wall-slides', duration: 45, restAfter: 15 },
      { exerciseId: 'cat-cow-stretch', duration: 40, restAfter: 15 },
      { exerciseId: 'desk-push-ups', duration: 30, restAfter: 15 },
      { exerciseId: 'leg-extensions', duration: 30, restAfter: 15 },
      { exerciseId: 'hip-circles', duration: 30, restAfter: 15 },
      { exerciseId: 'chest-stretch', duration: 30, restAfter: 15 },
      { exerciseId: 'ankle-rolls', duration: 20, restAfter: 0 }
    ]
  }
];

export const quickStretches = [
  'neck-rolls',
  'shoulder-shrugs', 
  'ankle-rolls',
  'hip-circles',
  'chest-stretch'
];

export function getWorkoutsByWeek(week: number): Workout[] {
  return workouts.filter(w => w.week === week).sort((a, b) => (a.day || 0) - (b.day || 0));
}

export function getWorkoutById(id: string): Workout | undefined {
  return workouts.find(w => w.id === id);
}

export function getExerciseById(id: string): any {
  return exercises.find(e => e.id === id);
}