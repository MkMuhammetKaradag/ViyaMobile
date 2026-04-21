import { apiClient } from '@/src/api/client';
import { useUserStore } from '@/src/store/useUserStore';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';

export function useTripDetail() {
  const { id } = useLocalSearchParams();
  const { user } = useUserStore();
  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const isMyTrip = useMemo(
    () => !!trip && trip.user_id === user?.id,
    [trip, user?.id],
  );
  const toggleLike = async () => {
    if (!trip) return;

    
    const previousIsLiked = trip.is_liked;
    const previousLikeCount = trip.like_count ?? 0;

    setTrip({
      ...trip,
      is_liked: !previousIsLiked,
      like_count: previousIsLiked
        ? previousLikeCount - 1
        : previousLikeCount + 1,
    });

    try {
      
      const res = await apiClient.patch(`/api/v1/trips/${id}/like`);

    
    } catch (error) {
    
      setTrip({
        ...trip,
        is_liked: previousIsLiked,
        like_count: previousLikeCount,
      });
      console.error('Beğeni işlemi başarısız:', error);
      Alert.alert('Hata', 'Beğeni işlemi gerçekleştirilemedi.');
    }
  };
  const fetchTripDetail = useCallback(async () => {
    try {
      const res = await apiClient.get(`/api/v1/trips/${id}`);
      setTrip(res.data.trip);
    } catch (err) {
      console.error('Gezi detayı alınamadı:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTripDetail();
  }, [fetchTripDetail]);

  const deleteWaypoint = useCallback(
    (waypointId: string) => {
      Alert.alert(
        'Durağı Sil',
        'Bu durağı ve içindeki tüm fotoğrafları silmek istediğine emin misin?',
        [
          { text: 'Vazgeç', style: 'cancel' },
          {
            text: 'Sil',
            style: 'destructive',
            onPress: async () => {
              try {
                await apiClient.delete(`/api/v1/waypoints/${waypointId}`);
                fetchTripDetail();
              } catch (err) {
                console.error('Silme hatası:', err);
                Alert.alert('Hata', 'Durak silinemedi.');
              }
            },
          },
        ],
      );
    },
    [fetchTripDetail],
  );

  const reorderWaypoint = useCallback(
    async (
      waypointId: string,
      currentIndex: number,
      direction: 'up' | 'down',
    ) => {
      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

      if (newIndex < 0 || newIndex >= (trip?.waypoints?.length || 0)) return;

      try {
        await apiClient.patch(`/api/v1/waypoints/${waypointId}/reorder`, {
          index: newIndex,
        });
        fetchTripDetail();
      } catch (err) {
        console.error('Sıralama güncellenirken hata oluştu:', err);
      }
    },
    [trip?.waypoints?.length, fetchTripDetail],
  );

  return {
    trip,
    loading,
    isMyTrip,
    toggleLike,
    deleteWaypoint,
    reorderWaypoint,
    refetch: fetchTripDetail,
  };
}
