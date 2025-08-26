import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useUser } from '@/contexts/UserContext';
import StreakRing from '@/components/StreakRing';
import ExerciseCard from '@/components/ExerciseCard';
import { exercises, quickStretches, getWorkoutById } from '@/data/workouts';
import { StorageService } from '@/utils/storage';

export default function HomeScreen() {
  const router = useRouter();
  const { user, updateUser } = useUser();
  const [todaysWorkout, setTodaysWorkout] = useState<any>(null);
  const [quickStretchList, setQuickStretchList] = useState<any[]>([]);
  const [reminderEnabled, setReminderEnabled] = useState(false);

  useEffect(() => {
    setupHomeData();
    checkReminderStatus();
  }, [user]);

  const setupHomeData = async () => {
    if (!user) return;

    // Determine today's workout based on completed workouts
    const completedCount = user.completedWorkouts.length;
    const nextWorkoutId = `week1-day${(completedCount % 7) + 1}`;
    const workout = getWorkoutById(nextWorkoutId);
    setTodaysWorkout(workout);

    // Get quick stretch recommendations
    const timeOfDay = new Date().getHours();
    let recommendedStretches = [];

    if (timeOfDay < 12) {
      // Morning stretches
      recommendedStretches = exercises.filter(e => 
        ['neck-rolls', 'shoulder-shrugs', 'cat-cow-stretch'].includes(e.id)
      );
    } else if (timeOfDay < 17) {
      // Afternoon stretches
      recommendedStretches = exercises.filter(e => 
        ['chest-stretch', 'seated-spinal-twist', 'wall-slides'].includes(e.id)
      );
    } else {
      // Evening stretches
      recommendedStretches = exercises.filter(e => 
        ['hip-circles', 'ankle-rolls', 'leg-extensions'].includes(e.id)
      );
    }

    setQuickStretchList(recommendedStretches.slice(0, 3));
  };

  const checkReminderStatus = async () => {
    const settings = await StorageService.getSettings();
    setReminderEnabled(settings.remindersEnabled || false);
  };

  const startTodaysWorkout = () => {
    if (todaysWorkout) {
      router.push(`/workout/${todaysWorkout.id}`);
    }
  };

  const startQuickStretch = (exerciseId: string) => {
    router.push(`/workout/quick-${exerciseId}`);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getNextBadgeProgress = () => {
    if (!user) return { name: '', progress: 0, total: 1 };
    
    const sessions = user.completedWorkouts.length;
    const streak = user.currentStreak;
    
    if (sessions === 0) {
      return { name: 'First Steps', progress: 0, total: 1 };
    } else if (sessions < 7) {
      return { name: 'Week Warrior', progress: sessions, total: 7 };
    } else if (streak < 7) {
      return { name: 'Consistency Champion', progress: streak, total: 7 };
    }
    
    return { name: 'All caught up!', progress: 1, total: 1 };
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const nextBadge = getNextBadgeProgress();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.userName}>Ready to move?</Text>
          </View>
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={() => router.push('/profile')}
          >
            <Ionicons name="notifications-outline" size={24} color="#092E4C" />
            {!reminderEnabled && (
              <View style={styles.notificationDot} />
            )}
          </TouchableOpacity>
        </View>

        {/* Streak Section */}
        <View style={styles.streakSection}>
          <StreakRing streak={user.currentStreak} />
          <View style={styles.streakInfo}>
            <Text style={styles.streakTitle}>Current Streak</Text>
            <Text style={styles.streakSubtext}>
              {user.currentStreak === 0 ? 'Start today!' : 'Keep it going!'}
            </Text>
          </View>
        </View>

        {/* Today's Workout CTA */}
        {todaysWorkout && (
          <View style={styles.section}>
            <TouchableOpacity 
              style={styles.todaysWorkoutButton} 
              onPress={startTodaysWorkout}
            >
              <View style={styles.workoutInfo}>
                <Text style={styles.workoutTitle}>{todaysWorkout.title}</Text>
                <Text style={styles.workoutSubtitle}>
                  {Math.floor(todaysWorkout.totalDuration / 60)} minutes • Week {todaysWorkout.week}, Day {todaysWorkout.day}
                </Text>
              </View>
              <View style={styles.playButtonLarge}>
                <Ionicons name="play" size={32} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Next Badge Progress */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Next Badge</Text>
          <View style={styles.badgeProgress}>
            <View style={styles.badgeInfo}>
              <Ionicons name="trophy" size={24} color="#F59E0B" />
              <View style={styles.badgeText}>
                <Text style={styles.badgeName}>{nextBadge.name}</Text>
                <Text style={styles.badgeProgressText}>
                  {nextBadge.progress}/{nextBadge.total} completed
                </Text>
              </View>
            </View>
            <View style={styles.progressBarContainer}>
              <View 
                style={[
                  styles.progressBar, 
                  { width: `${(nextBadge.progress / nextBadge.total) * 100}%` }
                ]} 
              />
            </View>
          </View>
        </View>

        {/* Quick Stretches */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Stretches</Text>
            <Text style={styles.sectionSubtitle}>Perfect for right now</Text>
          </View>
          
          {quickStretchList.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              onPress={() => startQuickStretch(exercise.id)}
            />
          ))}
        </View>

        {/* Reminder Status */}
        <View style={styles.section}>
          <View style={styles.reminderChip}>
            <Ionicons 
              name={reminderEnabled ? "checkmark-circle" : "alert-circle"} 
              size={20} 
              color={reminderEnabled ? "#10B981" : "#F59E0B"} 
            />
            <Text style={styles.reminderText}>
              {reminderEnabled ? 'Reminders enabled' : 'Set up reminders'}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
  },
  greeting: {
    fontSize: 16,
    color: '#6B7280',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#092E4C',
    marginTop: 2,
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F59E0B',
  },
  streakSection: {
    alignItems: 'center',
    padding: 20,
    marginBottom: 10,
  },
  streakInfo: {
    alignItems: 'center',
    marginTop: 16,
  },
  streakTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#092E4C',
  },
  streakSubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#092E4C',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  todaysWorkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00A7A7',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#00A7A7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  workoutInfo: {
    flex: 1,
  },
  workoutTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  workoutSubtitle: {
    fontSize: 14,
    color: '#CCFBF1',
  },
  playButtonLarge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeProgress: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  badgeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  badgeText: {
    marginLeft: 12,
    flex: 1,
  },
  badgeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#092E4C',
  },
  badgeProgressText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#F59E0B',
    borderRadius: 3,
  },
  reminderChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reminderText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#092E4C',
    marginLeft: 12,
  },
});