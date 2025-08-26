import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '@/contexts/UserContext';
import { badges } from '@/data/badges';
import { StorageService } from '@/utils/storage';

const { width } = Dimensions.get('window');
const calendarWidth = width - 40;
const daySize = (calendarWidth - 48) / 7; // 48 for padding between days

export default function ProgressScreen() {
  const { user } = useUser();
  const [weeklyMinutes, setWeeklyMinutes] = useState(0);
  const [calendarData, setCalendarData] = useState<any[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  useEffect(() => {
    loadProgressData();
  }, [user]);

  const loadProgressData = async () => {
    const progress = await StorageService.getProgress();
    const sessions = await StorageService.getSessions();
    
    // Calculate weekly minutes
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const weeklySessionMinutes = sessions
      .filter(s => new Date(s.completedAt) > oneWeekAgo)
      .reduce((total, session) => total + Math.floor(session.duration / 60), 0);
    
    setWeeklyMinutes(weeklySessionMinutes);
    
    // Generate calendar data
    generateCalendarData(progress, sessions);
  };

  const generateCalendarData = (progress: any[], sessions: any[]) => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), selectedMonth, 1);
    const endOfMonth = new Date(now.getFullYear(), selectedMonth + 1, 0);
    const startOfWeek = new Date(startOfMonth);
    startOfWeek.setDate(startOfMonth.getDate() - startOfMonth.getDay());

    const calendar = [];
    let currentDate = new Date(startOfWeek);

    while (currentDate <= endOfMonth || calendar.length % 7 !== 0) {
      const dateString = currentDate.toISOString().split('T')[0];
      const hasWorkout = sessions.some(s => 
        s.completedAt.split('T')[0] === dateString
      );
      
      calendar.push({
        date: new Date(currentDate),
        hasWorkout,
        isCurrentMonth: currentDate.getMonth() === selectedMonth,
        isToday: dateString === new Date().toISOString().split('T')[0],
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }

    setCalendarData(calendar);
  };

  const getUserBadges = () => {
    if (!user) return [];
    return badges.filter(badge => user.badges.includes(badge.id));
  };

  const getAvailableBadges = () => {
    if (!user) return [];
    return badges.filter(badge => !user.badges.includes(badge.id));
  };

  const getBadgeProgress = (badge: any) => {
    if (!user) return 0;
    
    switch (badge.type) {
      case 'sessions':
        return Math.min(user.completedWorkouts.length / badge.requirement, 1);
      case 'streak':
        return Math.min(user.currentStreak / badge.requirement, 1);
      case 'time':
        // For time-based badges, we'd need to calculate total exercise time
        return 0.5; // Placeholder
      default:
        return 0;
    }
  };

  const totalXP = user?.totalXP || 0;
  const currentLevel = Math.floor(totalXP / 100) + 1;
  const xpToNextLevel = 100 - (totalXP % 100);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Progress</Text>
          <Text style={styles.headerSubtitle}>Track your fitness journey</Text>
        </View>

        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="flame" size={24} color="#EF4444" />
            <Text style={styles.statNumber}>{user?.currentStreak || 0}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          
          <View style={styles.statCard}>
            <Ionicons name="time" size={24} color="#00A7A7" />
            <Text style={styles.statNumber}>{weeklyMinutes}</Text>
            <Text style={styles.statLabel}>This Week</Text>
          </View>
          
          <View style={styles.statCard}>
            <Ionicons name="trophy" size={24} color="#F59E0B" />
            <Text style={styles.statNumber}>{getUserBadges().length}</Text>
            <Text style={styles.statLabel}>Badges</Text>
          </View>
        </View>

        {/* XP Progress */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Level Progress</Text>
          <View style={styles.xpCard}>
            <View style={styles.levelInfo}>
              <Text style={styles.levelText}>Level {currentLevel}</Text>
              <Text style={styles.xpText}>{xpToNextLevel} XP to next level</Text>
            </View>
            <View style={styles.xpProgressBar}>
              <View 
                style={[
                  styles.xpProgressFill, 
                  { width: `${((totalXP % 100) / 100) * 100}%` }
                ]} 
              />
            </View>
          </View>
        </View>

        {/* Calendar Heatmap */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activity Calendar</Text>
          <View style={styles.calendar}>
            <View style={styles.calendarHeader}>
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                <Text key={index} style={styles.dayHeader}>{day}</Text>
              ))}
            </View>
            <View style={styles.calendarGrid}>
              {calendarData.map((day, index) => (
                <View
                  key={index}
                  style={[
                    styles.calendarDay,
                    day.hasWorkout && styles.activeDay,
                    day.isToday && styles.today,
                    !day.isCurrentMonth && styles.otherMonth,
                  ]}
                >
                  <Text style={[
                    styles.dayText,
                    day.hasWorkout && styles.activeDayText,
                    day.isToday && styles.todayText,
                    !day.isCurrentMonth && styles.otherMonthText,
                  ]}>
                    {day.date.getDate()}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Earned Badges */}
        {getUserBadges().length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Earned Badges</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {getUserBadges().map((badge) => (
                <View key={badge.id} style={styles.earnedBadge}>
                  <View style={styles.badgeIcon}>
                    <Ionicons name={badge.icon as any} size={24} color="#F59E0B" />
                  </View>
                  <Text style={styles.badgeName}>{badge.name}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Available Badges */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Badges</Text>
          {getAvailableBadges().slice(0, 3).map((badge) => {
            const progress = getBadgeProgress(badge);
            return (
              <View key={badge.id} style={styles.badgeCard}>
                <View style={styles.badgeCardContent}>
                  <View style={styles.badgeIcon}>
                    <Ionicons name={badge.icon as any} size={24} color="#9CA3AF" />
                  </View>
                  <View style={styles.badgeInfo}>
                    <Text style={styles.badgeName}>{badge.name}</Text>
                    <Text style={styles.badgeDescription}>{badge.description}</Text>
                  </View>
                </View>
                <View style={styles.badgeProgressContainer}>
                  <View style={styles.badgeProgressBar}>
                    <View 
                      style={[
                        styles.badgeProgressFill, 
                        { width: `${progress * 100}%` }
                      ]} 
                    />
                  </View>
                  <Text style={styles.badgeProgressText}>
                    {Math.round(progress * 100)}%
                  </Text>
                </View>
              </View>
            );
          })}
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
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#092E4C',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
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
  xpCard: {
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
  levelInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  levelText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#092E4C',
  },
  xpText: {
    fontSize: 14,
    color: '#6B7280',
  },
  xpProgressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  },
  xpProgressFill: {
    height: '100%',
    backgroundColor: '#00A7A7',
    borderRadius: 4,
  },
  calendar: {
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
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  dayHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
    width: daySize,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDay: {
    width: daySize,
    height: daySize,
    borderRadius: daySize / 2,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 2,
  },
  activeDay: {
    backgroundColor: '#00A7A7',
  },
  today: {
    borderWidth: 2,
    borderColor: '#092E4C',
  },
  otherMonth: {
    opacity: 0.3,
  },
  dayText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeDayText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  todayText: {
    color: '#092E4C',
    fontWeight: 'bold',
  },
  otherMonthText: {
    color: '#D1D5DB',
  },
  earnedBadge: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginLeft: 20,
    marginRight: 8,
    minWidth: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  badgeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  badgeName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#092E4C',
    textAlign: 'center',
  },
  badgeCard: {
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
  badgeCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  badgeInfo: {
    marginLeft: 16,
    flex: 1,
  },
  badgeDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  badgeProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  badgeProgressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
  },
  badgeProgressFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
    borderRadius: 3,
  },
  badgeProgressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    width: 40,
    textAlign: 'right',
  },
});