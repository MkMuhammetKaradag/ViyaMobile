import { CommentSection } from '@/components/trip/comments/CommentSection';
import { TripCoverHeader } from '@/components/trip/TripCoverHeader';
import { TripInteractionBar } from '@/components/trip/TripInteractionBar';
import { WaypointList } from '@/components/trip/WaypointList';
import { apiClient } from '@/src/api/client';
import { useThemeColors } from '@/src/hooks/theme/useThemeColors';
import { useComments } from '@/src/hooks/useComments';
import { useTripDetail } from '@/src/hooks/useTripDetail';
import { useUserStore } from '@/src/store/useUserStore';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, View } from 'react-native';
import { EditWaypointModal } from './editWaypointModal';

export default function TripDetailScreen() {
  const [isCommentModalVisible, setCommentModalVisible] = React.useState(false);
  const { id } = useLocalSearchParams();
  const [isForking, setIsForking] = useState(false);
  const currentUser = useUserStore.getState().user;
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [selectedWaypoint, setSelectedWaypoint] = useState<any>(null);

  const handleOpenEdit = (waypoint: any) => {
    setSelectedWaypoint(waypoint);
    setEditModalVisible(true);
  };
  const {
    trip,
    loading,
    isMyTrip,
    deleteWaypoint,
    reorderWaypoint,
    toggleLike,
    refetch,
  } = useTripDetail();

  const handleForkTrip = () => {
    Alert.alert(
      'Rotayı Çatalla',
      'Bu rotayı kendi seyahat planlarına kopyalamak istiyor musun? Duraklar fotoğraflarsız olarak aktarılacaktır.',
      [
        { text: 'Vazgeç', style: 'cancel' },
        {
          text: 'Çatalla',
          style: 'destructive',

          onPress: async () => {
            setIsForking(true);
            try {
              const res = await apiClient.post(`/api/v1/trips/${id}/fork`);

              Alert.alert(
                'Başarılı',
                'Rota başarıyla çatallandı! Yeni rotana yönlendiriliyorsun.',
              );

              if (res.data && res.data.id) {
                router.replace(`/trip/${res.data.id}`);
              } else {
                router.replace('/(tabs)/profile');
              }
            } catch (error: any) {
              console.error('Fork hatası:', error);
              const errorMsg =
                error.response?.data?.error ||
                'Rota çatallanamadı. Gizlilik ayarlarını kontrol edin.';
              Alert.alert('Hata', errorMsg);
            } finally {
              setIsForking(false);
            }
          },
        },
      ],
    );
  };

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
          isMyTrip={isMyTrip}
          isForking={isForking}
          onLikePress={toggleLike}
          onCommentPress={() => setCommentModalVisible(true)}
          onForkPress={handleForkTrip}
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
          onEdit={handleOpenEdit}
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
      <EditWaypointModal
        isVisible={isEditModalVisible}
        onClose={() => {
          setEditModalVisible(false);
          setSelectedWaypoint(null);
        }}
        waypoint={selectedWaypoint}
        onSuccess={() => {
          refetch();
        }}
      />
    </View>
  );
}
