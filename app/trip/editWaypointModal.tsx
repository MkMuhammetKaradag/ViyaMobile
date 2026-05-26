import { useThemeColors } from '@/src/hooks/theme/useThemeColors';
import { useUpdateWaypoint } from '@/src/hooks/useUpdateWaypoint';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface Waypoint {
  id: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  photos?: { id: string; url: string }[];
}

type Props = {
  isVisible: boolean;
  onClose: () => void;
  waypoint: Waypoint | null;
  onSuccess: () => void; 
};

export function EditWaypointModal({
  isVisible,
  onClose,
  waypoint,
  onSuccess,
}: Props) {
  const theme = useThemeColors();

  
  const {
    loading,
    title,
    setTitle,
    desc,
    setDesc,
    images,
    pickImage,
    removeImage,
    handleUpdate,
  } = useUpdateWaypoint(waypoint, () => {
    onSuccess(); // Ana sayfayı yenile
    onClose(); // Modalı kapat
  });

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
              Durağı Düzenle
            </Text>
    
            <TouchableOpacity onPress={onClose} disabled={loading}>
              <Ionicons name="close" size={24} color={theme.text} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Başlık Input */}
            <Text
              style={{ color: theme.text, fontWeight: '700', marginBottom: 8 }}
            >
              Durak Adı
            </Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Örn: Efes Antik Kenti"
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

            {/* Açıklama Input */}
            <Text
              style={{ color: theme.text, fontWeight: '700', marginBottom: 8 }}
            >
              Açıklama / Notlar
            </Text>
            <TextInput
              
              value={desc}
              onChangeText={setDesc}
              placeholder="Bu durakta neler yaptın, neler keşfettin?"
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

  
            <Text
              style={{ color: theme.text, fontWeight: '700', marginBottom: 8 }}
            >
              Yeni Fotoğraflar Ekle
            </Text>
            <TouchableOpacity
        
              onPress={pickImage}
              style={{
                borderWidth: 2,
                borderStyle: 'dashed',
                borderColor: theme.primary,
                borderRadius: 16,
                padding: 20,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
              }}
            >
              <Ionicons name="camera-outline" size={32} color={theme.primary} />
              <Text
                style={{
                  color: theme.primary,
                  fontWeight: '700',
                  marginTop: 8,
                }}
              >
                Galeriden Fotoğraf Seç
              </Text>
            </TouchableOpacity>

         
            {images.length > 0 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginBottom: 20 }}
              >
                {images.map((img, index) => (
                  <View
                    key={index}
                    style={{ marginRight: 12, position: 'relative' }}
                  >
                    <Image
                      
                      source={{ uri: img.uri }}
                      style={{ width: 80, height: 80, borderRadius: 12 }}
                    />
                    <TouchableOpacity
                      
                      onPress={() => removeImage(index)}
                      style={{
                        position: 'absolute',
                        top: -4,
                        right: -4,
                        backgroundColor: 'red',
                        borderRadius: 10,
                        width: 20,
                        height: 20,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Ionicons name="close" size={14} color="white" />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            )}
          </ScrollView>

       
          <TouchableOpacity
           
            onPress={handleUpdate}
            disabled={loading}
            style={{
              backgroundColor: theme.primary,
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
