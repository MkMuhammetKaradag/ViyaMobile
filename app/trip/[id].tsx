import { TripCoverHeader } from '@/components/trip/TripCoverHeader';
import { TripInteractionBar } from '@/components/trip/TripInteractionBar';
import { WaypointList } from '@/components/trip/WaypointList';
import { useTripDetail } from '@/src/hooks/useTripDetail';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';

export default function TripDetailScreen() {
  const { id } = useLocalSearchParams();
  const { trip, loading, isMyTrip, deleteWaypoint, reorderWaypoint } =
    useTripDetail();

  if (loading) {
    return <ActivityIndicator className="flex-1" color="#4ECDC4" />;
  }

  if (!trip) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-400">Gezi bulunamadı.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Kapak */}
        <TripCoverHeader
          title={trip.title}
          publishedAt={trip.published_at}
          coverImageUrl={trip.cover_image_url}
        />

        {/* Etkileşim barı */}
        <TripInteractionBar
          viewCount={trip.view_count}
          likeCount={trip.like_count}
          commentCount={trip.comment_count}
        />

        {/* Açıklama */}
        <View className="p-6">
          <Text className="text-gray-600 leading-7 text-base italic">
            "{trip.description}"
          </Text>
        </View>

        {/* Duraklar */}
        <WaypointList
          waypoints={trip.waypoints ?? []}
          isMyTrip={isMyTrip}
          tripId={id}
          onDelete={deleteWaypoint}
          onReorder={reorderWaypoint}
        />
      </ScrollView>
    </View>
  );
}
