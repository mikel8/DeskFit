import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, WorkoutSession, ProgressEntry } from '@/types';

const STORAGE_KEYS = {
  USER: '@fitness_app_user',
  SESSIONS: '@fitness_app_sessions',
  PROGRESS: '@fitness_app_progress',
  ONBOARDING: '@fitness_app_onboarding',
  SETTINGS: '@fitness_app_settings',
};

export const StorageService = {
  // User data
  async saveUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (error) {
      console.error('Failed to save user data:', error);
    }
  },

  async getUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Failed to get user data:', error);
      return null;
    }
  },

  // Workout sessions
  async saveSession(session: WorkoutSession): Promise<void> {
    try {
      const sessions = await this.getSessions();
      sessions.push(session);
      await AsyncStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  },

  async getSessions(): Promise<WorkoutSession[]> {
    try {
      const sessionsData = await AsyncStorage.getItem(STORAGE_KEYS.SESSIONS);
      return sessionsData ? JSON.parse(sessionsData) : [];
    } catch (error) {
      console.error('Failed to get sessions:', error);
      return [];
    }
  },

  // Progress tracking
  async saveProgress(entry: ProgressEntry): Promise<void> {
    try {
      const progress = await this.getProgress();
      const existingIndex = progress.findIndex(p => p.date === entry.date);
      
      if (existingIndex >= 0) {
        progress[existingIndex] = entry;
      } else {
        progress.push(entry);
      }
      
      await AsyncStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  },

  async getProgress(): Promise<ProgressEntry[]> {
    try {
      const progressData = await AsyncStorage.getItem(STORAGE_KEYS.PROGRESS);
      return progressData ? JSON.parse(progressData) : [];
    } catch (error) {
      console.error('Failed to get progress:', error);
      return [];
    }
  },

  // Onboarding status
  async setOnboardingComplete(complete: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING, JSON.stringify(complete));
    } catch (error) {
      console.error('Failed to save onboarding status:', error);
    }
  },

  async getOnboardingStatus(): Promise<boolean> {
    try {
      const status = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING);
      return status ? JSON.parse(status) : false;
    } catch (error) {
      console.error('Failed to get onboarding status:', error);
      return false;
    }
  },

  // Settings
  async saveSettings(settings: any): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  },

  async getSettings(): Promise<any> {
    try {
      const settingsData = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      return settingsData ? JSON.parse(settingsData) : {};
    } catch (error) {
      console.error('Failed to get settings:', error);
      return {};
    }
  },

  // Clear all data
  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
    } catch (error) {
      console.error('Failed to clear data:', error);
    }
  },
};