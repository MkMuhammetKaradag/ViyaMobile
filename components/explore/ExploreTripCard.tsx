// components/explore/ExploreTripCard.tsx
import { TripExploreDTO } from '@/src/types/trip';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');
const cardSize = width / 3;

const DEFAULT_IMAGE = require('@/assets/images/df.png');

export const ExploreTripCard = ({
  trip,
  onPress,
}: {
  trip: TripExploreDTO;
  onPress: (id: string) => void;
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const usePlaceholder =
    !trip.display_image || hasError || trip.display_image === '';

  return (
    <TouchableOpacity
      onPress={() => onPress(trip.id)}
      activeOpacity={0.8}
      style={{ width: cardSize, height: cardSize }}
      className="p-[0.5px] relative bg-gray-200"
    >
      <Image
        source={usePlaceholder ? DEFAULT_IMAGE : { uri: trip.display_image }}
        className="w-full h-full"
        resizeMode="cover"
        onLoad={() => setIsLoaded(true)}
        onError={(e) => {
          console.log(
            `Resim yüklenemedi, fallback'e geçiliyor: ${trip.display_image}`,
          );
          setHasError(true);
          setIsLoaded(true);
        }}
      />

      {!isLoaded && !usePlaceholder && (
        <View className="absolute inset-0 justify-center items-center">
          <ActivityIndicator size="small" color="#4ECDC4" />
        </View>
      )}

      {/* 📍 Durak Sayısı */}
      <View className="absolute top-1 right-1 bg-black/40 px-1 rounded flex-row items-center">
        <Ionicons name="location" size={10} color="#4ECDC4" />
        <Text className="text-white text-[9px] font-bold ml-0.5">
          {trip.waypoint_count}
        </Text>
      </View>

      {/* 👁️ Görüntülenme Sayısı */}
      <View className="absolute bottom-1 left-1 flex-row items-center bg-black/20 px-1 rounded">
        <Ionicons name="eye" size={10} color="white" />
        <Text className="text-white text-[9px] font-bold ml-0.5">
          {trip.view_count}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
