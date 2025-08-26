export interface User {
  id: string;
  name?: string;
  email?: string;
  goals: string[];
  timePreference: string;
  currentStreak: number;
  totalXP: number;
  completedWorkouts: string[];
  badges: string[];
  createdAt: string;
  onboardingCompleted: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  duration: number; // in seconds
  description: string;
  targetMuscles: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  equipment: string[];
  instructions: string[];
  benefits: string[];
  videoUrl?: string;
  imageUrl?: string;
  category: 'stretch' | 'strength' | 'cardio' | 'mobility';
}

export interface Workout {
  id: string;
  title: string;
  description: string;
  totalDuration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  exercises: WorkoutExercise[];
  tags: string[];
  week?: number;
  day?: number;
  coachNotes?: string;
}

export interface WorkoutExercise {
  exerciseId: string;
  duration: number;
  restAfter: number;
  modifications?: string[];
  sets?: number;
  reps?: number;
}

export interface WorkoutSession {
  id: string;
  workoutId: string;
  completedAt: string;
  duration: number;
  xpEarned: number;
  exercises: CompletedExercise[];
}

export interface CompletedExercise {
  exerciseId: string;
  completed: boolean;
  duration: number;
  notes?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: number;
  type: 'streak' | 'sessions' | 'time' | 'special';
}

export interface ProgressEntry {
  date: string;
  workoutCompleted: boolean;
  duration: number;
  xpEarned: number;
  painLevel?: number;
  notes?: string;
}