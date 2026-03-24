import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { apiClient } from '../../../src/api/client';
import { UserProfile } from '../../../src/types/user';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProfile = async () => {
    try {
      const response = await apiClient.get<{ user: UserProfile }>(
        '/api/v1/users/me',
      );
      setUser(response.data.user);
    } catch (error) {
      console.error('Profil çekme hatası:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProfile();
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#4ECDC4" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#4ECDC4"
          />
        }
      >
        {/* Banner Alanı */}
        <View className="h-44 w-full bg-gray-200 relative">
          {user?.banner_url ? (
            <Image
              source={{ uri: user.banner_url }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full bg-[#4ECDC4]/20 items-center justify-center">
              <Ionicons
                name="images-outline"
                size={40}
                color="#4ECDC4"
                opacity={0.3}
              />
            </View>
          )}

          {/* Düzenle Butonu (Banner üzerine sağ üstte şık bir ikon) */}
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/profile/profile_edit')}
            className="absolute right-4 top-12 bg-black/30 p-2 rounded-full backdrop-blur-md"
          >
            <Ionicons name="settings-outline" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Profil Fotoğrafı (Banner'a taşan tasarım) */}
        <View className="px-6 -mt-12">
          <View className="w-24 h-24 rounded-full border-4 border-white bg-gray-100 overflow-hidden shadow-sm">
            {user?.avatar_url ? (
              <Image
                source={{ uri: user.avatar_url }}
                className="w-full h-full"
              />
            ) : (
              <View className="items-center justify-center flex-1 bg-gray-200">
                <Ionicons name="person" size={40} color="#9CA3AF" />
              </View>
            )}
          </View>

          {/* İsim ve Kullanıcı Adı */}
          <View className="mt-3">
            <View className="flex-row items-center">
              <Text className="text-2xl font-black text-gray-900">
                {user?.first_name} {user?.last_name}
              </Text>
              <Ionicons
                name="checkmark-circle"
                size={18}
                color="#4ECDC4"
                className="ml-1"
              />
            </View>
            <Text className="text-gray-500 font-medium">@{user?.username}</Text>
          </View>

          {/* Bio Bölümü */}
          {user?.bio && (
            <Text className="mt-4 text-gray-700 leading-5 text-[15px]">
              {user.bio}
            </Text>
          )}

          {/* Konum ve Link */}
          <View className="flex-row flex-wrap mt-4 space-x-4">
            {user?.location && (
              <View className="flex-row items-center mr-4">
                <Ionicons name="location-outline" size={16} color="#6B7280" />
                <Text className="ml-1 text-gray-500 text-sm">
                  {user.location}
                </Text>
              </View>
            )}
            {user?.website && (
              <View className="flex-row items-center">
                <Ionicons name="link-outline" size={16} color="#4ECDC4" />
                <Text className="ml-1 text-[#4ECDC4] text-sm">
                  {user.website}
                </Text>
              </View>
            )}
          </View>

          {/* Preferences (İlgi Alanları - Şık Etiketler) */}
          {user?.preferences && user.preferences.length > 0 && (
            <View className="mt-6">
              <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                İlgi Alanları
              </Text>
              <View className="flex-row flex-wrap">
                {user.preferences.map((pref, index) => (
                  <View
                    key={index}
                    className="bg-gray-100 px-4 py-2 rounded-full mr-2 mb-2 border border-gray-200"
                  >
                    <Text className="text-gray-700 font-medium text-sm">
                      # {pref}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* İstatistikler (Opsiyonel: Takipçi vb. için yer tutucu) */}
          <View className="flex-row mt-6 border-t border-gray-100 pt-6 pb-10">
            <View className="mr-8">
              <Text className="font-black text-lg text-gray-900">128</Text>
              <Text className="text-gray-500 text-xs">Rota</Text>
            </View>
            <View className="mr-8">
              <Text className="font-black text-lg text-gray-900">1.2K</Text>
              <Text className="text-gray-500 text-xs">Takipçi</Text>
            </View>
            <View>
              <Text className="font-black text-lg text-gray-900">450</Text>
              <Text className="text-gray-500 text-xs">Beğeni</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
