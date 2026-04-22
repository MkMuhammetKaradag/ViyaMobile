import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';

export default function UserDetailScreen() {
  const { id } = useLocalSearchParams();

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 py-6">
          <Text className="text-2xl font-bold mb-4">Kullanıcı Detayı</Text>
          <Text className="text-gray-600">Kullanıcı ID: {id}</Text>
          {/* Buraya kullanıcı detay bileşenleri eklenebilir */}
        </View>
      </ScrollView>
    </View>
  );
}
