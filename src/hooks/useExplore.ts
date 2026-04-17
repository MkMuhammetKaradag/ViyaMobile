import { apiClient } from '@/src/api/client';
import { TripExploreDTO } from '@/src/types/trip';
import { useCallback, useEffect, useState } from 'react';

export function useExplore() {
  const [trips, setTrips] = useState<TripExploreDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const LIMIT = 18;

  const fetchExplore = useCallback(
    async (pageNum = 1, isRefresh = false) => {
      if (loading || (!isRefresh && !hasMore)) return;

      setLoading(true);
      try {
        const res = await apiClient.get<{ trips: TripExploreDTO[] }>(
          `/api/v1/trips/explore?page=${pageNum}&limit=${LIMIT}`,
        );
        const newItems = res.data.trips || [];

        setTrips((prev) => (pageNum === 1 ? newItems : [...prev, ...newItems]));
        setHasMore(newItems.length === LIMIT);
        setPage(pageNum);
      } catch (e) {
        console.error('Keşfet yükleme hatası:', e);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [loading, hasMore],
  );

  // İlk yükleme
  useEffect(() => {
    fetchExplore(1, true);
  }, []);

  // Sayfayı yenileme (Pull-to-refresh)
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchExplore(1, true);
  }, [fetchExplore]);

  // Daha fazla yükleme (Infinite scroll)
  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      fetchExplore(page + 1);
    }
  }, [hasMore, loading, page, fetchExplore]);

  return {
    trips,
    loading,
    refreshing,
    hasMore,
    onRefresh,
    loadMore,
  };
}
