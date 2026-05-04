import { TripComment } from '@/src/types/comment';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { CommentItem } from './CommentItem';
import { useThemeColors } from '@/src/hooks/theme/useThemeColors';
type Props = {
  isVisible: boolean;
  onClose: () => void;
  tripId: string;
  comments: TripComment[];
  onSendComment: (
    content: string,
    // currentUser: UserProfile | null,
    parentId?: string,
  ) => Promise<any>;
  onLoadMore: () => void;
};
export function CommentSection({
  isVisible,
  onClose,
  tripId,
  comments,
  onSendComment,
  onLoadMore,
}: Props) {
  const theme = useThemeColors();
  const [commentText, setCommentText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [replyTo, setReplyTo] = useState<TripComment | null>(null);

  const handlePost = async () => {
    if (!commentText.trim()) return;

    setIsSending(true);
    try {
      await onSendComment(commentText, replyTo?.id);
      setCommentText(''); // Başarılıysa inputu temizle
      setReplyTo(null); // Yanıtı sıfırla
    } catch (error: any) {
      Alert.alert('Hata', error.message);
    } finally {
      setIsSending(false);
    }
  };
  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-white">
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-100">
          <Text className="text-lg font-bold">Yorumlar</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="black" />
          </TouchableOpacity>
        </View>

        {/* Liste */}
        <FlatList
          data={comments}
          renderItem={({ item }) => (
            <CommentItem comment={item} onReplyPress={(c) => setReplyTo(c)} />
          )}
          keyExtractor={(item, index) =>
            item?.id?.toString() || index.toString()
          }
          onEndReached={onLoadMore} // Buraya ekledik
          onEndReachedThreshold={0.5}
        />
        {replyTo && (
          <View className="flex-row justify-between items-center px-4 py-2 bg-gray-50 border-t border-gray-200">
            <Text className="text-xs text-gray-500">
              <Text className="font-bold">@{replyTo.username}</Text>{' '}
              kullanıcısına yanıt veriliyor
            </Text>
            <TouchableOpacity onPress={() => setReplyTo(null)}>
              <Ionicons name="close-circle" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        )}
        {/* Giriş Alanı */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
          <View className="flex-row items-center px-4 py-3 border-t border-gray-100 bg-white mb-6">
            <TextInput
              className="flex-1 bg-gray-100 rounded-2xl px-4 py-2.5 text-sm"
              placeholder="Yorum ekle..."
              value={commentText}
              onChangeText={setCommentText}
              multiline
            />
            <TouchableOpacity
              disabled={!commentText.trim() || isSending}
              onPress={handlePost} // handlePost'u tetikle
              className="ml-3"
            >
              <Text
                className={`font-bold ${commentText.trim() && !isSending ? 'text-teal-500' : 'text-gray-300'}`}
              >
                {isSending ? '...' : 'Paylaş'}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
