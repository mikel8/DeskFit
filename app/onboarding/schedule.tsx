import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const timeSlots = [
  { id: 'morning', label: 'Morning', time: '7:00 - 9:00 AM', icon: 'sunny' },
  { id: 'midday', label: 'Midday', time: '12:00 - 2:00 PM', icon: 'partly-sunny' },
  { id: 'afternoon', label: 'Afternoon', time: '3:00 - 5:00 PM', icon: 'cloudy' },
  { id: 'evening', label: 'Evening', time: '6:00 - 8:00 PM', icon: 'moon' },
  { id: 'flexible', label: 'Flexible', time: 'Whenever I can', icon: 'time' },
];

export default function ScheduleScreen() {
  const router = useRouter();
  const { goals } = useLocalSearchParams<{ goals: string }>();
  const [selectedTime, setSelectedTime] = useState<string>('');

  const handleContinue = () => {
    if (selectedTime) {
      router.push({
        pathname: '/onboarding/disclaimer',
        params: { 
          goals: goals,
          timePreference: selectedTime 
        }
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
          <View style={styles.progressDot} />
          <View style={[styles.progressDot, styles.activeDot]} />
          <View style={styles.progressDot} />
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.title}>When do you prefer to exercise?</Text>
          <Text style={styles.subtitle}>
            Choose your ideal workout time. We'll send gentle reminders to help you stay consistent.
          </Text>

          <View style={styles.timeSlotsContainer}>
            {timeSlots.map((slot) => {
              const isSelected = selectedTime === slot.id;
              return (
                <TouchableOpacity
                  key={slot.id}
                  style={[styles.timeSlot, isSelected && styles.selectedSlot]}
                  onPress={() => setSelectedTime(slot.id)}
                >
                  <View style={[styles.timeIcon, isSelected && styles.selectedIcon]}>
                    <Ionicons 
                      name={slot.icon as any} 
                      size={24} 
                      color={isSelected ? '#FFFFFF' : '#00A7A7'} 
                    />
                  </View>
                  
                  <View style={styles.timeInfo}>
                    <Text style={[styles.timeLabel, isSelected && styles.selectedText]}>
                      {slot.label}
                    </Text>
                    <Text style={[styles.timeRange, isSelected && styles.selectedSubtext]}>
                      {slot.time}
                    </Text>
                  </View>

                  {isSelected && (
                    <View style={styles.checkmark}>
                      <Ionicons name="checkmark-circle" size={24} color="#00A7A7" />
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
          style={[styles.continueButton, !selectedTime && styles.disabledButton]}
          onPress={handleContinue}
          disabled={!selectedTime}
        >
          <Text style={[styles.buttonText, !selectedTime && styles.disabledText]}>
            Continue
          </Text>
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
  timeSlotsContainer: {
    gap: 16,
  },
  timeSlot: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedSlot: {
    borderColor: '#00A7A7',
    backgroundColor: '#F0FDFA',
  },
  timeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0FDFA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  selectedIcon: {
    backgroundColor: '#00A7A7',
  },
  timeInfo: {
    flex: 1,
  },
  timeLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#092E4C',
    marginBottom: 4,
  },
  selectedText: {
    color: '#092E4C',
  },
  timeRange: {
    fontSize: 14,
    color: '#6B7280',
  },
  selectedSubtext: {
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
});