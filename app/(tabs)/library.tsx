import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import ExerciseCard from '@/components/ExerciseCard';
import { exercises } from '@/data/exercises';

const categories = [
  { id: 'all', label: 'All', icon: 'grid' },
  { id: 'stretch', label: 'Stretch', icon: 'body' },
  { id: 'strength', label: 'Strength', icon: 'barbell' },
  { id: 'mobility', label: 'Mobility', icon: 'refresh' },
];

const durations = [
  { id: 'all', label: 'Any time', range: [0, 300] },
  { id: 'quick', label: '1-30s', range: [0, 30] },
  { id: 'short', label: '30s-1m', range: [30, 60] },
  { id: 'medium', label: '1-2m', range: [60, 120] },
];

export default function LibraryScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDuration, setSelectedDuration] = useState('all');

  const filteredExercises = useMemo(() => {
    return exercises.filter(exercise => {
      // Search filter
      const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exercise.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exercise.targetMuscles.some(muscle => 
          muscle.toLowerCase().includes(searchQuery.toLowerCase())
        );

      // Category filter
      const matchesCategory = selectedCategory === 'all' || 
        exercise.category === selectedCategory;

      // Duration filter
      const durationRange = durations.find(d => d.id === selectedDuration)?.range || [0, 300];
      const matchesDuration = exercise.duration >= durationRange[0] && 
        exercise.duration <= durationRange[1];

      return matchesSearch && matchesCategory && matchesDuration;
    });
  }, [searchQuery, selectedCategory, selectedDuration]);

  const startExercise = (exerciseId: string) => {
    router.push(`/workout/exercise-${exerciseId}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Exercise Library</Text>
          <Text style={styles.headerSubtitle}>
            {filteredExercises.length} exercise{filteredExercises.length !== 1 ? 's' : ''} available
          </Text>
        </View>

        {/* Search */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#6B7280" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search exercises..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9CA3AF"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Category Filter */}
        <View style={styles.filterSection}>
          <Text style={styles.filterTitle}>Category</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.filterScroll}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryChip,
                  selectedCategory === category.id && styles.selectedChip
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Ionicons 
                  name={category.icon as any} 
                  size={16} 
                  color={selectedCategory === category.id ? '#FFFFFF' : '#6B7280'} 
                />
                <Text style={[
                  styles.chipText,
                  selectedCategory === category.id && styles.selectedChipText
                ]}>
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Duration Filter */}
        <View style={styles.filterSection}>
          <Text style={styles.filterTitle}>Duration</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.filterScroll}
          >
            {durations.map((duration) => (
              <TouchableOpacity
                key={duration.id}
                style={[
                  styles.categoryChip,
                  selectedDuration === duration.id && styles.selectedChip
                ]}
                onPress={() => setSelectedDuration(duration.id)}
              >
                <Text style={[
                  styles.chipText,
                  selectedDuration === duration.id && styles.selectedChipText
                ]}>
                  {duration.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Exercise List */}
        <View style={styles.exerciseSection}>
          {filteredExercises.length > 0 ? (
            filteredExercises.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                onPress={() => startExercise(exercise.id)}
              />
            ))
          ) : (
            <View style={styles.noResults}>
              <Ionicons name="search" size={48} color="#E5E7EB" />
              <Text style={styles.noResultsTitle}>No exercises found</Text>
              <Text style={styles.noResultsText}>
                Try adjusting your filters or search terms
              </Text>
            </View>
          )}
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
  searchSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#092E4C',
    marginLeft: 12,
  },
  filterSection: {
    marginBottom: 20,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#092E4C',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  filterScroll: {
    paddingLeft: 20,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedChip: {
    backgroundColor: '#00A7A7',
    borderColor: '#00A7A7',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginLeft: 6,
  },
  selectedChipText: {
    color: '#FFFFFF',
  },
  exerciseSection: {
    paddingBottom: 24,
  },
  noResults: {
    alignItems: 'center',
    padding: 40,
  },
  noResultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
  },
  noResultsText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 8,
  },
});