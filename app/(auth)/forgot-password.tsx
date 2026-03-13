import AuthLayout from '@/components/auth/AuthLayout';
import { apiClient } from '@/src/api/client';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function ForgotPasswordScreen() {
  const [step, setStep] = useState(1); // 1: Email Girişi, 2: OTP ve Yeni Şifre
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [sessionId, setSessionId] = useState('');
  // 1. AŞAMA: Kod İste
  const handleRequestCode = async () => {
    if (!email) return Alert.alert('Hata', 'Lütfen e-posta adresinizi girin');

    setLoading(true);
    try {
      const response = await apiClient.post('/api/v1/auth/forgot-password', {
        identifier: email,
      });

      if (response.data.session_id) {
        setSessionId(response.data.session_id);
      }
      setStep(2); // Başarılıysa kod girme ekranına geç
    } catch (error: any) {
      console.log(error);
      const msg = error.response?.data?.message || 'Kod gönderilemedi';
      Alert.alert('Hata', msg);
    } finally {
      setLoading(false);
    }
  };

  // 2. AŞAMA: Kodu Doğrula ve Şifreyi Sıfırla
  const handleResetPassword = async () => {
    if (code.length < 6 || !newPassword) {
      return Alert.alert(
        'Hata',
        'Lütfen 6 haneli kodu ve yeni şifrenizi girin',
      );
    }

    setLoading(true);
    try {
      // Backend'de VerifyOTP ve Reset işlemini tek seferde yapan bir endpoint varsayıyoruz
      await apiClient.post('/api/v1/auth/reset-password', {
        session_id: sessionId,
        code: code,
        new_password: newPassword,
      });

      Alert.alert('Başarılı', 'Şifreniz başarıyla güncellendi.', [
        { text: 'Giriş Yap', onPress: () => router.replace('/(auth)') },
      ]);
    } catch (error: any) {
      Alert.alert(
        'Hata',
        error.response?.data?.message || 'Sıfırlama başarısız',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <View className="items-center mb-10">
        <Text className="text-[48px] font-[900] text-gray-800 tracking-[5px]">
          VİYA
        </Text>
        <View className="w-5 h-[3px] bg-[#FF4D4D] -mt-1" />

        <Text className="text-xl font-semibold text-gray-700 mt-10 tracking-widest uppercase">
          {step === 1 ? 'Şifremi Unuttum' : 'Kodu Onayla'}
        </Text>
        <Text className="text-sm text-gray-500 mt-2 text-center px-4">
          {step === 1
            ? 'Kayıtlı e-posta adresinizi girin, size bir doğrulama kodu gönderelim.'
            : `${email} adresine gelen 6 haneli kodu ve yeni şifrenizi girin.`}
        </Text>
      </View>

      <View className="w-full">
        {step === 1 ? (
          /* EMAIL INPUT */
          <View className="flex-row items-center bg-white rounded-[25px] px-5 h-14 mb-6 shadow-sm border border-gray-100">
            <Ionicons name="mail-outline" size={20} color="#A0A0A0" />
            <TextInput
              className="flex-1 ml-3 text-[15px] text-gray-800"
              placeholder="E-posta Adresi"
              placeholderTextColor="#A0A0A0"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>
        ) : (
          /* OTP & NEW PASSWORD INPUTS */
          <View>
            <View className="flex-row items-center bg-white rounded-[25px] px-5 h-14 mb-4 shadow-sm border border-gray-100">
              <Ionicons name="key-outline" size={20} color="#A0A0A0" />
              <TextInput
                className="flex-1 ml-3 text-[18px] font-bold tracking-[8px] text-gray-800"
                placeholder="000000"
                placeholderTextColor="#D0D0D0"
                value={code}
                onChangeText={setCode}
                keyboardType="number-pad"
                maxLength={6}
              />
            </View>

            <View className="flex-row items-center bg-white rounded-[25px] px-5 h-14 mb-6 shadow-sm border border-gray-100">
              <Ionicons name="lock-closed-outline" size={20} color="#A0A0A0" />
              <TextInput
                className="flex-1 ml-3 text-[15px] text-gray-800"
                placeholder="Yeni Şifre"
                placeholderTextColor="#A0A0A0"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
              />
            </View>
          </View>
        )}

        <TouchableOpacity
          className={`h-[60px] rounded-[30px] justify-center items-center shadow-lg ${
            loading ? 'bg-teal-300' : 'bg-[#4ECDC4]'
          }`}
          onPress={step === 1 ? handleRequestCode : handleResetPassword}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-lg font-bold tracking-widest">
              {step === 1 ? 'KOD GÖNDER' : 'ŞİFREYİ GÜNCELLE'}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          className="mt-6 items-center"
          onPress={() => (step === 2 ? setStep(1) : router.back())}
        >
          <Text className="text-gray-500 font-medium">
            {step === 2 ? 'E-postayı Değiştir' : 'Geri Dön'}
          </Text>
        </TouchableOpacity>
      </View>
    </AuthLayout>
  );
}
