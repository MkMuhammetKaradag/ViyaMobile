import { apiClient } from '@/src/api/client';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true); // Sayfa değiştirme kontrolü
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState(''); // Kayıt için ek alan
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAuth = async () => {
    setLoading(true);
    try {
      const response = await apiClient.post('/api/v1/auth/signin', {
        identifier: email,
        password: password,
      });

      // BACKEND'DEN DÖNEN TOKEN'I KAYDET (Örn: response.data.token)
      if (response.status === 200) {
        await SecureStore.setItemAsync('hasSession', 'true');
        Alert.alert('Başarılı', 'Giriş yapıldı!');

        // Uygulamayı ana sayfaya yönlendir
        router.replace('/(tabs)/home');
      }
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || 'Bir sorun oluştu';
      Alert.alert('Hata', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.formContainer}>
            <Text style={styles.brand}>VİYA</Text>
            <Text style={styles.title}>
              {isLogin ? 'Hoş Geldiniz' : 'Hesap Oluştur'}
            </Text>
            <Text style={styles.subtitle}>
              {isLogin
                ? 'Devam etmek için giriş yapın'
                : 'Yeni bir maceraya başlamak için kayıt ol'}
            </Text>

            {!isLogin && (
              <TextInput
                style={styles.input}
                placeholder="Kullanıcı Adı"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            )}

            <TextInput
              style={styles.input}
              placeholder="E-posta Adresi"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <TextInput
              style={styles.input}
              placeholder="Şifre"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleAuth}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>
                  {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.switchButton}
              onPress={() => setIsLogin(!isLogin)}
            >
              <Text style={styles.switchText}>
                {isLogin ? 'Hesabınız yok mu? ' : 'Zaten hesabınız var mı? '}
                <Text style={styles.switchLink}>
                  {isLogin ? 'Kayıt Ol' : 'Giriş Yap'}
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContainer: { flexGrow: 1, justifyContent: 'center' },
  formContainer: { padding: 30 },
  brand: {
    fontSize: 40,
    fontWeight: '900',
    color: '#007AFF',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
    marginTop: 5,
  },
  input: {
    backgroundColor: '#F2F2F7',
    padding: 18,
    borderRadius: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 10,
    // Android Shadow
    elevation: 4,
    // iOS Shadow
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonDisabled: { backgroundColor: '#B0D4FF' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  switchButton: { marginTop: 25, alignItems: 'center' },
  switchText: { color: '#666', fontSize: 14 },
  switchLink: { color: '#007AFF', fontWeight: '700' },
});
