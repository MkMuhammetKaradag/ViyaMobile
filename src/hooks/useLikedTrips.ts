import { useCallback, useEffect, useRef, useState } from 'react';
import { apiClient } from '../api/client';
import { TripSummary } from '../types/trip';

const LIMIT = 12;

export function useLikedTrips() {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [trips, setTrips] = useState<TripSummary[]>([]);
  const [page, setPage] = useState(1);
  const [tripsLoading, setTripsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // ✅ Stale closure çözümü
  const tripsLoadingRef = useRef(false);
  const hasMoreRef = useRef(true);

  const fetchLikedTrips = useCallback(async (pageNum = 1) => {
    if (tripsLoadingRef.current || (pageNum !== 1 && !hasMoreRef.current))
      return;

    try {
      tripsLoadingRef.current = true;
      setTripsLoading(true);

      const response = await apiClient.get<{ trips: TripSummary[] }>(
        `/api/v1/trips/liked?page=${pageNum}&limit=${LIMIT}`,
      );

      const newItems = response.data.trips || [];

      setTrips((prev) => (pageNum === 1 ? newItems : [...prev, ...newItems]));

      setPage(pageNum);

      const moreAvailable = newItems.length === LIMIT;
      hasMoreRef.current = moreAvailable;
      setHasMore(moreAvailable);
    } catch (error) {
      console.error('Beğenilen rotalar çekme hatası:', error);
    } finally {
      tripsLoadingRef.current = false;
      setTripsLoading(false);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchLikedTrips(1);
      setLoading(false);
    };
    init();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      // ✅ Refresh'te ref'leri sıfırla
      hasMoreRef.current = true;
      await fetchLikedTrips(1);
    } catch (error) {
      console.error('Beğenilenler yenileme hatası:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }: any) => {
    const paddingToBottom = 150;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  const loadMore = useCallback(() => {
    if (!tripsLoadingRef.current && hasMoreRef.current) {
      setPage((prev) => {
        const nextPage = prev + 1;
        fetchLikedTrips(nextPage);
        return nextPage;
      });
    }
  }, [fetchLikedTrips]);

  return {
    trips,
    tripsLoading,
    loading,
    refreshing,
    hasMore,
    onRefresh,
    isCloseToBottom,
    loadMore,
  };
}
