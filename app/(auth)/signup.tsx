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
    <View className="flex-1 bg-white">
      <ImageBackground
        source={MapBG}
        resizeMode="cover"
        imageStyle={{ height: '30%' }}
        imageClassName="opacity-40 absolute top-0"
        className="flex-1"
      >
        <SafeAreaView className="flex-1">
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1"
          >
            <ScrollView
              contentContainerClassName="flex-grow px-8 justify-center"
              showsVerticalScrollIndicator={false}
            >
              {/* Header Bölümü */}
              <View className="items-center mb-10">
                <View className="items-center">
                  <View className="w-2 h-2 rounded-full bg-[#FF4D4D] -mb-2 z-10" />
                  <Text className="text-[48px] font-[900] text-gray-800 tracking-[5px]">
                    VİYA
                  </Text>
                </View>
                <Text className="text-[22px] font-semibold text-gray-700 mt-8 tracking-widest">
                  HESAP OLUŞTUR
                </Text>
                <Text className="text-sm text-gray-500 mt-1 text-center">
                  Yeni bir maceraya başlamak için kayıt ol
                </Text>
              </View>

              {/* Form Bölümü */}
              <View className="w-full">
                {/* Kullanıcı Adı */}
                <View className="flex-row items-center bg-white rounded-[25px] px-5 h-14 mb-4 shadow-sm border border-gray-100">
                  <TextInput
                    className="flex-1 text-[15px] text-gray-800"
                    placeholder="Kullanıcı Adı"
                    placeholderTextColor="#A0A0A0"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                  />
                </View>

                {/* Email */}
                <View className="flex-row items-center bg-white rounded-[25px] px-5 h-14 mb-4 shadow-sm border border-gray-100">
                  <TextInput
                    className="flex-1 text-[15px] text-gray-800"
                    placeholder="E-posta Adresi"
                    placeholderTextColor="#A0A0A0"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>

                {/* Şifre */}
                <View className="flex-row items-center bg-white rounded-[25px] px-5 h-14 mb-4 shadow-sm border border-gray-100">
                  <TextInput
                    className="flex-1 text-[15px] text-gray-800"
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

                {/* Kayıt Butonu */}
                <TouchableOpacity
                  className={`h-[60px] rounded-[30px] justify-center items-center mt-3 shadow-lg ${
                    loading ? 'bg-teal-300 opacity-70' : 'bg-[#4ECDC4]'
                  }`}
                  onPress={handleSignUp}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text className="text-white text-lg font-bold tracking-widest">
                      KAYIT OL
                    </Text>
                  )}
                </TouchableOpacity>

                {/* Giriş Yap Linki */}
                <Link href="/(auth)" asChild>
                  <TouchableOpacity className="mt-6 items-center">
                    <Text className="text-gray-500 text-sm">
                      Zaten hesabınız var mı?{' '}
                      <Text className="text-[#FF6B6B] font-bold">
                        GİRİŞ YAP
                      </Text>
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
