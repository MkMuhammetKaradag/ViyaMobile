import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  viewCount?: number;
  likeCount?: number;
  commentCount?: number;
  isLiked?: boolean;
  onLikePress?: () => void;
  onCommentPress?: () => void;
};

export function TripInteractionBar({
  viewCount = 0,
  likeCount = 0,
  commentCount = 0,
  isLiked = false,
  onLikePress,
  onCommentPress,
}: Props) {
  console.log(
    'TripInteractionBar render oldu. isLiked:',
    isLiked,
    'likeCount:',
    likeCount,
  );
  return (
    <View className="flex-row items-center justify-between px-6 py-5 border-b border-gray-100">
      <View className="flex-row items-center space-x-6">
        {/* Beğeni Butonu */}
        <TouchableOpacity
          className="flex-row items-center"
          onPress={onLikePress}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isLiked ? 'heart' : 'heart-outline'}
            size={26}
            color={isLiked ? '#EF4444' : '#374151'} // Beğenildiyse Kırmızı
          />
          <Text
            className={`ml-2 font-bold ${isLiked ? 'text-red-500' : 'text-gray-700'}`}
          >
            {likeCount}
          </Text>
        </TouchableOpacity>

        {/* Yorum */}
        <TouchableOpacity
          className="flex-row items-center"
          onPress={onCommentPress}
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
      <TouchableOpacity
        onPress={() => Alert.alert('Paylaş', 'Paylaşım özelliği yakında!')}
      >
        <Ionicons name="share-social-outline" size={24} color="#374151" />
      </TouchableOpacity>
    </View>
  );
}
