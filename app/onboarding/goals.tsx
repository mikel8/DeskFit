import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const painAreas = [
  { id: 'neck', label: 'Neck & Shoulders', icon: 'body', description: 'Upper body tension relief' },
  { id: 'back', label: 'Lower Back', icon: 'medical', description: 'Strengthen and stretch your back' },
  { id: 'hips', label: 'Hips & Glutes', icon: 'walk', description: 'Counter sitting effects' },
  { id: 'posture', label: 'Overall Posture', icon: 'person-standing', description: 'Improve your alignment' },
  { id: 'energy', label: 'Energy & Focus', icon: 'flash', description: 'Boost your daily energy' },
  { id: 'stress', label: 'Stress Relief', icon: 'heart', description: 'Relaxation and mindfulness' },
];

export default function GoalsScreen() {
  const router = useRouter();
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const toggleGoal = (goalId: string) => {
    setSelectedGoals(prev => 
      prev.includes(goalId) 
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };

  const canContinue = selectedGoals.length > 0;

  const handleContinue = () => {
    if (canContinue) {
      // Store selected goals temporarily - will be saved in final step
      router.push({
        pathname: '/onboarding/schedule',
        params: { goals: JSON.stringify(selectedGoals) }
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#092E4C" />
        </TouchableOpacity>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressDot} />
          <View style={[styles.progressDot, styles.activeDot]} />
          <View style={styles.progressDot} />
          <View style={styles.progressDot} />
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.title}>What are your goals?</Text>
          <Text style={styles.subtitle}>
            Select the areas you'd like to focus on. You can choose multiple goals.
          </Text>

          <View style={styles.goalsGrid}>
            {painAreas.map((area) => {
              const isSelected = selectedGoals.includes(area.id);
              return (
                <TouchableOpacity
                  key={area.id}
                  style={[styles.goalCard, isSelected && styles.selectedCard]}
                  onPress={() => toggleGoal(area.id)}
                >
                  <View style={[styles.iconContainer, isSelected && styles.selectedIcon]}>
                    <Ionicons 
                      name={area.icon as any} 
                      size={24} 
                      color={isSelected ? '#FFFFFF' : '#00A7A7'} 
                    />
                  </View>
                  
                  <Text style={[styles.goalTitle, isSelected && styles.selectedText]}>
                    {area.label}
                  </Text>
                  <Text style={[styles.goalDescription, isSelected && styles.selectedDescription]}>
                    {area.description}
                  </Text>

                  {isSelected && (
                    <View style={styles.checkmark}>
                      <Ionicons name="checkmark-circle" size={20} color="#00A7A7" />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomSection}>
        <TouchableOpacity 
          style={[styles.continueButton, !canContinue && styles.disabledButton]}
          onPress={handleContinue}
          disabled={!canContinue}
        >
          <Text style={[styles.buttonText, !canContinue && styles.disabledText]}>
            Continue
          </Text>
        </TouchableOpacity>
        
        <Text style={styles.selectionText}>
          {selectedGoals.length} goal{selectedGoals.length !== 1 ? 's' : ''} selected
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
  },
  backButton: {
    padding: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
  },
  activeDot: {
    backgroundColor: '#00A7A7',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#092E4C',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  goalsGrid: {
    gap: 16,
  },
  goalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedCard: {
    borderColor: '#00A7A7',
    backgroundColor: '#F0FDFA',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0FDFA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  selectedIcon: {
    backgroundColor: '#00A7A7',
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#092E4C',
    marginBottom: 8,
  },
  selectedText: {
    color: '#092E4C',
  },
  goalDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  selectedDescription: {
    color: '#374151',
  },
  checkmark: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  bottomSection: {
    padding: 24,
    paddingBottom: 40,
  },
  continueButton: {
    backgroundColor: '#00A7A7',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#00A7A7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  disabledButton: {
    backgroundColor: '#E5E7EB',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  disabledText: {
    color: '#9CA3AF',
  },
  selectionText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});