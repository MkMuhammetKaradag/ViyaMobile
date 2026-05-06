import ScreenWrapper from '@/components/common/ScreenWrapper';
import { useThemeColors } from '@/src/hooks/theme/useThemeColors';
import { useUserStore } from '@/src/store/useUserStore';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { apiClient } from '../../../src/api/client';

export default function HomeScreen() {
  const router = useRouter();
  const { logout } = useUserStore();
  const colors = useThemeColors();

  const handleSignOut = async () => {
    try {
      await apiClient.post('/api/v1/auth/signout');
      await SecureStore.deleteItemAsync('hasSession');
      logout();
      Alert.alert('Çıkış Yapıldı', 'Başarıyla çıkış yaptınız.');
      router.replace('/(auth)');
    } catch (error) {
      console.error('Çıkış hatası:', error);
      router.replace('/(auth)');
    }
  };

  const handleRequest = async () => {
    try {
      const res = await apiClient.get(
        '/api/v1/trips/af027e65-a891-4410-8661-2f11f0bc5cc2',
      );
      console.log(res.data);
    } catch (error) {
      console.error('get trip error:', error);
    }
  };

  return (
    <ScreenWrapper>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.background,
          paddingHorizontal: 24,
        }}
      >
        <View style={{ alignItems: 'center', marginBottom: 48 }}>
          <Text
            style={{
              color: colors.text,
              fontSize: 28,
              fontWeight: '900',
              letterSpacing: 0.2,
            }}
          >
            Ana Sayfa
          </Text>
          <View
            style={{
              width: 48,
              height: 4,
              backgroundColor: colors.primary,
              marginTop: 8,
              borderRadius: 999,
            }}
          />
          <Text
            style={{
              color: colors.subtext,
              fontSize: 16,
              marginTop: 16,
              textAlign: 'center',
            }}
          >
            Viya Uygulamasına Hoş Geldiniz!
          </Text>
        </View>

        <View style={{ width: '100%', gap: 16 }}>
          <TouchableOpacity
            style={{
              backgroundColor: colors.primary,
              height: 56,
              borderRadius: 24,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: colors.primary,
              shadowOpacity: 0.18,
              shadowRadius: 14,
              elevation: 6,
            }}
            onPress={() => {
              /* istek fonksiyonun */
            }}
          >
            <Text
              style={{
                color: colors.accentText,
                fontSize: 16,
                fontWeight: '800',
                letterSpacing: 1,
              }}
            >
              Test İstek At
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: colors.secondary,
              height: 56,
              borderRadius: 24,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: colors.secondary,
              shadowOpacity: 0.18,
              shadowRadius: 14,
              elevation: 6,
            }}
            onPress={handleSignOut}
          >
            <Text
              style={{
                color: colors.accentText,
                fontSize: 16,
                fontWeight: '800',
                letterSpacing: 1,
              }}
            >
              Çıkış Yap
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenWrapper>
  );
}
