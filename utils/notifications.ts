import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export const NotificationService = {
  async requestPermissions() {
    if (Platform.OS === 'web') return { granted: false };
    
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    return { granted: finalStatus === 'granted' };
  },

  async scheduleWorkoutReminder(hour: number, minute: number) {
    if (Platform.OS === 'web') return null;
    
    try {
      const { granted } = await this.requestPermissions();
      if (!granted) return null;

      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: '💪 Time to Move!',
          body: "Ready for today's workout? Let's keep that streak going!",
          sound: false,
        },
        trigger: {
          hour,
          minute,
          repeats: true,
        },
      });

      return id;
    } catch (error) {
      console.error('Failed to schedule notification:', error);
      return null;
    }
  },

  async cancelAllReminders() {
    if (Platform.OS === 'web') return;
    
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Failed to cancel notifications:', error);
    }
  },

  async scheduleStreakCelebration(streak: number) {
    if (Platform.OS === 'web') return null;
    
    try {
      const { granted } = await this.requestPermissions();
      if (!granted) return null;

      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: '🔥 Amazing Streak!',
          body: `You've maintained a ${streak}-day streak! Keep up the fantastic work!`,
          sound: true,
        },
        trigger: null, // Immediate notification
      });

      return id;
    } catch (error) {
      console.error('Failed to schedule celebration:', error);
      return null;
    }
  }
};