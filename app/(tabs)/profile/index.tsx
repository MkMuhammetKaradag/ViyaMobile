import { Ionicons } from '@expo/vector-icons';

import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiClient } from '../../../src/api/client'; // Yolunu kontrol et
import { UserProfile } from '../../../src/types/user';

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProfile();
    setRefreshing(false);
  };
  useEffect(() => {
    fetchProfile();
  }, []);
  // useFocusEffect(
  //   useCallback(() => {
  //     fetchProfile(); // Sayfa her odaklandığında (focus) veriyi çeker
  //   }, []),
  // );

  const fetchProfile = async () => {
    try {
      const response = await apiClient.get<{ user: UserProfile }>(
        '/api/v1/users/me',
      );
      console.log(response.data);
      setUser(response.data.user);
    } catch (error) {
      console.error('Profil çekme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#4ECDC4" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1 px-6"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#4ECDC4']} // Android için renk
            tintColor="#4ECDC4" // iOS için renk
          />
        }
      >
        {/* Header Kısmı */}
        <View className="items-center mt-8 mb-6">
          <View className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden items-center justify-center mb-4 border-2 border-gray-100 shadow-sm">
            {user?.avatar_url ? (
              <Image
                source={{ uri: user.avatar_url }}
                className="w-full h-full"
                // Resim yüklenemezse beyaz ekran kalmasın diye:
                loadingIndicatorSource={{ uri: 'varsayılan_placeholder_url' }}
              />
            ) : (
              // Eğer fotoğraf yoksa (null ise) eski ikonu göster
              <Ionicons name="person" size={50} color="#9CA3AF" />
            )}
          </View>
          <Text className="text-2xl font-black text-gray-800">
            {user?.first_name} {user?.last_name}
          </Text>
          <Text className="text-gray-500">@{user?.username}</Text>
        </View>

        {/* Bilgi Kartları */}
        <View className="space-y-4">
          {user?.bio && (
            <View className="bg-gray-50 p-4 rounded-2xl">
              <Text className="text-xs text-gray-400 uppercase font-bold mb-1">
                Hakkımda
              </Text>
              <Text className="text-gray-700 leading-5">{user.bio}</Text>
            </View>
          )}

          <View className="flex-row space-x-3">
            {user?.location && (
              <View className="flex-1 bg-gray-50 p-4 rounded-2xl flex-row items-center">
                <Ionicons name="location-outline" size={20} color="#4ECDC4" />
                <Text className="ml-2 text-gray-700">{user.location}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Düzenleme Butonu */}
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/profile/profile_edit')}
          className="mt-8 bg-[#4ECDC4] h-14 rounded-2xl flex-row items-center justify-center shadow-lg shadow-teal-500/20"
        >
          <Ionicons name="create-outline" size={20} color="white" />
          <Text className="text-white font-bold ml-2">Profili Düzenle</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
