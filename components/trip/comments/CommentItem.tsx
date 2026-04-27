import { apiClient } from '@/src/api/client';
import { TripComment } from '@/src/types/comment';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  DeviceEventEmitter,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type Props = {
  comment: TripComment;
  onReplyPress: (comment: TripComment) => void;
  depth?: number;
};

export function CommentItem({ comment, onReplyPress, depth = 1 }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [replies, setReplies] = useState<TripComment[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  useEffect(() => {
    // Bu yorumun ID'sine özel bir dinleyici oluştur
    const subscription = DeviceEventEmitter.addListener(
      `NEW_REPLY_${comment.id}`,
      (newReply) => {
        setReplies((prev) => [newReply, ...prev]);
        setIsExpanded(true);
      },
    );

    return () => subscription.remove(); // Bileşen ekrandan gidince dinlemeyi bırak
  }, [comment.id]);
  const fetchReplies = async (nextPage = 1) => {
    if (loading || (!hasMore && nextPage !== 1)) return;

    setLoading(true);
    try {
      // 🚀 SENİN ENDPOINT: /api/v1/comments/replies/:comment_id
      const response = await apiClient.get(
        `/api/v1/comments/replies/${comment.id}?limit=10&page=${nextPage}`,
      );

      const newReplies = response.data.comments || [];

      if (nextPage === 1) {
        setReplies(newReplies);
      } else {
        setReplies((prev) => [...prev, ...newReplies]);
      }

      setHasMore(newReplies.length === 10);
      setPage(nextPage);
      setIsExpanded(true);
    } catch (error) {
      console.error('Yanıtlar yüklenirken hata oluştu:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    if (isExpanded) {
      setIsExpanded(false);
    } else {
      // Eğer hiç çekilmediyse ilk sayfayı çek
      if (replies.length === 0) {
        fetchReplies(1);
      } else {
        setIsExpanded(true);
      }
    }
  };
  const shouldIndent = depth > 1 && depth < 4;
  const isTooDeep = depth >= 4;
  console.log('CommentItem render:', comment.id, 'Depth:', depth);
  return (
    <View
      className={`border-b border-gray-50 ${depth > 1 ? 'bg-gray-50/30' : 'bg-white'}`}
    >
      <View className={`flex-row px-4 py-3 ${shouldIndent ? 'ml-8' : 'ml-0'}`}>
        {/* Profil Resmi Bölümü */}
        {comment?.avatar_url ? (
          <Image
            source={{ uri: comment.avatar_url }}
            className="w-9 h-9 rounded-full bg-gray-200"
          />
        ) : (
          <View className="w-9 h-9 rounded-full items-center justify-center bg-teal-50">
            <Ionicons name="person" size={18} color="#4ECDC4" />
          </View>
        )}

        <View className="flex-1 ml-3">
          <View className="flex-row items-center justify-between">
            <Text className="font-bold text-[13px] text-gray-900">
              @{comment.username}
            </Text>
            <Text className="text-gray-400 text-[10px]">
              {new Date(comment.created_at).toLocaleDateString('tr-TR')}
            </Text>
          </View>

          <Text className="text-gray-800 mt-0.5 text-sm leading-5">
            {comment.content}
          </Text>

          {/* Alt Etkileşimler */}
          <View className="flex-row items-center mt-2">
            <TouchableOpacity
              onPress={() => onReplyPress(comment)}
              className="mr-6"
            >
              <Text className="text-gray-500 text-[11px] font-bold">
                Yanıtla
              </Text>
            </TouchableOpacity>

            {comment.reply_count > 0 && (
              <TouchableOpacity
                onPress={handleToggle}
                className="flex-row items-center"
              >
                <View className="w-6 h-[1px] bg-gray-300 mr-2" />
                <Text className="text-gray-500 text-[11px] font-semibold">
                  {isExpanded
                    ? 'Yanıtları gizle'
                    : `${comment.reply_count} yanıtı gör`}
                </Text>
                {loading && (
                  <ActivityIndicator
                    size="small"
                    color="#4ECDC4"
                    className="ml-2"
                  />
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* 🚀 Yanıtlar Listesi */}
      {isExpanded && (
        <View
          className={`${depth < 4 ? 'ml-10 border-l border-gray-100' : 'ml-0'}`}
        >
          {replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onReplyPress={onReplyPress}
              depth={depth + 1}
            />
          ))}

          {/* Daha fazla yanıt yükleme butonu */}
          {hasMore && replies.length > 0 && !loading && (
            <TouchableOpacity
              onPress={() => fetchReplies(page + 1)}
              className="py-2 px-4"
            >
              <Text className="text-teal-600 text-[11px] font-bold">
                Devamını gör...
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}
