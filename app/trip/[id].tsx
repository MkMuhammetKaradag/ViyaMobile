import { CommentSection } from '@/components/trip/comments/CommentSection';
import { EditTripModal } from '@/components/trip/EditTripModal';
import { TripCoverHeader } from '@/components/trip/TripCoverHeader';
import { TripInteractionBar } from '@/components/trip/TripInteractionBar';
import { WaypointList } from '@/components/trip/WaypointList';
import { apiClient } from '@/src/api/client';
import { useThemeColors } from '@/src/hooks/theme/useThemeColors';
import { useComments } from '@/src/hooks/useComments';
import { useTripDetail } from '@/src/hooks/useTripDetail';
import { useUserStore } from '@/src/store/useUserStore';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { EditWaypointModal } from './editWaypointModal';

export default function TripDetailScreen() {
  const [isCommentModalVisible, setCommentModalVisible] = React.useState(false);
  const { id } = useLocalSearchParams();
  const [isForking, setIsForking] = useState(false);
  const currentUser = useUserStore.getState().user;

  // Modalların State Yönetimleri
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [isEditTripModalVisible, setEditTripModalVisible] = useState(false); // 🚀 Gezi modal state'i
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

        {/* 🚀 BAŞLIK & AÇIKLAMA BAŞI DÜZENLEME PANELİ (Sadece gezi sahibi görebilir) */}
        {isMyTrip && (
          <View
            style={{
              paddingHorizontal: 24,
              paddingTop: 16,
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}
          >
            <TouchableOpacity
              onPress={() => setEditTripModalVisible(true)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: theme.surface,
                paddingVertical: 8,
                paddingHorizontal: 16,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: theme.border,
              }}
            >
              <Ionicons
                name="create-outline"
                size={16}
                color={theme.primary}
                style={{ marginRight: 6 }}
              />
              <Text
                style={{
                  color: theme.primary,
                  fontWeight: '700',
                  fontSize: 13,
                }}
              >
                Geziyi Düzenle
              </Text>
            </TouchableOpacity>
          </View>
        )}

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
            "{trip.description || 'Bu rota için henüz bir açıklama eklenmedi.'}"
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

      {/* Durak Düzenleme Modalı */}
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

      {/* 🚀 Gezi Düzenleme Modalı */}
      <EditTripModal
        isVisible={isEditTripModalVisible}
        onClose={() => setEditTripModalVisible(false)}
        trip={trip}
        onSuccess={() => {
          refetch(); // Başarılı olunca backend'den güncel gezi verilerini (başlık, desc vb.) çekiyoruz!
        }}
      />
    </View>
  );
}
