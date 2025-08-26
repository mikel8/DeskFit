import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

interface WorkoutTimerProps {
  duration: number;
  isActive: boolean;
  onComplete: () => void;
  onTimeUpdate?: (timeRemaining: number) => void;
}

export default function WorkoutTimer({
  duration,
  isActive,
  onComplete,
  onTimeUpdate
}: WorkoutTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(duration);

  const triggerHaptic = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, []);

  useEffect(() => {
    setTimeRemaining(duration);
  }, [duration]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((time) => {
          const newTime = time - 1;
          onTimeUpdate?.(newTime);
          
          // Haptic feedback for last 3 seconds
          if (newTime <= 3 && newTime > 0) {
            triggerHaptic();
          }
          
          if (newTime <= 0) {
            onComplete();
            return 0;
          }
          
          return newTime;
        });
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeRemaining, onComplete, onTimeUpdate, triggerHaptic]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = 1 - (timeRemaining / duration);
  const circumference = 2 * Math.PI * 50;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <View style={styles.container}>
      <View style={styles.timerContainer}>
        <View style={styles.progressRing}>
          <Text style={styles.timeText}>{formatTime(timeRemaining)}</Text>
        </View>
      </View>
      
      <View style={styles.statusContainer}>
        {isActive ? (
          <View style={styles.activeStatus}>
            <Ionicons name="play" size={16} color="#00A7A7" />
            <Text style={styles.statusText}>Exercise in progress</Text>
          </View>
        ) : (
          <View style={styles.pausedStatus}>
            <Ionicons name="pause" size={16} color="#6B7280" />
            <Text style={styles.statusTextPaused}>Paused</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
  },
  timerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F8FAFC',
    borderWidth: 8,
    borderColor: '#00A7A7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#092E4C',
  },
  statusContainer: {
    marginTop: 16,
  },
  activeStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  pausedStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#00A7A7',
    marginLeft: 6,
  },
  statusTextPaused: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginLeft: 6,
  },
});