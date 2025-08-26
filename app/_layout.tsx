import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { UserProvider } from '@/contexts/UserContext';
import { StorageService } from '@/utils/storage';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';

export default function RootLayout() {
  useFrameworkReady();
  const [onboardingComplete, setOnboardingComplete] = useState<boolean | null>(null);
  
  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    const status = await StorageService.getOnboardingStatus();
    setOnboardingComplete(status);
  };

  if (!fontsLoaded || onboardingComplete === null) {
    return null;
  }

  return (
    <UserProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {!onboardingComplete ? (
          <>
            <Stack.Screen name="onboarding/welcome" />
            <Stack.Screen name="onboarding/goals" />
            <Stack.Screen name="onboarding/schedule" />
            <Stack.Screen name="onboarding/disclaimer" />
          </>
        ) : (
          <>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="workout/[id]" />
          </>
        )}
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </UserProvider>
  );
}