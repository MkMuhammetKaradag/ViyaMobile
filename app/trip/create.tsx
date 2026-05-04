import { MapPickerModal } from '@/components/trip/MapPickerModal';
import { MultiCategoryPicker } from '@/components/trip/MultiCategoryPicker';
import { PhotoTagModal } from '@/components/trip/PhotoTagModal';
import { TripFormHeader } from '@/components/trip/TripFormHeader';
import { TripSettingsCard } from '@/components/trip/TripSettingsCard';
import { WaypointCard } from '@/components/trip/WaypointCard';
import { useThemeColors } from '@/src/hooks/theme/useThemeColors';
import { useCreateTrip } from '@/src/hooks/useCreateTrip';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DEFAULT_REGION = {
  latitude: 39.9334,
  longitude: 32.8597,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export default function CreateTripScreen() {
  const router = useRouter();
  const trip = useCreateTrip();

  // Harita modal state'i (hangi waypoint için açık)
  const [mapWpIndex, setMapWpIndex] = useState<number | null>(null);

  // Fotoğraf etiket modal state'i
  const [taggingPhoto, setTaggingPhoto] = useState<{
    wpIdx: number;
    photoIdx: number;
  } | null>(null);

  const openMap = (index: number) => {
    setMapWpIndex(index);
  };

  const handleMapConfirm = (latitude: number, longitude: number) => {
    if (mapWpIndex !== null) {
      trip.updateWaypointLocation(mapWpIndex, latitude, longitude);
    }
    setMapWpIndex(null);
  };

  const getMapInitialRegion = () => {
    if (mapWpIndex === null) return DEFAULT_REGION;
    const wp = trip.waypoints[mapWpIndex];
    if (wp?.latitude !== 0) {
      return {
        ...DEFAULT_REGION,
        latitude: wp.latitude,
        longitude: wp.longitude,
      };
    }
    return DEFAULT_REGION;
  };

  const currentTagPhoto = taggingPhoto
    ? (trip.waypoints[taggingPhoto.wpIdx]?.photos[taggingPhoto.photoIdx] ??
      null)
    : null;

  const theme = useThemeColors();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, backgroundColor: theme.background }}
      >
        <ScrollView
          style={{
            flex: 1,
            backgroundColor: theme.background,
            paddingHorizontal: 24,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View
            style={{
              marginTop: 56,
              marginBottom: 32,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text
              style={{ color: theme.text, fontSize: 30, fontWeight: '900' }}
            >
              Yeni Rota
            </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="close" size={30} color={theme.text} />
            </TouchableOpacity>
          </View>

          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                color: theme.subtext,
                fontSize: 10,
                fontWeight: '700',
                textTransform: 'uppercase',
                marginBottom: 8,
                marginLeft: 4,
              }}
            >
              Rota Kapak Fotoğrafı
            </Text>

            {trip.coverImageUrl ? (
              <View style={{ position: 'relative' }}>
                <Image
                  source={{ uri: trip.coverImageUrl }}
                  style={{
                    width: '100%',
                    height: 192,
                    borderRadius: 32,
                    borderWidth: 1,
                    borderColor: theme.border,
                  }}
                  resizeMode="cover"
                />
                <TouchableOpacity
                  onPress={trip.removeCoverImage}
                  style={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    backgroundColor: theme.danger,
                    padding: 12,
                    borderRadius: 999,
                    elevation: 4,
                  }}
                >
                  <Ionicons name="trash" size={18} color={theme.accentText} />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={trip.pickCoverImage}
                disabled={trip.isCoverUploading}
                style={{
                  width: '100%',
                  height: 192,
                  backgroundColor: theme.surface,
                  borderRadius: 32,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 1,
                  borderStyle: 'dashed',
                  borderColor: theme.border,
                }}
              >
                {trip.isCoverUploading ? (
                  <ActivityIndicator color={theme.primary} />
                ) : (
                  <View style={{ alignItems: 'center' }}>
                    <View
                      style={{
                        backgroundColor: theme.surfaceAlt,
                        padding: 16,
                        borderRadius: 999,
                        marginBottom: 12,
                        shadowColor: theme.text,
                        shadowOpacity: 0.08,
                        shadowRadius: 8,
                        elevation: 2,
                      }}
                    >
                      <Ionicons name="image" size={32} color={theme.primary} />
                    </View>
                    <Text style={{ color: theme.text, fontWeight: '700' }}>
                      Kapak Fotoğrafı Ekle
                    </Text>
                    <Text
                      style={{
                        color: theme.subtext,
                        fontSize: 12,
                        marginTop: 4,
                      }}
                    >
                      Gezginlerin ilgisini çek!
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            )}
          </View>

          <TripFormHeader
            title={trip.title}
            desc={trip.desc}
            onTitleChange={trip.setTitle}
            onDescChange={trip.setDesc}
          />
          <MultiCategoryPicker
            label="Rota Kategorileri"
            selectedCategories={trip.categories}
            onAdd={trip.addCategory}
            onRemove={trip.removeCategory}
          />
          <TripSettingsCard
            isPublic={trip.isPublic}
            isActive={trip.isActive}
            publishedAt={trip.publishedAt}
            showPicker={trip.showPicker}
            onPublicChange={trip.setIsPublic}
            onActiveChange={trip.setIsActive}
            onShowPicker={() => trip.setShowPicker(true)}
            onDateChange={trip.onDateChange}
          />

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 24,
            }}
          >
            <Text
              style={{ color: theme.text, fontSize: 20, fontWeight: '900' }}
            >
              Duraklar
            </Text>
            <TouchableOpacity
              onPress={trip.addWaypoint}
              style={{
                backgroundColor: theme.primary,
                paddingVertical: 10,
                paddingHorizontal: 18,
                borderRadius: 999,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Ionicons name="add" size={20} color={theme.accentText} />
              <Text
                style={{
                  color: theme.accentText,
                  fontWeight: '800',
                  marginLeft: 8,
                }}
              >
                Ekle
              </Text>
            </TouchableOpacity>
          </View>

          {trip.waypoints.map((wp, i) => (
            <WaypointCard
              key={i}
              index={i}
              waypoint={wp}
              onUpdate={(field, val) => trip.updateWaypoint(i, field, val)}
              onRemove={() => trip.removeWaypoint(i)}
              onPickImage={() => trip.pickImage(i)}
              onRemoveImage={(imgIdx) => trip.removeImage(i, imgIdx)}
              onOpenMap={() => openMap(i)}
              isUploading={trip.uploadingIndex === i}
              onEditTags={(photoIdx: number) =>
                setTaggingPhoto({ wpIdx: i, photoIdx })
              }
            />
          ))}

          <TouchableOpacity
            onPress={trip.handleSave}
            disabled={trip.loading}
            style={{
              backgroundColor: theme.primary,
              paddingVertical: 20,
              borderRadius: 32,
              alignItems: 'center',
              marginBottom: 40,
              shadowColor: theme.primary,
              shadowOpacity: 0.2,
              shadowRadius: 14,
              elevation: 8,
            }}
          >
            {trip.loading ? (
              <ActivityIndicator color={theme.accentText} />
            ) : (
              <Text
                style={{
                  color: theme.accentText,
                  fontWeight: '900',
                  fontSize: 18,
                }}
              >
                ROTAYI PAYLAŞ
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>

        <MapPickerModal
          visible={mapWpIndex !== null}
          initialRegion={getMapInitialRegion()}
          onClose={() => setMapWpIndex(null)}
          onConfirm={handleMapConfirm}
        />

        {taggingPhoto && (
          <PhotoTagModal
            visible={true}
            photoUrl={currentTagPhoto?.url ?? null}
            tags={currentTagPhoto?.tags ?? []}
            onClose={() => setTaggingPhoto(null)}
            onAddTag={(tag) =>
              trip.addTag(taggingPhoto.wpIdx, taggingPhoto.photoIdx, tag)
            }
            onUpdateTag={(tagIdx, label) =>
              trip.updateTag(
                taggingPhoto.wpIdx,
                taggingPhoto.photoIdx,
                tagIdx,
                label,
              )
            }
            onDeleteTag={(tagIdx) =>
              trip.deleteTag(taggingPhoto.wpIdx, taggingPhoto.photoIdx, tagIdx)
            }
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
