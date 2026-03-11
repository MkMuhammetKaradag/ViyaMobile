import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
    <View style={styles.container}>
      <Text style={styles.title}>Ana Sayfa</Text>
      <Text style={styles.welcomeText}>Viya Uygulamasına Hoş Geldiniz!</Text>

      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.signOutText}>Çıkış Yap</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.requestButton} onPress={handleRequest}>
        <Text style={styles.requestText}>Test İstek</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
  },
  signOutButton: {
    backgroundColor: '#ff4444',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    elevation: 3, // Android gölge
    shadowColor: '#000', // iOS gölge
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
  },

  requestButton: {
    backgroundColor: '#13acc7',
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginTop: 12,
    borderRadius: 8,
    elevation: 12, // Android gölge
    shadowColor: '#970202', // iOS gölge
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
  },
  signOutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  requestText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
