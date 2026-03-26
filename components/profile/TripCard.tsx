// components/profile/TripCard.tsx
import { TripSummary } from '@/src/types/trip';
import { Ionicons } from '@expo/vector-icons';
import { FC, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
interface TripCardProps {
  trip: TripSummary;
  onPress: (id: string) => void;
}

const { width } = Dimensions.get('window');
// Ekran genişliğini 3'e bölüyoruz (boşluklar için ufak bir pay bırakarak)
const columnWidth = width / 3;

interface TripCardProps {
  trip: TripSummary;
  onPress: (id: string) => void;
}

export const TripCard: FC<TripCardProps> = ({ trip, onPress }) => {
  // Resim yüklendi mi yüklenmedi mi takibi
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const placeholderImage =
    'https://via.placeholder.com/300/171717/4ECDC4?text=Viya'; // Siyah zemin üzerine Viya yazılı yedek resim
  const imageUrl =
    !trip.cover_image_url || hasError ? placeholderImage : trip.cover_image_url;
  return (
    <TouchableOpacity
      onPress={() => onPress(trip.id)}
      activeOpacity={0.9}
      style={{ width: columnWidth, height: columnWidth * 1.2 }}
      className="p-[0.5px] relative"
    >
      {/* 1. ARKA PLAN (Siyah/Koyu Kutu) */}
      <View className="absolute inset-0 bg-neutral-900 m-[0.5px]" />

      {/* 2. ASIL RESİM */}
      <Image
        source={{ uri: imageUrl }}
        className="w-full h-full"
        resizeMode="cover"
        onLoad={() => {
          setIsLoaded(true); // Başarıyla yüklenirse siyahlığı kapat
          setHasError(false); // Hata durumunu sıfırla
        }}
        onError={() => {
          // HATA OLUŞTU!
          setIsLoaded(true); // Yükleme animasyonunu kapat
          setHasError(true); // Yedek resmi devreye sok (state güncellenince source değişecek)
          //console.log(`Resim yüklenemedi: ${trip.title}`);
        }}
      />

      {/* 3. RESİM YÜKLENENE KADAR GÖRÜNECEK LOADING (Opsiyonel) */}
      {!isLoaded && !hasError && (
        <View className="absolute inset-0 justify-center items-center">
          <ActivityIndicator size="small" color="#4ECDC4" />
        </View>
      )}

      {/* 4. OVERLAY (Yazıların okunması için karartma) */}
      <View className="absolute inset-0 bg-black/20" />

      {/* 5. VERİLER (Resimden bağımsız olarak hep orada) */}
      <View className="absolute bottom-2 left-2 right-2">
        <Text className="text-white text-[11px] font-bold" numberOfLines={1}>
          {trip.title}
        </Text>
        <View className="flex-row items-center mt-0.5">
          <Ionicons name="eye-outline" size={10} color="white" />
          <Text className="text-white text-[9px] ml-1">{trip.view_count}</Text>

          <Ionicons
            name="location-outline"
            size={10}
            color="white"
            style={{ marginLeft: 8 }}
          />
          <Text className="text-white text-[9px] ml-1">
            {trip.waypoint_count}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
