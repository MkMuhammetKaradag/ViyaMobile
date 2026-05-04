import { MapPickerModal } from '@/components/trip/MapPickerModal';
import { PhotoTagModal } from '@/components/trip/PhotoTagModal';
import { useThemeColors } from '@/src/hooks/theme/useThemeColors';
import { useAddWaypoint } from '@/src/hooks/useAddWaypoint';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const DEFAULT_REGION = {
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export default function AddWaypointScreen() {
  const router = useRouter();
  const wp = useAddWaypoint();

  const [mapVisible, setMapVisible] = useState(false);
  const [taggingPhotoIdx, setTaggingPhotoIdx] = useState<number | null>(null);

  const currentPhoto =
    taggingPhotoIdx !== null ? wp.images[taggingPhotoIdx] : null;

  const theme = useThemeColors();

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView
        style={{ flex: 1, paddingHorizontal: 24, paddingTop: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 32,
          }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              marginRight: 16,
              backgroundColor: theme.surface,
              padding: 10,
              borderRadius: 999,
            }}
          >
            <Ionicons name="close" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={{ color: theme.text, fontSize: 28, fontWeight: '900' }}>
            Durak Ekle
          </Text>
        </View>

        <TextInput
          placeholder="Durak ismi..."
          placeholderTextColor={theme.placeholder}
          value={wp.title}
          onChangeText={wp.setTitle}
          style={{
            backgroundColor: theme.surface,
            padding: 20,
            borderRadius: 32,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: theme.border,
            fontSize: 18,
            color: theme.text,
            fontWeight: '700',
          }}
        />

        <TouchableOpacity
          onPress={() => setMapVisible(true)}
          style={{
            backgroundColor: theme.surface,
            padding: 20,
            borderRadius: 32,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: theme.border,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              backgroundColor: theme.primary,
              padding: 14,
              borderRadius: 20,
              marginRight: 16,
              elevation: 2,
            }}
          >
            <Ionicons name="map" size={20} color={theme.accentText} />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: theme.primary,
                fontWeight: '800',
                fontSize: 10,
                textTransform: 'uppercase',
              }}
            >
              Konum Seç
            </Text>
            <Text
              style={{ color: theme.text, fontWeight: '800', fontSize: 14 }}
            >
              {wp.location.latitude.toFixed(4)},{' '}
              {wp.location.longitude.toFixed(4)}
            </Text>
          </View>
        </TouchableOpacity>

        <TextInput
          placeholder="Açıklama..."
          placeholderTextColor={theme.placeholder}
          value={wp.desc}
          onChangeText={wp.setDesc}
          multiline
          style={{
            backgroundColor: theme.surface,
            padding: 20,
            borderRadius: 32,
            marginBottom: 24,
            minHeight: 120,
            color: theme.text,
            borderWidth: 1,
            borderColor: theme.border,
            textAlignVertical: 'top',
          }}
        />

        <View
          style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 32 }}
        >
          {wp.images.map((img, i) => (
            <View
              key={i}
              style={{
                marginRight: 12,
                marginBottom: 12,
                position: 'relative',
              }}
            >
              <TouchableOpacity onPress={() => setTaggingPhotoIdx(i)}>
                <Image
                  source={{ uri: img.uri }}
                  style={{ width: 96, height: 96, borderRadius: 24 }}
                  contentFit="cover"
                />
                {img.tags.length > 0 && (
                  <View
                    style={{
                      position: 'absolute',
                      top: -4,
                      right: -4,
                      backgroundColor: theme.primary,
                      borderRadius: 999,
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                      borderWidth: 2,
                      borderColor: theme.background,
                    }}
                  >
                    <Text
                      style={{
                        color: theme.accentText,
                        fontSize: 10,
                        fontWeight: '900',
                      }}
                    >
                      {img.tags.length}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => wp.removeImage(i)}
                style={{
                  position: 'absolute',
                  top: -8,
                  left: -8,
                  backgroundColor: theme.surface,
                  borderRadius: 999,
                }}
              >
                <Ionicons name="close-circle" size={22} color={theme.danger} />
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity
            onPress={wp.pickImage}
            style={{
              width: 96,
              height: 96,
              backgroundColor: theme.surface,
              borderRadius: 24,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderStyle: 'dashed',
              borderColor: theme.border,
            }}
          >
            <Ionicons name="camera" size={30} color={theme.subtext} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={wp.handleSave}
          disabled={wp.loading}
          style={{
            backgroundColor: theme.primary,
            paddingVertical: 24,
            borderRadius: 32,
            alignItems: 'center',
            marginBottom: 40,
            shadowColor: theme.primary,
            shadowOpacity: 0.2,
            shadowRadius: 14,
            elevation: 8,
          }}
        >
          {wp.loading ? (
            <ActivityIndicator color={theme.accentText} />
          ) : (
            <Text
              style={{
                color: theme.accentText,
                fontWeight: '900',
                fontSize: 18,
              }}
            >
              YOLCULUĞA EKLE
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Harita modalı — CreateTripScreen'den aynı komponent */}
      <MapPickerModal
        visible={mapVisible}
        initialRegion={{ ...wp.location, ...DEFAULT_REGION }}
        onClose={() => setMapVisible(false)}
        onConfirm={(lat, lon) => {
          wp.setLocation({ latitude: lat, longitude: lon });
          setMapVisible(false);
        }}
      />

      {/* Fotoğraf etiketleme modalı — CreateTripScreen'den aynı komponent */}
      {taggingPhotoIdx !== null && currentPhoto && (
        <PhotoTagModal
          visible
          photoUrl={currentPhoto.uri}
          tags={currentPhoto.tags}
          onClose={() => setTaggingPhotoIdx(null)}
          onAddTag={(tag) => wp.addTag(taggingPhotoIdx, tag)}
          onUpdateTag={(tagIdx, label) =>
            wp.updateTag(taggingPhotoIdx, tagIdx, label)
          }
          onDeleteTag={(tagIdx) => wp.deleteTag(taggingPhotoIdx, tagIdx)}
        />
      )}
    </View>
  );
}
