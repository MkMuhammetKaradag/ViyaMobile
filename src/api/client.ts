// src/api/client.ts
import axios from 'axios';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import Toast from 'react-native-toast-message';
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

    'X-Platform': Platform.OS, // 'ios' veya 'android' döner

    withCredentials: true,
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // EĞER istek içinde bu ayar true ise, otomatik 401 işlemlerini atla!
    if (error.config?.skipAuthInterceptor) {
      return Promise.reject(error);
    }

    if (error.response && error.response.status === 401) {
      await SecureStore.deleteItemAsync('hasSession');
      router.replace('/(auth)');
      Toast.show({
        type: 'error',
        text1: 'Oturum Süresi Doldu',
        text2: 'Lütfen tekrar giriş yapın. 👋',
        position: 'top',
        visibilityTime: 3000,
      });
    }
    return Promise.reject(error);
  },
);
