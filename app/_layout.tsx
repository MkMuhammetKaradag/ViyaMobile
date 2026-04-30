import '@/global.css';
import { useUserStore } from '@/src/store/useUserStore';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import { ActivityIndicator, useColorScheme, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
// LogBox.ignoreLogs(['SafeAreaView has been deprecated']);
export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const [hasSession, setHasSession] = useState<string | null>(null);
  const segments = useSegments();
  const router = useRouter();
  const { fetchUser, user } = useUserStore();
  // 1. Session Kontrolü
  // useEffect(() => {
  //   const checkSession = async () => {
  //     try {
  //       const session = await SecureStore.getItemAsync('hasSession');
  //       setHasSession(session);
  //     } catch (e) {
  //       console.error('Session okuma hatası:', e);
  //     } finally {
  //       setIsReady(true);
  //     }
  //   };
  //   checkSession();
  // }, [segments]);

  useEffect(() => {
    const initialize = async () => {
      try {
        const session = await SecureStore.getItemAsync('hasSession');
        setHasSession(session);

        // Session varsa ve store'da henüz user yoksa çek
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
  }, [segments]); // segments kalsın, yönlendirme için şart

  // 2. Yönlendirme Koruması
  useEffect(() => {
    if (!isReady) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!hasSession && !inAuthGroup) {
      // Giriş yoksa logine at
      router.replace('/(auth)');
    } else if (hasSession && inAuthGroup) {
      // Giriş varsa içerideki ana sayfaya at
      router.replace('/home');
    }
  }, [hasSession, isReady, segments]);

  const colorScheme = useColorScheme();

  // 2. Temaya göre renkleri belirliyoruz
  const isDark = colorScheme === 'dark';
  const themeColor = isDark ? '#000000' : '#FFFFFF';
  const statusBarStyle = isDark ? 'light-content' : 'dark-content';
  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </SafeAreaProvider>
  );
}
