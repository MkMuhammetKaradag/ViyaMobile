import { TripComment } from '@/src/types/comment';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  comment: TripComment;
  onReplyPress: (comment: TripComment) => void;
};

export function CommentItem({ comment, onReplyPress }: Props) {
  return (
    <View className="flex-row px-4 py-3 border-b border-gray-50">
      {/* Profil Resmi */}

      {comment?.avatar_url ? (
        <Image
          source={{ uri: comment.avatar_url }}
          className="w-10 h-10 rounded-full bg-gray-200"
        />
      ) : (
        <View className="w-10 h-10 rounded-full items-center justify-center flex bg-gray-200">
          <Ionicons name="person" size={25} color="green" />
        </View>
      )}

      <View className="flex-1 ml-3">
        {/* Kullanıcı Adı ve Tarih */}
        <View className="flex-row items-center justify-between">
          <Text className="font-bold text-sm text-gray-900">
            @{comment.username}
          </Text>
          <Text className="text-gray-400 text-xs">
            {/* Şimdilik basit tarih, ilerde formatlarsın */}
            {new Date(comment.created_at).toLocaleDateString('tr-TR')}
          </Text>
        </View>

        {/* Yorum İçeriği */}
        <Text className="text-gray-800 mt-1 text-sm leading-5">
          {comment.content}
        </Text>

        {/* Alt Etkileşim Butonları */}
        <View className="flex-row items-center mt-2 space-x-6">
          <TouchableOpacity onPress={() => onReplyPress(comment)}>
            <Text className="text-gray-500 text-xs font-bold">Yanıtla</Text>
          </TouchableOpacity>

          {comment.reply_count > 0 && (
            <TouchableOpacity className="flex-row items-center">
              <View className="w-8 h-[1px] bg-gray-300 mr-2" />
              <Text className="text-gray-500 text-xs font-semibold">
                {comment.reply_count} yanıtı gör
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}
