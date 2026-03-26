import { apiClient } from '@/src/api/client';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

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
      console.error('Detay çekme hatası:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ActivityIndicator className="flex-1" color="#4ECDC4" />;

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Üst Kısım: Geri Butonu ve Resim */}
      <View className="h-80 w-full relative">
        <Image
          source={{
            uri: trip?.cover_image_url || 'https://via.placeholder.com/800',
          }}
          className="w-full h-full"
          resizeMode="cover"
        />
        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute top-12 left-6 bg-white/80 p-2 rounded-full"
        >
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* İçerik */}
      <View className="p-6 -mt-10 bg-white rounded-t-[40px] shadow-2xl">
        <Text className="text-2xl font-black text-gray-800">{trip?.title}</Text>
        <Text className="text-gray-500 mt-2 leading-6">
          {trip?.description}
        </Text>

        {/* Buraya durakları (waypoints) listeleyen bir component gelecek */}
        <View className="mt-8">
          <Text className="text-lg font-bold mb-4">Rota Durakları</Text>
          {/* Map veya Timeline burada olacak */}
        </View>
      </View>
    </ScrollView>
  );
}
