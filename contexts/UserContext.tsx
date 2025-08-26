import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/types';
import { StorageService } from '@/utils/storage';

interface UserContextType {
  user: User | null;
  loading: boolean;
  updateUser: (updates: Partial<User>) => Promise<void>;
  addCompletedWorkout: (workoutId: string) => Promise<void>;
  addBadge: (badgeId: string) => Promise<void>;
  incrementStreak: () => Promise<void>;
  addXP: (points: number) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await StorageService.getUser();
      setUser(userData);
    } catch (error) {
      console.error('Failed to load user:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    await StorageService.saveUser(updatedUser);
  };

  const addCompletedWorkout = async (workoutId: string) => {
    if (!user) return;
    
    const completedWorkouts = [...user.completedWorkouts];
    if (!completedWorkouts.includes(workoutId)) {
      completedWorkouts.push(workoutId);
      await updateUser({ completedWorkouts });
    }
  };

  const addBadge = async (badgeId: string) => {
    if (!user || user.badges.includes(badgeId)) return;
    
    const badges = [...user.badges, badgeId];
    await updateUser({ badges });
  };

  const incrementStreak = async () => {
    if (!user) return;
    
    const currentStreak = user.currentStreak + 1;
    await updateUser({ currentStreak });
  };

  const addXP = async (points: number) => {
    if (!user) return;
    
    const totalXP = user.totalXP + points;
    await updateUser({ totalXP });
  };

  const value = {
    user,
    loading,
    updateUser,
    addCompletedWorkout,
    addBadge,
    incrementStreak,
    addXP,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}