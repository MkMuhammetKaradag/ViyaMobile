import ProfileHeader from '@/components/profile/ProfileHeader';
import { TripCard } from '@/components/profile/TripCard';
import { useOtherUserTrips } from '@/src/hooks/user/useOtherUserTrips';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
// DİKKAT: Başka kullanıcının rotalarını çeken yeni bir hook lazım

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('trips');

  // Bu hook, parametre olarak aldığı id'ye göre veri çekecek
  const { trips, userProfile, loading } = useOtherUserTrips(id);
  if (loading && !userProfile) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#4ECDC4" />
      </View>
    );
  }

  const canSeeTrips = !userProfile?.is_private || userProfile.is_following;
  console.log('UserProfileScreen render oldu. UserProfile:', trips);
  return (
    <View className="flex-1 bg-white">
      <ProfileHeader user={userProfile} isOtherUser={true} />

      <ScrollView className="flex-1">
        {canSeeTrips ? (
          <View className="flex-row flex-wrap w-full">
            {trips.map((item) => (
              <TripCard
                key={item.id}
                trip={item}
                onPress={() =>
                  router.push({
                    pathname: '/trip/[id]',
                    params: { id: item.id },
                  })
                }
              />
            ))}
            {trips.length === 0 && (
              <Text className="text-center w-full py-10 text-gray-400">
                Henüz rota paylaşılmamış.
              </Text>
            )}
          </View>
        ) : (
          // 🔒 GİZLİ PROFİL EKRANI
          <View className="items-center justify-center py-20 px-10">
            <View className="bg-gray-100 p-6 rounded-full mb-4">
              <Ionicons name="lock-closed" size={40} color="#9CA3AF" />
            </View>
            <Text className="text-gray-800 font-bold text-lg text-center">
              Bu Hesap Gizli
            </Text>
            <Text className="text-gray-500 text-center mt-2">
              Rotalarını görmek için bu kullanıcıyı takip etmelisin.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
