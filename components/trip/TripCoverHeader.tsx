import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  title: string;
  publishedAt: string;
  coverImageUrl?: string;
};

export function TripCoverHeader({ title, publishedAt, coverImageUrl }: Props) {
  const router = useRouter();

  return (
    <View className="relative h-[450px] w-full">
      <Image
        source={{
          uri:
            coverImageUrl ||
            'https://images.unsplash.com/photo-1500622397060-4356c77028f3?q=80&w=2070&auto=format&fit=crop',
        }}
        className="w-full h-full"
      />

      {/* Karartma overlay */}
      <View className="absolute inset-0 bg-black/30" />

      {/* Geri butonu */}
      <TouchableOpacity
        onPress={() => router.back()}
        className="absolute top-14 left-6 bg-white/20 p-2 rounded-full backdrop-blur-md"
      >
        <Ionicons name="chevron-back" size={24} color="white" />
      </TouchableOpacity>

      {/* Başlık ve tarih */}
      <View className="absolute bottom-12 left-6 right-6">
        <View className="flex-row items-center mb-2">
          <View className="bg-[#4ECDC4] px-3 py-1 rounded-full">
            <Text className="text-white font-bold text-[10px] uppercase">
              Rota
            </Text>
          </View>
          <Text className="text-white/80 text-xs ml-3 font-medium">
            {new Date(publishedAt).toLocaleDateString('tr-TR')}
          </Text>
        </View>
        <Text className="text-white text-4xl font-black">{title}</Text>
      </View>
    </View>
  );
}
