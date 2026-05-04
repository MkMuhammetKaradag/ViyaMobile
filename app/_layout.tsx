import '@/global.css';
import { ThemeProvider } from '@/src/hooks/theme/ThemeContext';
import { useUserStore } from '@/src/store/useUserStore';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
// LogBox.ignoreLogs(['SafeAreaView has been deprecated']);

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const [hasSession, setHasSession] = useState<string | null>(null);
  const segments = useSegments();
  const router = useRouter();
  const { fetchUser, user } = useUserStore();

  useEffect(() => {
    const initialize = async () => {
      try {
        const session = await SecureStore.getItemAsync('hasSession');
        setHasSession(session);

        if (session && !user) {
          await fetchUser();
        }
      } catch (e) {
        console.error('Başlatma hatası:', e);
      } finally {
        setIsReady(true);
      }
    };

    initialize();
  }, [segments]);

  useEffect(() => {
    if (!isReady) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!hasSession && !inAuthGroup) {
      router.replace('/(auth)');
    } else if (hasSession && inAuthGroup) {
      router.replace('/home');
    }
  }, [hasSession, isReady, segments]);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
