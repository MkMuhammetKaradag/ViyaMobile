import AuthLayout from '@/components/auth/AuthLayout';
import { apiClient } from '@/src/api/client';
import { Ionicons } from '@expo/vector-icons'; // Göz ikonu ve sosyal medya için
import { Link, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async () => {
    if (!email || !password)
      return Toast.show({
        type: 'info',
        text1: 'Eksik Bilgi',
        text2: 'Lütfen bu alanı doldurunuz. 👋',
        position: 'top',
        visibilityTime: 3000,
      });
    setLoading(true);
    try {
      const response = await apiClient.post('/api/v1/auth/signin', {
        identifier: email,
        password: password,
      });

      if (response.status === 200) {
        await SecureStore.setItemAsync('hasSession', 'true');
        router.replace('/(tabs)/home');
      }
    } catch (error: any) {
      console.log('Giriş Hatası:', error.response?.data || error.message);
      const msg = error.response?.data?.message || 'Giriş yapılamadı';
      Toast.show({
        type: 'error',
        text1: 'Hata',
        text2: msg,
        position: 'top',
        visibilityTime: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      {/* Logo Bölümü */}
      <View className="items-center mb-14">
        <Text className="text-[48px] font-[900] text-gray-800 tracking-[5px]">
          VİYA
        </Text>
        <View className="w-5 h-[3px] bg-[#FF4D4D] -mt-1" />
        <Text className="text-xl font-semibold text-gray-700 mt-10 tracking-widest uppercase">
          Hoş Geldin!
        </Text>
      </View>

      <View className="w-full">
        {/* Sosyal Medya Butonu */}
        <TouchableOpacity className="flex-row items-center justify-center mb-6">
          <Ionicons name="logo-google" size={20} color="#4A90E2" />
          <Text className="text-[12px] font-bold text-gray-800 ml-2 uppercase">
            Veya sosyal medya ile devam et
          </Text>
        </TouchableOpacity>

        {/* Email Girişi */}
        <View className="flex-row items-center bg-white rounded-[25px] px-5 h-14 mb-4 shadow-sm border border-gray-100">
          <TextInput
            className="flex-1 text-[15px] text-gray-800"
            placeholder="E-posta Adresi"
            placeholderTextColor="#A0A0A0"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
        </View>

        {/* Şifre Girişi */}
        <View className="flex-row items-center bg-white rounded-[25px] px-5 h-14 mb-4 shadow-sm border border-gray-100">
          <TextInput
            className="flex-1 text-[15px] text-gray-800"
            placeholder="Şifrem?"
            placeholderTextColor="#A0A0A0"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? 'eye-outline' : 'eye-off-outline'}
              size={22}
              color="#A0A0A0"
            />
          </TouchableOpacity>
        </View>

        {/* Şifremi Unuttum Linki - Burayı yeni ekledik */}
        <Link href="/(auth)/forgot-password" asChild>
          <TouchableOpacity className="items-end mb-4 px-2">
            <Text className="text-gray-400 text-xs">Şifremi Unuttum</Text>
          </TouchableOpacity>
        </Link>

        {/* Giriş Butonu */}
        <TouchableOpacity
          className={`h-[60px] rounded-[30px] justify-center items-center mt-2 shadow-lg ${
            loading ? 'bg-teal-300 opacity-70' : 'bg-[#4ECDC4]'
          }`}
          onPress={handleSignIn}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-lg font-bold tracking-widest uppercase">
              Giriş Yap
            </Text>
          )}
        </TouchableOpacity>

        {/* Kayıt Ol Linki */}
        <Link href="/(auth)/signup" asChild>
          <TouchableOpacity className="mt-6 items-center">
            <Text className="text-gray-500 text-[14px]">
              Hesabın yok mu?{' '}
              <Text className="text-[#FF6B6B] font-bold">KAYIT OL</Text>
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </AuthLayout>
  );
}
