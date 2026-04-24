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
  const [commentText, setCommentText] = useState('');
  const [isSending, setIsSending] = useState(false); // Gönderiliyor durumu için
  //   const currentUser = useUserStore.getState().user;
  const handlePost = async () => {
    if (!commentText.trim()) return;

    setIsSending(true);
    try {
      await onSendComment(commentText);
      setCommentText(''); // Başarılıysa inputu temizle
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
            <CommentItem comment={item} onReplyPress={(c) => console.log(c)} />
          )}
          keyExtractor={(item, index) =>
            item?.id?.toString() || index.toString()
          }
          onEndReached={onLoadMore} // Buraya ekledik
          onEndReachedThreshold={0.5}
        />

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
