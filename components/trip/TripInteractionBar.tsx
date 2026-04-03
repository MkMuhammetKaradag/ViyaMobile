import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  viewCount?: number;
  likeCount?: number;
  commentCount?: number;
};

export function TripInteractionBar({
  viewCount = 0,
  likeCount = 0,
  commentCount = 0,
}: Props) {
  return (
    <View className="flex-row items-center justify-between px-6 py-5 border-b border-gray-100">
      <View className="flex-row items-center space-x-6">
        {/* Beğeni */}
        <TouchableOpacity className="flex-row items-center">
          <Ionicons name="heart-outline" size={26} color="#374151" />
          <Text className="ml-2 font-bold text-gray-700">{likeCount}</Text>
        </TouchableOpacity>

        {/* Yorum */}
        <TouchableOpacity
          className="flex-row items-center"
          onPress={() =>
            Alert.alert('Yakında', 'Yorum sistemi aktif edilecek.')
          }
        >
          <Ionicons name="chatbubble-outline" size={24} color="#374151" />
          <Text className="ml-2 font-bold text-gray-700">{commentCount}</Text>
        </TouchableOpacity>

        {/* Görüntülenme */}
        <View className="flex-row items-center">
          <Ionicons name="eye-outline" size={24} color="#374151" />
          <Text className="ml-2 font-bold text-gray-700">{viewCount}</Text>
        </View>
      </View>

      {/* Paylaş */}
      <TouchableOpacity>
        <Ionicons name="share-social-outline" size={24} color="#374151" />
      </TouchableOpacity>
    </View>
  );
}
