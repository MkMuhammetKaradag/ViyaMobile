import { WaypointDraft } from '@/src/hooks/useCreateTrip';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  ActivityIndicator,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { CategorySearchPicker } from './CategorySearchPicker';

interface WaypointCardProps {
  index: number;
  waypoint: any;
  onUpdate: (field: keyof WaypointDraft, val: any) => void;
  onRemove: () => void;
  onPickImage: () => void;
  onRemoveImage: (imageIndex: number) => void;
  onOpenMap: () => void;
  onEditTags: (photoIdx: number) => void;

  isUploading: boolean;
}

export const WaypointCard = ({
  index,
  waypoint,
  onUpdate,
  onRemove,
  onPickImage,
  onRemoveImage,
  onOpenMap,
  isUploading,
  onEditTags,
}: WaypointCardProps) => {
  return (
    <View className="bg-gray-50 p-5 rounded-[32px] mb-6 border border-gray-200 shadow-sm">
      {/* Üst Başlık ve Silme */}
      <View className="flex-row justify-between items-center mb-4">
        <View className="flex-row items-center bg-[#4ECDC4]/10 px-3 py-1 rounded-full">
          <Text className="font-black text-[#4ECDC4] text-sm">
            DURAK {index + 1}
          </Text>
        </View>
        <TouchableOpacity onPress={onRemove} className="p-1">
          <Ionicons name="trash-outline" size={22} color="#FF6B6B" />
        </TouchableOpacity>
      </View>

      {/* Başlık Girişi */}
      <TextInput
        placeholder="Nereye gittin? (Örn: Odunpazarı)"
        value={waypoint.title}
        onChangeText={(val) => onUpdate('title', val)}
        className="bg-white p-4 rounded-2xl mb-3 border border-gray-100 font-bold text-gray-800"
      />

      {/* 🗺️ Konum Seçici (Yeni Bölüm) */}
      <TouchableOpacity
        onPress={onOpenMap}
        className="flex-row items-center bg-white p-3 rounded-2xl mb-3 border border-gray-100"
      >
        <View className="bg-blue-50 p-2 rounded-xl mr-3">
          <Ionicons name="location" size={18} color="#3b82f6" />
        </View>
        <View className="flex-1">
          <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">
            Koordinatlar
          </Text>
          <Text className="text-gray-700 font-medium text-xs">
            {waypoint.latitude !== 0
              ? `${waypoint.latitude.toFixed(4)}, ${waypoint.longitude.toFixed(4)}`
              : 'Haritadan Konum Seç'}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color="#cbd5e1" />
      </TouchableOpacity>

      {/* Not Girişi */}
      <TextInput
        placeholder="Bu durak hakkında bir şeyler karala..."
        value={waypoint.note}
        onChangeText={(val) => onUpdate('note', val)}
        multiline
        className="bg-white p-4 rounded-2xl mb-4 border border-gray-100 text-sm text-gray-600 min-h-[60px]"
        textAlignVertical="top"
      />
      <CategorySearchPicker
        label="Bu Durağın Kategorisi"
        selectedCategory={waypoint.category} // waypoint objesinde artık {id, name} var
        onSelect={(cat) => onUpdate('category', cat)}
      />

      {/* Resim Galerisi */}
      <Text className="text-gray-400 text-[10px] font-bold uppercase mb-2 ml-1">
        Fotoğraflar
      </Text>
      <View className="flex-row flex-wrap">
        {waypoint.photos.map((photoObj: any, pIdx: number) => (
          <View key={pIdx} className="relative mr-2 mb-2">
            <TouchableOpacity
              onPress={() => onEditTags(pIdx)} // 👈
            >
              <Image
                source={{ uri: photoObj.url }} // 👈
                className="w-20 h-20 rounded-2xl border border-gray-100"
              />
              {photoObj.tags?.length > 0 && (
                <View className="absolute bottom-1 right-1 bg-[#4ECDC4] rounded-full p-1">
                  <Text className="text-[8px] text-white font-bold">
                    {photoObj.tags.length}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            {/* Silme butonu aynı kalıyor... */}
          </View>
        ))}
        <TouchableOpacity
          onPress={onPickImage}
          disabled={isUploading}
          className="w-20 h-20 bg-gray-100 rounded-2xl items-center justify-center border-2 border-dashed border-gray-200"
        >
          {isUploading ? (
            <ActivityIndicator size="small" color="#4ECDC4" />
          ) : (
            <View className="items-center">
              <Ionicons name="camera" size={24} color="#94a3b8" />
              <Text className="text-[8px] text-gray-400 font-bold mt-1">
                EKLE
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};
