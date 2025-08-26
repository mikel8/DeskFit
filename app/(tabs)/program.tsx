import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useUser } from '@/contexts/UserContext';
import { getWorkoutsByWeek, getWorkoutById } from '@/data/workouts';

export default function ProgramScreen() {
  const router = useRouter();
  const { user } = useUser();
  const [week1Workouts, setWeek1Workouts] = useState<any[]>([]);

  useEffect(() => {
    const workouts = getWorkoutsByWeek(1);
    setWeek1Workouts(workouts);
  }, []);

  const isWorkoutCompleted = (workoutId: string) => {
    return user?.completedWorkouts.includes(workoutId) || false;
  };

  const isWorkoutAccessible = (day: number) => {
    if (!user) return false;
    return user.completedWorkouts.length >= day - 1;
  };

  const startWorkout = (workoutId: string, accessible: boolean) => {
    if (!accessible) return;
    router.push(`/workout/${workoutId}`);
  };

  const getCompletionRate = () => {
    if (!user) return 0;
    const totalWorkouts = 7; // Week 1 has 7 workouts
    const completed = user.completedWorkouts.filter(id => id.startsWith('week1')).length;
    return Math.round((completed / totalWorkouts) * 100);
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>6-Week Program</Text>
            <Text style={styles.headerSubtitle}>Week 1: Foundation Building</Text>
          </View>
          <View style={styles.completionBadge}>
            <Text style={styles.completionText}>{getCompletionRate()}%</Text>
          </View>
        </View>

        {/* Progress Overview */}
        <View style={styles.progressSection}>
          <Text style={styles.progressTitle}>Week 1 Progress</Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${getCompletionRate()}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {user?.completedWorkouts.filter(id => id.startsWith('week1')).length || 0} of 7 sessions completed
          </Text>
        </View>

        {/* Weekly Schedule */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>This Week's Schedule</Text>
          
          {week1Workouts.map((workout, index) => {
            const isCompleted = isWorkoutCompleted(workout.id);
            const isAccessible = isWorkoutAccessible(workout.day || 1);
            
            return (
              <TouchableOpacity
                key={workout.id}
                style={[
                  styles.workoutCard,
                  isCompleted && styles.completedCard,
                  !isAccessible && styles.lockedCard
                ]}
                onPress={() => startWorkout(workout.id, isAccessible)}
                disabled={!isAccessible}
              >
                <View style={styles.workoutCardContent}>
                  <View style={styles.dayIndicator}>
                    {isCompleted ? (
                      <Ionicons name="checkmark-circle" size={32} color="#10B981" />
                    ) : isAccessible ? (
                      <View style={styles.dayNumber}>
                        <Text style={styles.dayText}>{workout.day}</Text>
                      </View>
                    ) : (
                      <Ionicons name="lock-closed" size={24} color="#9CA3AF" />
                    )}
                  </View>
                  
                  <View style={styles.workoutInfo}>
                    <Text style={[
                      styles.workoutTitle,
                      !isAccessible && styles.lockedText
                    ]}>
                      {workout.title}
                    </Text>
                    <Text style={[
                      styles.workoutDescription,
                      !isAccessible && styles.lockedText
                    ]}>
                      {workout.description}
                    </Text>
                    <View style={styles.workoutMeta}>
                      <Text style={[
                        styles.duration,
                        !isAccessible && styles.lockedText
                      ]}>
                        {formatDuration(workout.totalDuration)}
                      </Text>
                      <Text style={[
                        styles.difficulty,
                        !isAccessible && styles.lockedText
                      ]}>
                        {workout.difficulty}
                      </Text>
                    </View>
                  </View>

                  {isAccessible && !isCompleted && (
                    <View style={styles.actionButton}>
                      <Ionicons name="play" size={20} color="#00A7A7" />
                    </View>
                  )}
                </View>

                {workout.coachNotes && isAccessible && (
                  <View style={styles.coachNotes}>
                    <Ionicons name="person-circle" size={16} color="#00A7A7" />
                    <Text style={styles.coachText}>{workout.coachNotes}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Coming Soon */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Coming Soon</Text>
          <View style={styles.comingSoonCard}>
            <Ionicons name="calendar" size={32} color="#6B7280" />
            <Text style={styles.comingSoonText}>Week 2 unlocks after completing Week 1</Text>
            <Text style={styles.comingSoonSubtext}>
              More challenging workouts and new exercises await!
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    color: '#00A7A7',
    marginTop: 4,
  },
  completionBadge: {
    backgroundColor: '#00A7A7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  completionText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  progressSection: {
    padding: 20,
    paddingTop: 10,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#092E4C',
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00A7A7',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#6B7280',
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
  workoutCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  completedCard: {
    backgroundColor: '#F0FDF4',
    borderWidth: 2,
    borderColor: '#10B981',
  },
  lockedCard: {
    opacity: 0.6,
  },
  workoutCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dayIndicator: {
    marginRight: 16,
  },
  dayNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#00A7A7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  workoutInfo: {
    flex: 1,
  },
  workoutTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#092E4C',
    marginBottom: 4,
  },
  workoutDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  lockedText: {
    color: '#9CA3AF',
  },
  workoutMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  duration: {
    fontSize: 14,
    fontWeight: '500',
    color: '#00A7A7',
  },
  difficulty: {
    fontSize: 14,
    color: '#6B7280',
    textTransform: 'capitalize',
  },
  actionButton: {
    backgroundColor: '#F0FDFA',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coachNotes: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 12,
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
  },
  coachText: {
    fontSize: 14,
    color: '#374151',
    fontStyle: 'italic',
    marginLeft: 8,
    flex: 1,
  },
  comingSoonCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  comingSoonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 12,
    textAlign: 'center',
  },
  comingSoonSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
    textAlign: 'center',
  },
});