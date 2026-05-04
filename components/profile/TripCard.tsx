// components/profile/TripCard.tsx
import { useThemeColors } from '@/src/hooks/theme/useThemeColors';
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
  const theme = useThemeColors();
  const DEFAULT_IMAGE = require('@/assets/images/df.png');

  const imageUrl =
    !trip.cover_image_url || hasError || trip.cover_image_url === '';

  return (
    <TouchableOpacity
      onPress={() => onPress(trip.id)}
      activeOpacity={0.9}
      style={{
        width: columnWidth,
        height: columnWidth * 1.2,
        padding: 0.5,
        position: 'relative',
      }}
    >
      <View
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: theme.surface,
          margin: 0.5,
        }}
      />

      <Image
        source={imageUrl ? DEFAULT_IMAGE : { uri: trip.cover_image_url }}
        style={{ width: '100%', height: '100%' }}
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
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.2)',
        }}
      />

      <View style={{ position: 'absolute', bottom: 8, left: 8, right: 8 }}>
        <Text
          style={{ color: theme.accentText, fontSize: 11, fontWeight: '900' }}
          numberOfLines={1}
        >
          {trip.title}
        </Text>
        <View
          style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}
        >
          <Ionicons name="eye-outline" size={10} color={theme.accentText} />
          <Text style={{ color: theme.accentText, fontSize: 9, marginLeft: 4 }}>
            {trip.view_count}
          </Text>

          <Ionicons
            name="location-outline"
            size={10}
            color={theme.accentText}
            style={{ marginLeft: 10 }}
          />
          <Text style={{ color: theme.accentText, fontSize: 9, marginLeft: 4 }}>
            {trip.waypoint_count}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
