// src/api/client.ts
import axios from 'axios';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';
// ipconfig'de gördüğün IPv4 adresini buraya tırnak içinde yapıştır
const MY_COMPUTER_IP = process.env.EXPO_PUBLIC_API_IP;
const PORT = process.env.EXPO_PUBLIC_API_PORT;
if (!MY_COMPUTER_IP || !PORT) {
  console.warn('⚠️ API yapılandırması .env dosyasında bulunamadı!');
}

export const apiClient = axios.create({
  baseURL: `http://${MY_COMPUTER_IP}:${PORT}`,
  // baseURL: `http://10.0.2.2:${PORT}`,
  timeout: 10000, // 10 saniye bekle, hemen pes etme
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    withCredentials: true,
  },
});

apiClient.interceptors.response.use(
  (response) => response, // Hata yoksa aynen devam et
  async (error) => {
    if (error.response && error.response.status === 401) {
      // Çerezin süresi dolmuş veya geçersiz!
      await SecureStore.deleteItemAsync('hasSession'); // Local işareti sil
      router.replace('/(auth)'); // Kullanıcıyı girişe at
      Alert.alert('Oturum Kapandı', 'Lütfen tekrar giriş yapın.');
    }
    return Promise.reject(error);
  },
);
