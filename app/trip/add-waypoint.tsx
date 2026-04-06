import { MapPickerModal } from '@/components/trip/MapPickerModal';
import { PhotoTagModal } from '@/components/trip/PhotoTagModal';
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

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        className="flex-1 px-6 pt-16"
        showsVerticalScrollIndicator={false}
      >
        {/* Başlık */}
        <View className="flex-row items-center mb-8">
          <TouchableOpacity
            onPress={() => router.back()}
            className="mr-4 bg-gray-100 p-2 rounded-full"
          >
            <Ionicons name="close" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-2xl font-black text-gray-900">Durak Ekle</Text>
        </View>

        {/* Durak adı */}
        <TextInput
          placeholder="Durak ismi..."
          value={wp.title}
          onChangeText={wp.setTitle}
          className="bg-gray-50 p-5 rounded-3xl mb-4 font-bold border border-gray-100 text-lg"
        />

        {/* Konum seç */}
        <TouchableOpacity
          onPress={() => setMapVisible(true)}
          className="bg-blue-50/50 p-5 rounded-3xl mb-4 border border-blue-100 flex-row items-center"
        >
          <View className="bg-blue-500 p-3 rounded-2xl mr-4 shadow-sm">
            <Ionicons name="map" size={20} color="white" />
          </View>
          <View className="flex-1">
            <Text className="text-blue-500 font-bold text-[10px] uppercase">
              Konum Seç
            </Text>
            <Text className="text-blue-900 font-bold text-sm">
              {wp.location.latitude.toFixed(4)},{' '}
              {wp.location.longitude.toFixed(4)}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Açıklama */}
        <TextInput
          placeholder="Açıklama..."
          value={wp.desc}
          onChangeText={wp.setDesc}
          multiline
          className="bg-gray-50 p-5 rounded-3xl mb-6 min-h-[120px] text-gray-700 border border-gray-100"
        />

        {/* Fotoğraflar */}
        <View className="flex-row flex-wrap mb-8">
          {wp.images.map((img, i) => (
            <View key={i} className="mr-3 mb-3 relative">
              <TouchableOpacity onPress={() => setTaggingPhotoIdx(i)}>
                <Image
                  source={{ uri: img.uri }}
                  style={{ width: 96, height: 96, borderRadius: 24 }}
                  contentFit="cover"
                />
                {img.tags.length > 0 && (
                  <View className="absolute -top-1 -right-1 bg-[#4ECDC4] rounded-full px-2 py-0.5 border-2 border-white">
                    <Text className="text-[10px] text-white font-black">
                      {img.tags.length}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => wp.removeImage(i)}
                className="absolute -top-2 -left-2 bg-white rounded-full"
              >
                <Ionicons name="close-circle" size={22} color="#FF6B6B" />
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity
            onPress={wp.pickImage}
            className="w-24 h-24 bg-gray-50 rounded-3xl items-center justify-center border-2 border-dashed border-gray-200"
          >
            <Ionicons name="camera" size={30} color="#94a3b8" />
          </TouchableOpacity>
        </View>

        {/* Kaydet */}
        <TouchableOpacity
          onPress={wp.handleSave}
          disabled={wp.loading}
          className="bg-[#4ECDC4] p-6 rounded-[32px] items-center mb-12 shadow-lg shadow-teal-200"
        >
          {wp.loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-black text-lg">
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
