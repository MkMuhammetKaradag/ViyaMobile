import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { apiClient } from '../api/client';
import { useUserStore } from '../store/useUserStore';
import { TripSummary } from '../types/trip';

const LIMIT = 12;

export function useUserTrips() {
  const router = useRouter();
  const { user, fetchUser } = useUserStore();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [trips, setTrips] = useState<TripSummary[]>([]);
  const [page, setPage] = useState(1);
  const [tripsLoading, setTripsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // ✅ Stale closure sorununu ref ile çözüyoruz
  const tripsLoadingRef = useRef(false);
  const hasMoreRef = useRef(true);

  const fetchUserTrips = useCallback(async (pageNum = 1) => {
    // ✅ State yerine ref okuyoruz
    if (tripsLoadingRef.current || (pageNum !== 1 && !hasMoreRef.current))
      return;

    try {
      tripsLoadingRef.current = true;
      setTripsLoading(true);

      const response = await apiClient.get<{ trip: TripSummary[] }>(
        `/api/v1/trips/me?page=${pageNum}&limit=${LIMIT}`,
      );

      const newItems = response.data.trip || [];

      setTrips((prev) => (pageNum === 1 ? newItems : [...prev, ...newItems]));

      setPage(pageNum);

      const moreAvailable = newItems.length === LIMIT;
      hasMoreRef.current = moreAvailable;
      setHasMore(moreAvailable);

      // ✅ setTimeout kaldırıldı, direkt await ile çağırıyoruz
      if (moreAvailable && pageNum * LIMIT < 15) {
        tripsLoadingRef.current = false; // bir sonraki çağrı için sıfırla
        await fetchUserTrips(pageNum + 1);
        return; // finally'nin tekrar false yapmasını engelle
      }
    } catch (error) {
      console.error('Rota çekme hatası:', error);
    } finally {
      tripsLoadingRef.current = false;
      setTripsLoading(false);
    }
  }, []); // ✅ Stable referans

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      if (!user) {
        await fetchUser();
      }
      await fetchUserTrips(1);
      setLoading(false);
    };
    init();
  }, []); // fetchUser ve fetchUserTrips stable olduğu için güvenli

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchUser();
      // ✅ Refresh'te ref'leri de sıfırla
      hasMoreRef.current = true;
      await fetchUserTrips(1);
    } catch (error) {
      console.error('Yenileme hatası:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }: any) => {
    const paddingToBottom = 200;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  const loadMore = useCallback(() => {
    // ✅ Ref ile kontrol, stale closure yok
    if (!tripsLoadingRef.current && hasMoreRef.current) {
      setPage((prev) => {
        const nextPage = prev + 1;
        fetchUserTrips(nextPage);
        return nextPage;
      });
    }
  }, [fetchUserTrips]);

  return {
    user,
    loading,
    refreshing,
    trips,
    tripsLoading,
    hasMore,
    onRefresh,
    isCloseToBottom,
    loadMore,
  };
}
