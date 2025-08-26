import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Hero Image */}
        <View style={styles.heroSection}>
          <Image
            source={{ 
              uri: 'https://images.pexels.com/photos/6111024/pexels-photo-6111024.jpeg?auto=compress&cs=tinysrgb&w=800'
            }}
            style={styles.heroImage}
          />
        </View>

        {/* Content */}
        <View style={styles.textSection}>
          <Text style={styles.title}>Welcome to FitDesk</Text>
          <Text style={styles.subtitle}>
            Your personal fitness companion designed for busy professionals
          </Text>
          
          <View style={styles.features}>
            <View style={styles.feature}>
              <Ionicons name="time" size={24} color="#00A7A7" />
              <Text style={styles.featureText}>Quick 5-15 minute workouts</Text>
            </View>
            
            <View style={styles.feature}>
              <Ionicons name="location" size={24} color="#00A7A7" />
              <Text style={styles.featureText}>Exercise anywhere, anytime</Text>
            </View>
            
            <View style={styles.feature}>
              <Ionicons name="trending-up" size={24} color="#00A7A7" />
              <Text style={styles.featureText}>Track your progress daily</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        <TouchableOpacity 
          style={styles.getStartedButton}
          onPress={() => router.push('/onboarding/goals')}
        >
          <Text style={styles.buttonText}>Get Started</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => router.push('/(tabs)')}>
          <Text style={styles.skipText}>Skip for now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  heroSection: {
    height: 300,
    overflow: 'hidden',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  textSection: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#092E4C',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  features: {
    gap: 20,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureText: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 16,
  },
  bottomSection: {
    padding: 24,
    paddingBottom: 40,
  },
  getStartedButton: {
    backgroundColor: '#00A7A7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#00A7A7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 8,
  },
  skipText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
});