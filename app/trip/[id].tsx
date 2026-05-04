import { CommentSection } from '@/components/trip/comments/CommentSection';
import { TripCoverHeader } from '@/components/trip/TripCoverHeader';
import { TripInteractionBar } from '@/components/trip/TripInteractionBar';
import { WaypointList } from '@/components/trip/WaypointList';
import { useThemeColors } from '@/src/hooks/theme/useThemeColors';
import { useComments } from '@/src/hooks/useComments';
import { useTripDetail } from '@/src/hooks/useTripDetail';
import { useUserStore } from '@/src/store/useUserStore';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';

export default function TripDetailScreen() {
  const [isCommentModalVisible, setCommentModalVisible] = React.useState(false);
  const { id } = useLocalSearchParams();
  const currentUser = useUserStore.getState().user;
  const {
    trip,
    loading,
    isMyTrip,
    deleteWaypoint,
    reorderWaypoint,
    toggleLike,
  } = useTripDetail();

  console.log('TripDetailScreen render oldu. Trip:', currentUser);

  const theme = useThemeColors();
  const { comments, addComment, loadMore } = useComments(id as string);
  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} color={theme.primary} />;
  }

  if (!trip) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.background,
        }}
      >
        <Text style={{ color: theme.subtext }}>Gezi bulunamadı.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
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
          isLiked={trip.is_liked}
          onLikePress={toggleLike}
          onCommentPress={() => setCommentModalVisible(true)}
        />

        {/* Açıklama */}
        <View style={{ padding: 24 }}>
          <Text
            style={{
              color: theme.subtext,
              lineHeight: 28,
              fontSize: 16,
              fontStyle: 'italic',
            }}
          >
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
      <CommentSection
        isVisible={isCommentModalVisible}
        onClose={() => setCommentModalVisible(false)}
        tripId={id as string}
        comments={comments}
        onSendComment={addComment}
        onLoadMore={loadMore}
      />
    </View>
  );
}
