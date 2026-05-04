// components/explore/ExploreTripCard.tsx
import { useThemeColors } from '@/src/hooks/theme/useThemeColors';
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
  const theme = useThemeColors();

  const usePlaceholder =
    !trip.display_image || hasError || trip.display_image === '';

  return (
    <TouchableOpacity
      onPress={() => onPress(trip.id)}
      activeOpacity={0.8}
      style={{ width: cardSize, height: cardSize }}
    >
      <Image
        source={usePlaceholder ? DEFAULT_IMAGE : { uri: trip.display_image }}
        style={{ width: '100%', height: '100%' }}
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
        <View
          style={{
            position: 'absolute',
            inset: 0,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ActivityIndicator size="small" color={theme.primary} />
        </View>
      )}

      <View
        style={{
          position: 'absolute',
          top: 8,
          right: 8,
          backgroundColor: 'rgba(0,0,0,0.4)',
          paddingHorizontal: 6,
          borderRadius: 10,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Ionicons name="location" size={10} color={theme.primary} />
        <Text
          style={{
            color: theme.accentText,
            fontSize: 9,
            fontWeight: '900',
            marginLeft: 4,
          }}
        >
          {trip.waypoint_count}
        </Text>
      </View>

      <View
        style={{
          position: 'absolute',
          bottom: 8,
          left: 8,
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.25)',
          paddingHorizontal: 6,
          borderRadius: 10,
        }}
      >
        <Ionicons name="eye" size={10} color={theme.accentText} />
        <Text
          style={{
            color: theme.accentText,
            fontSize: 9,
            fontWeight: '900',
            marginLeft: 4,
          }}
        >
          {trip.view_count}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
