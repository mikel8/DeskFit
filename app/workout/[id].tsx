import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useUser } from '@/contexts/UserContext';
import WorkoutTimer from '@/components/WorkoutTimer';
import { getWorkoutById, getExerciseById } from '@/data/workouts';
import { StorageService } from '@/utils/storage';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export default function WorkoutScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user, addCompletedWorkout, addXP, incrementStreak, addBadge } = useUser();
  
  const [workout, setWorkout] = useState<any>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);

  useEffect(() => {
    if (id) {
      let workoutData;
      
      if (id.startsWith('quick-')) {
        // Single exercise workout
        const exerciseId = id.replace('quick-', '');
        const exercise = getExerciseById(exerciseId);
        if (exercise) {
          workoutData = {
            id: id,
            title: exercise.name,
            description: `Quick ${exercise.name} session`,
            totalDuration: exercise.duration + 30, // Add some padding
            exercises: [{ exerciseId: exercise.id, duration: exercise.duration, restAfter: 0 }]
          };
        }
      } else if (id.startsWith('exercise-')) {
        // Single exercise from library
        const exerciseId = id.replace('exercise-', '');
        const exercise = getExerciseById(exerciseId);
        if (exercise) {
          workoutData = {
            id: id,
            title: exercise.name,
            description: exercise.description,
            totalDuration: exercise.duration + 30,
            exercises: [{ exerciseId: exercise.id, duration: exercise.duration, restAfter: 0 }]
          };
        }
      } else {
        // Regular workout
        workoutData = getWorkoutById(id);
      }
      
      setWorkout(workoutData);
    }
  }, [id]);

  const currentWorkoutExercise = workout?.exercises[currentExerciseIndex];
  const currentExercise = currentWorkoutExercise ? getExerciseById(currentWorkoutExercise.exerciseId) : null;

  const triggerHaptic = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const startWorkout = () => {
    setWorkoutStarted(true);
    setSessionStartTime(new Date());
    setIsPlaying(true);
    triggerHaptic();
  };

  const pauseWorkout = () => {
    setIsPlaying(false);
  };

  const resumeWorkout = () => {
    setIsPlaying(true);
  };

  const skipExercise = () => {
    nextExercise();
  };

  const nextExercise = () => {
    if (currentExerciseIndex < workout.exercises.length - 1) {
      if (currentWorkoutExercise.restAfter > 0) {
        setIsResting(true);
        setIsPlaying(true);
      } else {
        setCurrentExerciseIndex(prev => prev + 1);
      }
    } else {
      completeWorkout();
    }
  };

  const completeRestPeriod = () => {
    setIsResting(false);
    setCurrentExerciseIndex(prev => prev + 1);
    setIsPlaying(true);
  };

  const completeWorkout = async () => {
    if (!user || !sessionStartTime) return;

    const sessionDuration = Math.floor((Date.now() - sessionStartTime.getTime()) / 1000);
    const xpEarned = 10; // Base XP for completing a workout

    // Save session
    const session = {
      id: `session-${Date.now()}`,
      workoutId: workout.id,
      completedAt: new Date().toISOString(),
      duration: sessionDuration,
      xpEarned,
      exercises: workout.exercises.map((ex: any) => ({
        exerciseId: ex.exerciseId,
        completed: true,
        duration: ex.duration,
      }))
    };

    await StorageService.saveSession(session);
    await addCompletedWorkout(workout.id);
    await addXP(xpEarned);

    // Check for badge achievements
    const sessions = user.completedWorkouts.length + 1;
    if (sessions === 1) {
      await addBadge('first-workout');
    } else if (sessions === 7) {
      await addBadge('week-warrior');
    }

    // Increment streak if this is first workout today
    const today = new Date().toISOString().split('T')[0];
    const sessionsToday = await StorageService.getSessions();
    const todaySessions = sessionsToday.filter(s => 
      s.completedAt.split('T')[0] === today
    );

    if (todaySessions.length === 0) {
      await incrementStreak();
      
      // Check streak badges
      const newStreak = user.currentStreak + 1;
      if (newStreak === 3) {
        await addBadge('streak-starter');
      } else if (newStreak === 7) {
        await addBadge('consistency-king');
      }
    }

    // Show completion celebration
    Alert.alert(
      '🎉 Workout Complete!',
      `Great job! You earned ${xpEarned} XP and maintained your streak.`,
      [
        {
          text: 'View Progress',
          onPress: () => router.push('/(tabs)/progress'),
        },
        {
          text: 'Done',
          onPress: () => router.push('/(tabs)'),
        },
      ]
    );
  };

  const quitWorkout = () => {
    Alert.alert(
      'Quit Workout?',
      'Your progress will not be saved if you quit now.',
      [
        { text: 'Continue Workout', style: 'cancel' },
        { text: 'Quit', style: 'destructive', onPress: () => router.back() },
      ]
    );
  };

  if (!workout || !currentExercise) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading workout...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const getCurrentTimer = () => {
    if (isResting) {
      return {
        duration: currentWorkoutExercise.restAfter,
        onComplete: completeRestPeriod,
        title: 'Rest',
        subtitle: 'Get ready for the next exercise'
      };
    } else {
      return {
        duration: currentWorkoutExercise.duration,
        onComplete: nextExercise,
        title: currentExercise.name,
        subtitle: currentExercise.description
      };
    }
  };

  const timerConfig = getCurrentTimer();
  const totalExercises = workout.exercises.length;
  const progressPercent = ((currentExerciseIndex + (isResting ? 0.5 : 0)) / totalExercises) * 100;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={quitWorkout}>
          <Ionicons name="close" size={24} color="#092E4C" />
        </TouchableOpacity>
        
        <View style={styles.progressHeader}>
          <Text style={styles.progressText}>
            {isResting ? 'Rest' : `${currentExerciseIndex + 1}/${totalExercises}`}
          </Text>
        </View>
        
        <View style={styles.headerSpacer} />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground}>
          <View 
            style={[
              styles.progressBarFill, 
              { width: `${progressPercent}%` }
            ]} 
          />
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {!isResting && currentExercise.imageUrl && (
          <Image source={{ uri: currentExercise.imageUrl }} style={styles.exerciseImage} />
        )}

        <View style={styles.exerciseInfo}>
          <Text style={styles.exerciseTitle}>{timerConfig.title}</Text>
          <Text style={styles.exerciseDescription}>{timerConfig.subtitle}</Text>
        </View>

        {/* Timer */}
        <WorkoutTimer
          duration={timerConfig.duration}
          isActive={isPlaying}
          onComplete={timerConfig.onComplete}
        />

        {/* Instructions */}
        {!isResting && currentExercise.instructions && (
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsTitle}>Form Cues:</Text>
            {currentExercise.instructions.slice(0, 3).map((instruction: string, index: number) => (
              <Text key={index} style={styles.instruction}>
                • {instruction}
              </Text>
            ))}
          </View>
        )}
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        {!workoutStarted ? (
          <TouchableOpacity style={styles.startButton} onPress={startWorkout}>
            <Ionicons name="play" size={24} color="#FFFFFF" />
            <Text style={styles.startButtonText}>Start Workout</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.controlsRow}>
            <TouchableOpacity 
              style={styles.controlButton} 
              onPress={skipExercise}
            >
              <Ionicons name="play-skip-forward" size={20} color="#6B7280" />
              <Text style={styles.controlButtonText}>Skip</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.controlButton, styles.primaryControl]} 
              onPress={isPlaying ? pauseWorkout : resumeWorkout}
            >
              <Ionicons 
                name={isPlaying ? "pause" : "play"} 
                size={24} 
                color="#FFFFFF" 
              />
              <Text style={styles.primaryControlText}>
                {isPlaying ? 'Pause' : 'Resume'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.controlButton} 
              onPress={() => Alert.alert('Modify', 'Exercise modifications coming soon!')}
            >
              <Ionicons name="settings" size={20} color="#6B7280" />
              <Text style={styles.controlButtonText}>Modify</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
  },
  closeButton: {
    padding: 8,
  },
  progressHeader: {
    flex: 1,
    alignItems: 'center',
  },
  progressText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#092E4C',
  },
  headerSpacer: {
    width: 40,
  },
  progressBarContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  progressBarBackground: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#00A7A7',
    borderRadius: 2,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  exerciseImage: {
    width: 200,
    height: 150,
    borderRadius: 12,
    marginBottom: 24,
  },
  exerciseInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  exerciseTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#092E4C',
    textAlign: 'center',
    marginBottom: 8,
  },
  exerciseDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  instructionsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#092E4C',
    marginBottom: 12,
  },
  instruction: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 6,
  },
  controls: {
    padding: 20,
    paddingBottom: 40,
  },
  startButton: {
    backgroundColor: '#00A7A7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#00A7A7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  controlsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  controlButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  primaryControl: {
    backgroundColor: '#00A7A7',
    borderColor: '#00A7A7',
  },
  controlButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginLeft: 6,
  },
  primaryControlText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
});