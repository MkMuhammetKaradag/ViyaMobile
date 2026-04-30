import ProfileHeader from '@/components/profile/ProfileHeader';
import { TripCard } from '@/components/profile/TripCard';
import { useOtherUserTrips } from '@/src/hooks/user/useOtherUserTrips';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type TabType = 'trips' | 'reposts' | 'continued';

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('trips');

  const { trips, userProfile, loading, isCloseToBottom, loadMore } =
    useOtherUserTrips(id);

  if (loading && !userProfile) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#4ECDC4" />
      </View>
    );
  }

  const canSeeTrips = !userProfile?.is_private || userProfile?.is_following;

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1">
        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute top-4 left-4 z-50 bg-white/80 p-2 rounded-full shadow-md"
        >
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>

        <ScrollView
          className="flex-1"
          stickyHeaderIndices={[1]} // Sekmelerin yukarı yapışmasını sağlar
          onScroll={({ nativeEvent }) => {
            if (isCloseToBottom(nativeEvent)) loadMore();
          }}
          scrollEventThrottle={16}
        >
          {/* 1. Header */}
          <ProfileHeader user={userProfile} isOtherUser={true} />

          {/* 2. Sticky Tab Bar */}
          <View className="flex-row border-b border-gray-100 bg-white">
            {(['trips', 'reposts', 'continued'] as TabType[]).map((tab) => {
              const icons: Record<TabType, any> = {
                trips: 'grid-outline',
                reposts: 'repeat-outline',
                continued: 'map-outline',
              };
              const isActive = activeTab === tab;
              return (
                <TouchableOpacity
                  key={tab}
                  onPress={() => setActiveTab(tab)}
                  className={`flex-1 items-center py-3 border-b-2 ${isActive ? 'border-[#4ECDC4]' : 'border-transparent'}`}
                >
                  <Ionicons
                    name={icons[tab]}
                    size={22}
                    color={isActive ? '#4ECDC4' : '#9CA3AF'}
                  />
                </TouchableOpacity>
              );
            })}
          </View>

          {/* 3. İçerik Alanı */}
          <View className="min-h-[500px]">
            {!canSeeTrips ? (
              <View className="items-center justify-center py-20 px-10">
                <View className="bg-gray-100 p-6 rounded-full mb-4">
                  <Ionicons name="lock-closed" size={40} color="#9CA3AF" />
                </View>
                <Text className="text-gray-800 font-bold text-lg text-center">
                  Bu Hesap Gizli
                </Text>
                <Text className="text-gray-500 text-center mt-2">
                  Rotaları görmek için takip etmelisin.
                </Text>
              </View>
            ) : (
              <View>
                {activeTab === 'trips' && (
                  <View className="flex-row flex-wrap w-full">
                    {trips.map((item) => (
                      <TripCard
                        key={item.id}
                        trip={item}
                        onPress={() => router.push(`/trip/${item.id}`)}
                      />
                    ))}
                    {trips.length === 0 && (
                      <Text className="text-center w-full py-10 text-gray-400">
                        Henüz rota yok.
                      </Text>
                    )}
                  </View>
                )}
                {/* Diğer tablar için placeholderlar... */}
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
