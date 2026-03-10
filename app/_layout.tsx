import { Stack, useRouter, useSegments } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const [hasSession, setHasSession] = useState<string | null>(null);
  const segments = useSegments();
  const router = useRouter();

  // 1. Session Kontrolü
  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await SecureStore.getItemAsync('hasSession');
        setHasSession(session);
      } catch (e) {
        console.error('Session okuma hatası:', e);
      } finally {
        setIsReady(true);
      }
    };
    checkSession();
  }, [segments]);

  // 2. Yönlendirme Koruması
  useEffect(() => {
    if (!isReady) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!hasSession && !inAuthGroup) {
      // Giriş yoksa logine at
      router.replace('/(auth)/LoginScreen');
    } else if (hasSession && inAuthGroup) {
      // Giriş varsa içerideki ana sayfaya at
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
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen
        name="home"
        options={{ headerShown: true, title: 'Ana Sayfa' }}
      />
    </Stack>
  );
}
