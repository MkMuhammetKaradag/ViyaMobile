import { useThemeColors } from '@/src/hooks/theme/useThemeColors';
import { useUpdateTrip } from '@/src/hooks/useUpdateTrip';
import { uploadToCloudinary } from '@/src/utils/cloudinary'; // 🚀 Senin projendeki upload fonksiyonunun yolu
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker'; // 🚀 ImagePicker eklendi
import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type Props = {
  isVisible: boolean;
  onClose: () => void;
  trip: any;
  onSuccess: () => void;
};

export function EditTripModal({ isVisible, onClose, trip, onSuccess }: Props) {
  const theme = useThemeColors();
  const {
    loading,
    title,
    setTitle,
    desc,
    setDesc,
    isPublic,
    setIsPublic,
    coverImageUrl,
    setCoverImageUrl,
    isCoverUploading,
    setIsCoverUploading,
    handleUpdateTrip,
  } = useUpdateTrip(trip, () => {
    onSuccess();
    onClose();
  });

  // 🚀 Rota oluştururken kullandığın canavar fonksiyon aynen burada usta!
  const pickCoverImage = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 5],
      quality: 0.8,
    });

    if (!result.canceled) {
      setIsCoverUploading(true);
      try {
        const url = await uploadToCloudinary(result.assets[0].uri);
        setCoverImageUrl(url);
      } catch (err) {
        console.error(err);
        Alert.alert('Hata', 'Kapak resmi yüklenemedi.');
      } finally {
        setIsCoverUploading(false);
      }
    }
  }, [setIsCoverUploading, setCoverImageUrl]);

  return (
    <Modal visible={isVisible} animationType="slide" transparent>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'flex-end',
        }}
      >
        <View
          style={{
            backgroundColor: theme.surface,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            maxHeight: '85%',
            padding: 24,
          }}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 20,
            }}
          >
            <Text
              style={{ fontSize: 20, fontWeight: '900', color: theme.text }}
            >
              Geziyi Düzenle
            </Text>
            <TouchableOpacity
              onPress={onClose}
              disabled={loading || isCoverUploading}
            >
              <Ionicons name="close" size={24} color={theme.text} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* 🚀 KAPAK FOTOĞRAFI SEÇİM / GÖSTERİM ALANI */}
            <Text
              style={{ color: theme.text, fontWeight: '700', marginBottom: 8 }}
            >
              Kapak Fotoğrafı
            </Text>
            <TouchableOpacity
              onPress={pickCoverImage}
              disabled={isCoverUploading}
              style={{
                height: 160,
                backgroundColor: theme.background,
                borderRadius: 20,
                overflow: 'hidden',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 20,
                borderWidth: 1,
                borderColor: theme.border,
                position: 'relative',
              }}
            >
              {coverImageUrl ? (
                <>
                  <Image
                    source={{ uri: coverImageUrl }}
                    style={{ width: '100%', height: '100%' }}
                  />
                  <View
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundColor: 'rgba(0,0,0,0.3)',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Ionicons name="camera" size={28} color="white" />
                    <Text
                      style={{
                        color: 'white',
                        fontWeight: '700',
                        marginTop: 4,
                        fontSize: 12,
                      }}
                    >
                      Kapak Fotoğrafını Değiştir
                    </Text>
                  </View>
                </>
              ) : (
                <View style={{ alignItems: 'center' }}>
                  <Ionicons
                    name="image-outline"
                    size={36}
                    color={theme.subtext}
                  />
                  <Text
                    style={{
                      color: theme.subtext,
                      fontWeight: '600',
                      marginTop: 8,
                    }}
                  >
                    Bir Fotoğraf Seç
                  </Text>
                </View>
              )}

              {/* Fotoğraf Yüklenirken Spinner Gösterimi */}
              {isCoverUploading && (
                <View
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <ActivityIndicator color={theme.primary} size="large" />
                  <Text
                    style={{
                      color: 'white',
                      fontWeight: '700',
                      marginTop: 8,
                      fontSize: 13,
                    }}
                  >
                    Cloudinary'ye Yükleniyor...
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Gezi Başlığı */}
            <Text
              style={{ color: theme.text, fontWeight: '700', marginBottom: 8 }}
            >
              Gezi Başlığı
            </Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Örn: Ege Kıyıları Macerası"
              placeholderTextColor={theme.subtext}
              style={{
                backgroundColor: theme.background,
                color: theme.text,
                padding: 16,
                borderRadius: 16,
                marginBottom: 16,
                borderWidth: 1,
                borderColor: theme.border,
              }}
            />

            {/* Gezi Açıklaması */}
            <Text
              style={{ color: theme.text, fontWeight: '700', marginBottom: 8 }}
            >
              Rota Açıklaması
            </Text>
            <TextInput
              value={desc}
              onChangeText={setDesc}
              placeholder="Bu rotanın hikayesi nedir?"
              placeholderTextColor={theme.subtext}
              multiline
              numberOfLines={4}
              style={{
                backgroundColor: theme.background,
                color: theme.text,
                padding: 16,
                borderRadius: 16,
                marginBottom: 20,
                textAlignVertical: 'top',
                borderWidth: 1,
                borderColor: theme.border,
                minHeight: 100,
              }}
            />

            {/* Gizlilik Ayarı */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: theme.background,
                padding: 16,
                borderRadius: 16,
                marginBottom: 24,
                borderWidth: 1,
                borderColor: theme.border,
              }}
            >
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text
                  style={{ color: theme.text, fontWeight: '700', fontSize: 15 }}
                >
                  Herkes Görebilsin
                </Text>
                <Text
                  style={{ color: theme.subtext, fontSize: 12, marginTop: 2 }}
                >
                  Kapatırsanız bu rotayı sadece siz profilinizde görebilirsiniz.
                </Text>
              </View>
              <Switch
                value={isPublic}
                onValueChange={setIsPublic}
                trackColor={{ false: '#767577', true: theme.primary }}
                thumbColor={isPublic ? '#fff' : '#f4f3f4'}
              />
            </View>
          </ScrollView>

          {/* Güncelle Butonu */}
          <TouchableOpacity
            onPress={handleUpdateTrip}
            disabled={loading || isCoverUploading}
            style={{
              backgroundColor: isCoverUploading ? theme.border : theme.primary,
              padding: 16,
              borderRadius: 16,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 10,
            }}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={{ color: 'white', fontWeight: '800', fontSize: 16 }}>
                Değişiklikleri Kaydet
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
