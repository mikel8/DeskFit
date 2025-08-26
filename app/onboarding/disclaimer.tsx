import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Switch,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '@/contexts/UserContext';
import { StorageService } from '@/utils/storage';

export default function DisclaimerScreen() {
  const router = useRouter();
  const { goals, timePreference } = useLocalSearchParams<{ 
    goals: string; 
    timePreference: string; 
  }>();
  const { updateUser } = useUser();
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [enableReminders, setEnableReminders] = useState(true);

  const completeOnboarding = async () => {
    if (!agreedToTerms) return;

    try {
      const parsedGoals = goals ? JSON.parse(goals) : [];
      
      // Create new user
      const newUser = {
        id: `user-${Date.now()}`,
        goals: parsedGoals,
        timePreference: timePreference || 'flexible',
        currentStreak: 0,
        totalXP: 0,
        completedWorkouts: [],
        badges: [],
        createdAt: new Date().toISOString(),
        onboardingCompleted: true,
      };

      await StorageService.saveUser(newUser);
      await StorageService.setOnboardingComplete(true);
      
      // Save initial settings
      await StorageService.saveSettings({
        remindersEnabled: enableReminders,
        reminderTime: '9:00',
        darkMode: false,
        hapticFeedback: true,
      });

      router.replace('/(tabs)');
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
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
          <View style={styles.progressDot} />
          <View style={styles.progressDot} />
          <View style={[styles.progressDot, styles.activeDot]} />
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Ionicons name="shield-checkmark" size={48} color="#00A7A7" />
          </View>
          
          <Text style={styles.title}>Health & Safety</Text>
          <Text style={styles.subtitle}>
            Please read and acknowledge our health disclaimer before starting your fitness journey.
          </Text>

          <View style={styles.disclaimerCard}>
            <Text style={styles.disclaimerTitle}>Important Health Information</Text>
            <Text style={styles.disclaimerText}>
              • Consult your doctor before starting any exercise program{'\n'}
              • Stop immediately if you feel pain or discomfort{'\n'}
              • Listen to your body and exercise within your limits{'\n'}
              • Stay hydrated and take breaks when needed{'\n'}
              • This app is not a substitute for professional medical advice
            </Text>
          </View>

          <View style={styles.agreementSection}>
            <TouchableOpacity 
              style={styles.agreementRow}
              onPress={() => setAgreedToTerms(!agreedToTerms)}
            >
              <View style={[styles.checkbox, agreedToTerms && styles.checkedBox]}>
                {agreedToTerms && (
                  <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                )}
              </View>
              <Text style={styles.agreementText}>
                I understand and agree to the health disclaimer
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.reminderSection}>
            <View style={styles.reminderHeader}>
              <Text style={styles.reminderTitle}>Enable Workout Reminders</Text>
              <Switch
                value={enableReminders}
                onValueChange={setEnableReminders}
                trackColor={{ false: '#E5E7EB', true: '#CCFBF1' }}
                thumbColor={enableReminders ? '#00A7A7' : '#F3F4F6'}
              />
            </View>
            <Text style={styles.reminderText}>
              Get gentle notifications to help maintain your workout routine
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomSection}>
        <TouchableOpacity 
          style={[styles.completeButton, !agreedToTerms && styles.disabledButton]}
          onPress={completeOnboarding}
          disabled={!agreedToTerms}
        >
          <Text style={[styles.buttonText, !agreedToTerms && styles.disabledText]}>
            Complete Setup
          </Text>
          <Ionicons 
            name="checkmark" 
            size={20} 
            color={agreedToTerms ? "#FFFFFF" : "#9CA3AF"} 
          />
        </TouchableOpacity>
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
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
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
  disclaimerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#FEF3C7',
    backgroundColor: '#FFFBEB',
  },
  disclaimerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 12,
  },
  disclaimerText: {
    fontSize: 14,
    color: '#78350F',
    lineHeight: 20,
  },
  agreementSection: {
    marginBottom: 24,
  },
  agreementRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkedBox: {
    backgroundColor: '#00A7A7',
    borderColor: '#00A7A7',
  },
  agreementText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 22,
    flex: 1,
  },
  reminderSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reminderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#092E4C',
  },
  reminderText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  bottomSection: {
    padding: 24,
    paddingBottom: 40,
  },
  completeButton: {
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
  disabledButton: {
    backgroundColor: '#E5E7EB',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 8,
  },
  disabledText: {
    color: '#9CA3AF',
  },
});