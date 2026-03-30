import { WaypointCardDetail } from '@/components/trip/WaypointCardDetail';
import { apiClient } from '@/src/api/client';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function TripDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTripDetail();
  }, [id]);

  const fetchTripDetail = async () => {
    try {
      const res = await apiClient.get(`/api/v1/trips/${id}`);
      setTrip(res.data.trip);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ActivityIndicator className="flex-1" color="#4ECDC4" />;

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* 🏔️ Ana Kapak Resmi  */}
        <View className="relative h-[450px] w-full">
          <Image
            source={{
              uri:
                trip?.cover_image_url ||
                'https://images.unsplash.com/photo-1500622397060-4356c77028f3?q=80&w=2070&auto=format&fit=crop',
            }}
            className="w-full h-full"
          />
          {/* Overlay Gradient (Yazıların okunması için) */}
          <View className="absolute inset-0 bg-black/30" />

          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute top-14 left-6 bg-white/20 p-2 rounded-full backdrop-blur-md"
          >
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>

          <View className="absolute bottom-12 left-6 right-6">
            <View className="flex-row items-center mb-2">
              <View className="bg-[#4ECDC4] px-3 py-1 rounded-full">
                <Text className="text-white font-bold text-[10px] uppercase">
                  Rota
                </Text>
              </View>
              <Text className="text-white/80 text-xs ml-3 font-medium">
                {new Date(trip?.published_at).toLocaleDateString('tr-TR')}
              </Text>
            </View>
            <Text className="text-white text-4xl font-black">
              {trip?.title}
            </Text>
          </View>
        </View>

        {/* 📊 Etkileşim Barı (Beğeni, Görüntülenme, Yorum Butonu) */}
        <View className="flex-row items-center justify-between px-6 py-5 border-b border-gray-100">
          <View className="flex-row items-center space-x-6">
            <TouchableOpacity className="flex-row items-center">
              <Ionicons name="heart-outline" size={26} color="#374151" />
              <Text className="ml-2 font-bold text-gray-700">1.2k</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center"
              onPress={() => {
                /* Yorum modalı */
              }}
            >
              <Ionicons name="chatbubble-outline" size={24} color="#374151" />
              <Text className="ml-2 font-bold text-gray-700">48</Text>
            </TouchableOpacity>

            <View className="flex-row items-center">
              <Ionicons name="eye-outline" size={24} color="#374151" />
              <Text className="ml-2 font-bold text-gray-700">
                {trip?.view_count}
              </Text>
            </View>
          </View>

          <TouchableOpacity>
            <Ionicons name="share-social-outline" size={24} color="#374151" />
          </TouchableOpacity>
        </View>

        {/* 📝 Açıklama */}
        <View className="p-6">
          <Text className="text-gray-600 leading-7 text-base italic">
            "{trip?.description}"
          </Text>
        </View>

        {/* 📍 Duraklar  */}
        <View className="px-6 pb-20">
          <Text className="text-xl font-black text-gray-900 mb-6">
            Yolculuk Durakları
          </Text>

          {trip?.waypoints?.map((wp: any, index: number) => (
            <WaypointCardDetail
              key={wp.id}
              waypoint={wp}
              isLast={index === trip.waypoints.length - 1}
              index={index}
            />
          ))}
        </View>
      </ScrollView>

      {/* 💬 Sabit Yorum Yap Butonu */}
      {/* <TouchableOpacity
        className="absolute bottom-10 self-center bg-gray-900 px-8 py-4 rounded-full shadow-2xl flex-row items-center"
        onPress={() => Alert.alert('Yakında', 'Yorum sistemi aktif edilecek.')}
      >
        <Ionicons name="chatbox" size={20} color="#4ECDC4" />
        <Text className="text-white font-bold ml-3 text-base">
          Yorumları Gör
        </Text>
      </TouchableOpacity> */}
    </View>
  );
}
