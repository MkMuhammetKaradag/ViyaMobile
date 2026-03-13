import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { apiClient } from '../../src/api/client'; // Kendi dosya yoluna göre ayarla

export default function HomeScreen() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      // 1. Backend'e çıkış isteği at (Cookie'yi temizlemesi için)
      await apiClient.post('/api/v1/auth/signout');

      // 2. Yerel saklanan flag varsa temizle
      await SecureStore.deleteItemAsync('hasSession');

      Alert.alert('Çıkış Yapıldı', 'Başarıyla çıkış yaptınız.');

      // 3. Giriş ekranına geri dön
      router.replace('/(auth)'); // Kendi sign-in yoluna göre ayarla
    } catch (error) {
      console.error('Çıkış hatası:', error);
      // Hata olsa bile kullanıcıyı dışarı atabiliriz
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
    <View className="flex-1 justify-center items-center bg-gray-50 px-6">
      {/* Başlık Bölümü */}
      <View className="items-center mb-12">
        <Text className="text-3xl font-black text-gray-800 tracking-tight">
          Ana Sayfa
        </Text>
        <View className="w-12 h-1 bg-[#4ECDC4] mt-1 rounded-full" />
        <Text className="text-base text-gray-500 mt-4 text-center">
          Viya Uygulamasına Hoş Geldiniz!
        </Text>
      </View>

      {/* Aksiyon Butonları */}
      <View className="w-full space-y-4">
        {/* Test İstek Butonu (Viya Turkuazı) */}
        <TouchableOpacity
          className="bg-[#4ECDC4] h-14 rounded-2xl flex-row items-center justify-center shadow-lg shadow-teal-500/30"
          onPress={handleRequest}
        >
          <Text className="text-white text-base font-bold tracking-widest uppercase">
            Test İstek At
          </Text>
        </TouchableOpacity>

        {/* Çıkış Yap Butonu (Viya Kırmızısı) */}
        <TouchableOpacity
          className="bg-[#FF6B6B] h-14 rounded-2xl flex-row items-center justify-center shadow-lg shadow-red-500/30 mt-4"
          onPress={handleSignOut}
        >
          <Text className="text-white text-base font-bold tracking-widest uppercase">
            Çıkış Yap
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
