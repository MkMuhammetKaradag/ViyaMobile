import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  viewCount?: number;
  likeCount?: number;
  commentCount?: number;
  isLiked?: boolean;
  isMyTrip?: boolean; // Kendi gezimiz mi kontrolü
  isForking?: boolean; // Fork işlemi sırasında loading göstermek için
  onLikePress?: () => void;
  onCommentPress?: () => void;
  onForkPress?: () => void; // Fork tetikleyicisi
};

export function TripInteractionBar({
  viewCount = 0,
  likeCount = 0,
  commentCount = 0,
  isLiked = false,
  isMyTrip = false,
  isForking = false,
  onLikePress,
  onCommentPress,
  onForkPress,
}: Props) {
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
            color={isLiked ? '#EF4444' : '#374151'}
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

      {/* Sağ Taraf: Aksiyonlar (Fork & Paylaş) */}
      <View className="flex-row items-center space-x-4">
        {/* 🚀 FORK BUTONU: Sadece kendi gezimiz değilse gösterilir */}
        {!isMyTrip && (
          <TouchableOpacity
            onPress={onForkPress}
            disabled={isForking}
            className="p-1"
          >
            {isForking ? (
              <ActivityIndicator size="small" color="#374151" />
            ) : (
              // Git-Fork mantığına en yakın ikon 'git-network-outline' veya 'git-branch-outline'dır
              <Ionicons name="git-branch-outline" size={24} color="#374151" />
            )}
          </TouchableOpacity>
        )}

        {/* Paylaş */}
        {/* <TouchableOpacity
          onPress={() => Alert.alert('Paylaş', 'Paylaşım özelliği yakında!')}
          className="p-1"
        >
          <Ionicons name="share-social-outline" size={24} color="#374151" />
        </TouchableOpacity> */}
      </View>
    </View>
  );
}
