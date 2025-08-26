import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Exercise } from '@/types';

interface ExerciseCardProps {
  exercise: Exercise;
  onPress: () => void;
  showDuration?: boolean;
}

export default function ExerciseCard({ 
  exercise, 
  onPress, 
  showDuration = true 
}: ExerciseCardProps) {
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return minutes > 0 ? `${minutes}m ${remainingSeconds}s` : `${remainingSeconds}s`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '#10B981';
      case 'intermediate': return '#F59E0B';
      case 'advanced': return '#EF4444';
      default: return '#6B7280';
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={{ uri: exercise.imageUrl }} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={2}>
            {exercise.name}
          </Text>
          {showDuration && (
            <Text style={styles.duration}>
              {formatDuration(exercise.duration)}
            </Text>
          )}
        </View>
        
        <Text style={styles.description} numberOfLines={2}>
          {exercise.description}
        </Text>
        
        <View style={styles.footer}>
          <View style={styles.tags}>
            <View style={[styles.difficultyTag, { backgroundColor: getDifficultyColor(exercise.difficulty) }]}>
              <Text style={styles.tagText}>{exercise.difficulty}</Text>
            </View>
            <View style={styles.categoryTag}>
              <Text style={styles.categoryText}>{exercise.category}</Text>
            </View>
          </View>
          
          <View style={styles.muscleGroups}>
            {exercise.targetMuscles.slice(0, 2).map((muscle, index) => (
              <Text key={index} style={styles.muscle}>
                {muscle}
              </Text>
            ))}
            {exercise.targetMuscles.length > 2 && (
              <Text style={styles.muscle}>+{exercise.targetMuscles.length - 2}</Text>
            )}
          </View>
        </View>
      </View>
      
      <View style={styles.playButton}>
        <Ionicons name="play" size={20} color="#00A7A7" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 120,
    backgroundColor: '#F3F4F6',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#092E4C',
    flex: 1,
    marginRight: 8,
  },
  duration: {
    fontSize: 14,
    fontWeight: '500',
    color: '#00A7A7',
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tags: {
    flexDirection: 'row',
    gap: 8,
  },
  difficultyTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  categoryTag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#092E4C',
  },
  muscleGroups: {
    flexDirection: 'row',
    gap: 4,
  },
  muscle: {
    fontSize: 12,
    color: '#6B7280',
  },
  playButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#FFFFFF',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});