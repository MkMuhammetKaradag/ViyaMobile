import { MapPickerModal } from '@/components/trip/MapPickerModal';
import { MultiCategoryPicker } from '@/components/trip/MultiCategoryPicker';
import { PhotoTagModal } from '@/components/trip/PhotoTagModal';
import { TripFormHeader } from '@/components/trip/TripFormHeader';
import { TripSettingsCard } from '@/components/trip/TripSettingsCard';
import { WaypointCard } from '@/components/trip/WaypointCard';
import { useCreateTrip } from '@/src/hooks/useCreateTrip';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <ScrollView
        className="flex-1 bg-white px-6"
        keyboardShouldPersistTaps="handled" // Liste seçimini engellemez
        showsVerticalScrollIndicator={false}
      >
        {/* Üst başlık */}
        <View className="mt-14 mb-8 flex-row justify-between items-center">
          <Text className="text-3xl font-black text-gray-900">Yeni Rota</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="close" size={30} />
          </TouchableOpacity>
        </View>

        {/* Form alanları */}
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
        {/* Ayarlar (switch'ler + tarih) */}
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

        {/* Duraklar başlığı + ekle butonu */}
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-xl font-black text-gray-800">Duraklar</Text>
          <TouchableOpacity
            onPress={trip.addWaypoint}
            className="bg-[#4ECDC4] p-2 px-4 rounded-full flex-row items-center"
          >
            <Ionicons name="add" size={20} color="white" />
            <Text className="text-white font-bold ml-1">Ekle</Text>
          </TouchableOpacity>
        </View>

        {/* Durak listesi */}
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

        {/* Kaydet butonu */}
        <TouchableOpacity
          onPress={trip.handleSave}
          disabled={trip.loading}
          className="bg-[#4ECDC4] p-5 rounded-3xl items-center mb-10 shadow-lg shadow-teal-300"
        >
          {trip.loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-black text-lg">ROTAYI PAYLAŞ</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Harita modalı */}
      <MapPickerModal
        visible={mapWpIndex !== null}
        initialRegion={getMapInitialRegion()}
        onClose={() => setMapWpIndex(null)}
        onConfirm={handleMapConfirm}
      />

      {/* Fotoğraf etiketleme modalı */}
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
  );
}
