import { TagDraft } from '@/src/hooks/useCreateTrip';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

type Props = {
  visible: boolean;
  photoUrl: string | null;
  tags: TagDraft[];
  onClose: () => void;
  onAddTag: (tag: TagDraft) => void;
  onUpdateTag: (index: number, label: string) => void;
  onDeleteTag: (index: number) => void;
};

export function PhotoTagModal({
  visible,
  photoUrl,
  tags,
  onClose,
  onAddTag,
  onUpdateTag,
  onDeleteTag,
}: Props) {
  const [imageLayout, setImageLayout] = useState({ width: 0, height: 0 });
  const [inputVisible, setInputVisible] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [tagName, setTagName] = useState('');
  const [tempCoords, setTempCoords] = useState({ x: 0, y: 0 });

  const handlePhotoPress = (event: any) => {
    const { locationX, locationY } = event.nativeEvent;
    const xPercent = (locationX / imageLayout.width) * 100;
    const yPercent = (locationY / imageLayout.height) * 100;

    setEditingIndex(null);
    setTempCoords({ x: xPercent, y: yPercent });
    setTagName('');
    setInputVisible(true);
  };

  const handleEditTag = (index: number, label: string) => {
    setEditingIndex(index);
    setTagName(label);
    setInputVisible(true);
  };

  const handleSaveTag = () => {
    if (!tagName) return;

    if (editingIndex !== null) {
      onUpdateTag(editingIndex, tagName);
    } else {
      onAddTag({ label: tagName, x_pos: tempCoords.x, y_pos: tempCoords.y });
    }

    setInputVisible(false);
    setEditingIndex(null);
  };

  const handleDeleteTag = () => {
    if (editingIndex === null) return;
    Alert.alert('Emin misin?', 'Bu etiketi silmek istiyor musun?', [
      { text: 'Hayır' },
      {
        text: 'Evet, Sil',
        style: 'destructive',
        onPress: () => {
          onDeleteTag(editingIndex);
          setInputVisible(false);
          setEditingIndex(null);
        },
      },
    ]);
  };

  return (
    <>
      {/* Fotoğraf + etiket ekleme modalı */}
      <Modal visible={visible} animationType="fade">
        <View className="flex-1 bg-black items-center justify-center">
          {photoUrl ? (
            <View
              style={{ width: screenWidth, height: screenWidth * 1.25 }}
              className="relative bg-gray-900"
            >
              <TouchableOpacity
                activeOpacity={1}
                onPress={handlePhotoPress}
                onLayout={(e) => {
                  const { width, height } = e.nativeEvent.layout;
                  setImageLayout({ width, height });
                }}
                style={{ width: '100%', height: '100%' }}
              >
                <Image
                  source={{ uri: photoUrl }}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="cover"
                  pointerEvents="none"
                />

                {tags.map((tag, i) => {
                  const isRightSide = tag.x_pos > 50;
                  return (
                    <TouchableOpacity
                      key={i}
                      onPress={() => handleEditTag(i, tag.label)}
                      style={{
                        position: 'absolute',
                        left: `${tag.x_pos}%`,
                        top: `${tag.y_pos}%`,
                        transform: [{ translateX: isRightSide ? -80 : -10 }],
                        zIndex: 100,
                      }}
                      className="bg-[#4ECDC4] px-3 py-1.5 rounded-full border border-white shadow-lg flex-row items-center"
                    >
                      <Text
                        numberOfLines={1}
                        className="text-white text-[10px] font-black italic"
                      >
                        {tag.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </TouchableOpacity>
            </View>
          ) : (
            <ActivityIndicator color="white" size="large" />
          )}

          <TouchableOpacity
            onPress={onClose}
            className="mt-10 bg-white/10 px-10 py-4 rounded-3xl border border-white/20"
          >
            <Text className="text-white font-bold">KAPAT</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Etiket ismi giriş modalı */}
      <Modal visible={inputVisible} transparent animationType="fade">
        <View className="flex-1 bg-black/80 justify-center px-10">
          <View className="bg-white p-6 rounded-[32px]">
            <Text className="text-lg font-black mb-4 text-gray-800 text-center">
              Etiketi Yönet
            </Text>

            <TextInput
              placeholder="Örn: Buranın kahvesi meşhur"
              value={tagName}
              onChangeText={setTagName}
              autoFocus
              className="bg-gray-100 p-4 rounded-2xl mb-4 font-bold"
            />

            <View className="flex-row gap-x-2">
              <TouchableOpacity
                onPress={() => setInputVisible(false)}
                className="flex-1 p-4 rounded-2xl bg-gray-100 items-center"
              >
                <Text className="font-bold text-gray-400">Vazgeç</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSaveTag}
                className="flex-2 p-4 rounded-2xl bg-[#4ECDC4] items-center px-6"
              >
                <Text className="text-white font-bold">KAYDET</Text>
              </TouchableOpacity>
            </View>

            {editingIndex !== null && (
              <TouchableOpacity
                onPress={handleDeleteTag}
                className="mt-4 p-3 items-center"
              >
                <Text className="text-red-500 font-bold">Etiketi Kaldır</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}
