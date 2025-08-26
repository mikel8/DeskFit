import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as StoreReview from 'expo-store-review';
import { useUser } from '@/contexts/UserContext';
import { NotificationService } from '@/utils/notifications';
import { StorageService } from '@/utils/storage';

export default function ProfileScreen() {
  const { user, updateUser } = useUser();
  const [settings, setSettings] = useState({
    remindersEnabled: false,
    reminderTime: '9:00',
    darkMode: false,
    hapticFeedback: true,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const savedSettings = await StorageService.getSettings();
    setSettings(prevSettings => ({
      ...prevSettings,
      ...savedSettings,
    }));
  };

  const saveSettings = async (newSettings: any) => {
    setSettings(newSettings);
    await StorageService.saveSettings(newSettings);
  };

  const toggleReminders = async (enabled: boolean) => {
    const newSettings = { ...settings, remindersEnabled: enabled };
    await saveSettings(newSettings);

    if (enabled) {
      const [hour, minute] = settings.reminderTime.split(':').map(Number);
      await NotificationService.scheduleWorkoutReminder(hour, minute);
    } else {
      await NotificationService.cancelAllReminders();
    }
  };

  const requestAppReview = async () => {
    try {
      const isAvailable = await StoreReview.isAvailableAsync();
      if (isAvailable) {
        await StoreReview.requestReview();
      } else {
        Alert.alert(
          'Review App',
          'Thank you for wanting to review our app! Please visit the App Store to leave your review.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Failed to request review:', error);
    }
  };

  const resetData = () => {
    Alert.alert(
      'Reset All Data',
      'This will delete all your progress, workouts, and settings. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await StorageService.clearAllData();
            // You might want to restart the app or navigate to onboarding
            Alert.alert('Data Reset', 'All data has been cleared successfully.');
          },
        },
      ]
    );
  };

  const getUserLevel = () => {
    const totalXP = user?.totalXP || 0;
    return Math.floor(totalXP / 100) + 1;
  };

  const settingsOptions = [
    {
      title: 'Workout Reminders',
      subtitle: 'Get notified when it\'s time to exercise',
      icon: 'notifications',
      value: settings.remindersEnabled,
      onToggle: toggleReminders,
      type: 'toggle',
    },
    {
      title: 'Haptic Feedback',
      subtitle: 'Feel vibrations during workouts',
      icon: 'phone-portrait',
      value: settings.hapticFeedback,
      onToggle: (value: boolean) => saveSettings({ ...settings, hapticFeedback: value }),
      type: 'toggle',
    },
  ];

  const actionOptions = [
    {
      title: 'Rate Our App',
      subtitle: 'Help us improve with your feedback',
      icon: 'star',
      onPress: requestAppReview,
    },
    {
      title: 'Export Data',
      subtitle: 'Download your progress and sessions',
      icon: 'download',
      onPress: () => Alert.alert('Feature Coming Soon', 'Data export will be available in a future update.'),
    },
    {
      title: 'Reset All Data',
      subtitle: 'Clear all progress and start fresh',
      icon: 'refresh',
      onPress: resetData,
      destructive: true,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <Text style={styles.headerSubtitle}>Manage your preferences</Text>
        </View>

        {/* User Stats */}
        <View style={styles.userCard}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={32} color="#00A7A7" />
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>Fitness Enthusiast</Text>
              <Text style={styles.userLevel}>Level {getUserLevel()}</Text>
            </View>
          </View>
          
          <View style={styles.userStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user?.completedWorkouts.length || 0}</Text>
              <Text style={styles.statLabel}>Workouts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user?.currentStreak || 0}</Text>
              <Text style={styles.statLabel}>Streak</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user?.totalXP || 0}</Text>
              <Text style={styles.statLabel}>XP</Text>
            </View>
          </View>
        </View>

        {/* Goals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Goals</Text>
          <View style={styles.goalsContainer}>
            {user?.goals.map((goal, index) => (
              <View key={index} style={styles.goalChip}>
                <Text style={styles.goalText}>{goal}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          {settingsOptions.map((option, index) => (
            <View key={index} style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Ionicons name={option.icon as any} size={24} color="#00A7A7" />
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>{option.title}</Text>
                  <Text style={styles.settingSubtitle}>{option.subtitle}</Text>
                </View>
              </View>
              <Switch
                value={option.value}
                onValueChange={option.onToggle}
                trackColor={{ false: '#E5E7EB', true: '#CCFBF1' }}
                thumbColor={option.value ? '#00A7A7' : '#F3F4F6'}
              />
            </View>
          ))}
        </View>

        {/* Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions</Text>
          {actionOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionItem}
              onPress={option.onPress}
            >
              <View style={styles.actionInfo}>
                <Ionicons 
                  name={option.icon as any} 
                  size={24} 
                  color={option.destructive ? '#EF4444' : '#00A7A7'} 
                />
                <View style={styles.actionText}>
                  <Text style={[
                    styles.actionTitle,
                    option.destructive && styles.destructiveText
                  ]}>
                    {option.title}
                  </Text>
                  <Text style={styles.actionSubtitle}>{option.subtitle}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
            </TouchableOpacity>
          ))}
        </View>

        {/* App Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>Version 1.0.0</Text>
            <Text style={styles.infoSubtext}>
              Built with ❤️ to help you stay active and healthy
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#092E4C',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  userCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F0FDFA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#092E4C',
  },
  userLevel: {
    fontSize: 16,
    color: '#00A7A7',
    marginTop: 4,
  },
  userStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#092E4C',
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#092E4C',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  goalsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 8,
  },
  goalChip: {
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#00A7A7',
  },
  goalText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#00A7A7',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 8,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 16,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#092E4C',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  actionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 8,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  actionText: {
    marginLeft: 16,
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#092E4C',
  },
  destructiveText: {
    color: '#EF4444',
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#092E4C',
  },
  infoSubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
  },
});