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

const columnWidth = width / 3;

interface TripCardProps {
  trip: TripSummary;
  onPress: (id: string) => void;
}

export const TripCard: FC<TripCardProps> = ({ trip, onPress }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const DEFAULT_IMAGE = require('@/assets/images/df.png');

  const imageUrl =
    !trip.cover_image_url || hasError || trip.cover_image_url === '';

  return (
    <TouchableOpacity
      onPress={() => onPress(trip.id)}
      activeOpacity={0.9}
      style={{ width: columnWidth, height: columnWidth * 1.2 }}
      className="p-[0.5px] relative"
    >
      <View className="absolute inset-0 bg-neutral-900 m-[0.5px]" />

      <Image
        source={imageUrl ? DEFAULT_IMAGE : { uri: trip.cover_image_url }}
        className="w-full h-full"
        resizeMode="cover"
        onLoad={() => setIsLoaded(true)}
        onError={(e) => {
          console.log(
            `Resim yüklenemedi, fallback'e geçiliyor: ${trip.cover_image_url}`,
          );
          setHasError(true);
          setIsLoaded(true);
        }}
      />

      {!isLoaded && !hasError && (
        <View className="absolute inset-0 justify-center items-center">
          <ActivityIndicator size="small" color="#4ECDC4" />
        </View>
      )}

      <View className="absolute inset-0 bg-black/20" />

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
