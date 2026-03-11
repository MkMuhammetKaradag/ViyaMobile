import MapBG from '@/assets/images/map_bg.png'; // Giriş sayfasındaki aynı görsel
import { apiClient } from '@/src/api/client';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async () => {
    if (!email || !password || !username) {
      return Alert.alert('Hata', 'Lütfen tüm alanları doldurun');
    }
    setLoading(true);
    try {
      const response = await apiClient.post('/api/v1/auth/signup', {
        username: username,
        email: email,
        password: password,
      });

      if (response.status === 201 || response.status === 200) {
        Alert.alert(
          'Başarılı',
          'Hesap oluşturuldu! Şimdi giriş yapabilirsiniz.',
        );
        router.replace('/(auth)');
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Kayıt başarısız';
      Alert.alert('Hata', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={MapBG}
        style={StyleSheet.absoluteFillObject}
        imageStyle={{
          opacity: 0.4,
          resizeMode: 'cover',
          position: 'absolute',
          top: 0,
          height: '30%',
        }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
          >
            <ScrollView
              contentContainerStyle={styles.scrollContainer}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.headerContainer}>
                <View style={styles.brandWrapper}>
                  <View style={styles.dot} />
                  <Text style={styles.brandText}>VİYA</Text>
                </View>
                <Text style={styles.welcomeText}>HESAP OLUŞTUR</Text>
                <Text style={styles.subtitleText}>
                  Yeni bir maceraya başlamak için kayıt ol
                </Text>
              </View>

              <View style={styles.formContainer}>
                {/* Kullanıcı Adı */}
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="Kullanıcı Adı"
                    placeholderTextColor="#A0A0A0"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                  />
                </View>

                {/* Email */}
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="E-posta Adresi"
                    placeholderTextColor="#A0A0A0"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>

                {/* Şifre */}
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="Şifre"
                    placeholderTextColor="#A0A0A0"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Ionicons
                      name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                      size={22}
                      color="#A0A0A0"
                    />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={[styles.loginButton, loading && { opacity: 0.7 }]}
                  onPress={handleSignUp}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.loginButtonText}>KAYIT OL</Text>
                  )}
                </TouchableOpacity>

                <Link href="/(auth)" asChild>
                  <TouchableOpacity style={styles.footerLink}>
                    <Text style={styles.footerText}>
                      Zaten hesabınız var mı?{' '}
                      <Text style={styles.footerLinkText}>GİRİŞ YAP</Text>
                    </Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
  },
  headerContainer: { alignItems: 'center', marginBottom: 40 },
  brandWrapper: { alignItems: 'center' },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF4D4D',
    marginBottom: -10,
  },
  brandText: {
    fontSize: 48,
    fontWeight: '900',
    color: '#333',
    letterSpacing: 5,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#444',
    marginTop: 30,
    letterSpacing: 1,
  },
  subtitleText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  formContainer: { width: '100%' },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingHorizontal: 20,
    height: 55,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  input: { fontSize: 15, color: '#333' },
  loginButton: {
    backgroundColor: '#4ECDC4',
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    elevation: 4,
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  footerLink: { marginTop: 25, alignItems: 'center' },
  footerText: { color: '#666', fontSize: 14 },
  footerLinkText: { color: '#FF6B6B', fontWeight: 'bold' },
});
