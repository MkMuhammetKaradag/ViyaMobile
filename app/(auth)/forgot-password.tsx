import AuthLayout from '@/components/auth/AuthLayout';
import { useForgotPassword } from '@/src/hooks/useForgotPassword';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// Tekrar eden input stilini tek yerde topladık
function AuthInput({
  icon,
  ...props
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
} & React.ComponentProps<typeof TextInput>) {
  return (
    <View className="flex-row items-center bg-white rounded-[25px] px-5 h-14 mb-4 shadow-sm border border-gray-100">
      <Ionicons name={icon} size={20} color="#A0A0A0" />
      <TextInput
        className="flex-1 ml-3 text-[15px] text-gray-800"
        placeholderTextColor="#A0A0A0"
        {...props}
      />
    </View>
  );
}

export default function ForgotPasswordScreen() {
  const {
    step,
    email,
    setEmail,
    code,
    setCode,
    newPassword,
    setNewPassword,
    loading,
    handleRequestCode,
    handleResetPassword,
    goBack,
  } = useForgotPassword();

  return (
    <AuthLayout>
      {/* Başlık */}
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
          <AuthInput
            icon="mail-outline"
            placeholder="E-posta Adresi"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            className="flex-1 ml-3 text-[15px] text-gray-800"
          />
        ) : (
          <>
            <AuthInput
              icon="key-outline"
              placeholder="000000"
              placeholderTextColor="#D0D0D0"
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
              maxLength={6}
              className="flex-1 ml-3 text-[18px] font-bold tracking-[8px] text-gray-800"
            />
            <AuthInput
              icon="lock-closed-outline"
              placeholder="Yeni Şifre"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              className="flex-1 ml-3 text-[15px] text-gray-800"
            />
          </>
        )}

        {/* Ana buton */}
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

        {/* Geri git */}
        <TouchableOpacity className="mt-6 items-center" onPress={goBack}>
          <Text className="text-gray-500 font-medium">
            {step === 2 ? 'E-postayı Değiştir' : 'Geri Dön'}
          </Text>
        </TouchableOpacity>
      </View>
    </AuthLayout>
  );
}
