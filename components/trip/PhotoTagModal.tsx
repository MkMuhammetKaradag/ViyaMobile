import { useThemeColors } from '@/src/hooks/theme/useThemeColors';
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
  const theme = useThemeColors();
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
        <View
          style={{
            flex: 1,
            backgroundColor: theme.background,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {photoUrl ? (
            <View
              style={{
                width: screenWidth,
                height: screenWidth * 1.25,
                position: 'relative',
                backgroundColor: theme.surface,
              }}
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
                        backgroundColor: theme.primary,
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 999,
                        borderWidth: 1,
                        borderColor: theme.background,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}
                    >
                      <Text
                        numberOfLines={1}
                        style={{
                          color: theme.accentText,
                          fontSize: 10,
                          fontWeight: '900',
                          fontStyle: 'italic',
                        }}
                      >
                        {tag.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </TouchableOpacity>
            </View>
          ) : (
            <ActivityIndicator color={theme.text} size="large" />
          )}

          <TouchableOpacity
            onPress={onClose}
            style={{
              marginTop: 40,
              backgroundColor: theme.surface,
              paddingHorizontal: 32,
              paddingVertical: 14,
              borderRadius: 28,
              borderWidth: 1,
              borderColor: theme.border,
            }}
          >
            <Text style={{ color: theme.text, fontWeight: '900' }}>KAPAT</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal visible={inputVisible} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.75)',
            justifyContent: 'center',
            paddingHorizontal: 24,
          }}
        >
          <View
            style={{
              backgroundColor: theme.surface,
              padding: 24,
              borderRadius: 32,
              shadowColor: theme.text,
              shadowOpacity: 0.1,
              shadowRadius: 18,
              elevation: 5,
            }}
          >
            <Text
              style={{
                color: theme.text,
                fontSize: 18,
                fontWeight: '900',
                marginBottom: 16,
                textAlign: 'center',
              }}
            >
              Etiketi Yönet
            </Text>

            <TextInput
              placeholder="Örn: Buranın kahvesi meşhur"
              placeholderTextColor={theme.placeholder}
              value={tagName}
              onChangeText={setTagName}
              autoFocus
              style={{
                backgroundColor: theme.background,
                padding: 16,
                borderRadius: 24,
                marginBottom: 16,
                color: theme.text,
                fontWeight: '700',
              }}
            />

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity
                onPress={() => setInputVisible(false)}
                style={{
                  flex: 1,
                  padding: 16,
                  borderRadius: 24,
                  backgroundColor: theme.background,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: theme.subtext, fontWeight: '900' }}>
                  Vazgeç
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSaveTag}
                style={{
                  flex: 1,
                  padding: 16,
                  borderRadius: 24,
                  backgroundColor: theme.primary,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: theme.accentText, fontWeight: '900' }}>
                  KAYDET
                </Text>
              </TouchableOpacity>
            </View>

            {editingIndex !== null && (
              <TouchableOpacity
                onPress={handleDeleteTag}
                style={{ marginTop: 20, padding: 12, alignItems: 'center' }}
              >
                <Text style={{ color: theme.danger, fontWeight: '900' }}>
                  Etiketi Kaldır
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}
