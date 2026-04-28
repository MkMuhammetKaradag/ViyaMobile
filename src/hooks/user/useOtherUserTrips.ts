import { apiClient } from '@/src/api/client';
import { TripSummary } from '@/src/types/trip';
import { UserProfile } from '@/src/types/user';
import { useCallback, useEffect, useRef, useState } from 'react';

const LIMIT = 12;

export function useOtherUserTrips(targetUserId: string) {
  const [loading, setLoading] = useState(true); // Profil verisi için
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [trips, setTrips] = useState<TripSummary[]>([]);
  const [page, setPage] = useState(1);
  const [tripsLoading, setTripsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // ✅ Senin Ref taktiğin: Stale closure engelleme
  const tripsLoadingRef = useRef(false);
  const hasMoreRef = useRef(true);

  const fetchOtherUserTrips = useCallback(
    async (pageNum = 1) => {
      if (tripsLoadingRef.current || (pageNum !== 1 && !hasMoreRef.current))
        return;

      try {
        tripsLoadingRef.current = true;
        setTripsLoading(true);

        const response = await apiClient.get<{ trips: TripSummary[] }>(
          `/api/v1/trips/user/${targetUserId}?page=${pageNum}&limit=${LIMIT}`,
        );

        const newItems = response.data.trips || [];
        console.log(
          `fetchOtherUserTrips: Sayfa ${pageNum} için ${newItems.length} rota çekildi.`,
          newItems,
        );
        setTrips((prev) => (pageNum === 1 ? newItems : [...prev, ...newItems]));
        setPage(pageNum);

        const moreAvailable = newItems.length === LIMIT;
        hasMoreRef.current = moreAvailable;
        setHasMore(moreAvailable);

        // Ekran dolana kadar (veya belli limit kadar) çekme mantığın
        if (moreAvailable && pageNum * LIMIT < 15) {
          tripsLoadingRef.current = false;
          await fetchOtherUserTrips(pageNum + 1);
          return;
        }
      } catch (error) {
        console.error('Kullanıcı rotaları çekme hatası:', error);
      } finally {
        tripsLoadingRef.current = false;
        setTripsLoading(false);
      }
    },
    [targetUserId],
  );

  const fetchProfileAndTrips = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Profil bilgilerini çek (Gizlilik durumunu öğrenmek için)
      const profileRes = await apiClient.get<{
        user: UserProfile;
      }>(`/api/v1/users/profile/${targetUserId}`);
      const profileData = profileRes.data.user; // Backend yapına göre .user veya .data
      setUserProfile(profileData);

      // 2. Gizlilik kontrolü (Senin SQL'de yaptığın kontrolün UI tarafındaki karşılığı)
      // Eğer profil gizli değilse veya biz takip ediyorsak (is_following) rotaları çek
      if (!profileData.is_private || profileData.is_following) {
        hasMoreRef.current = true;
        await fetchOtherUserTrips(1);
      }
    } catch (error) {
      console.error('Kullanıcı profil hatası:', error);
    } finally {
      setLoading(false);
    }
  }, [targetUserId, fetchOtherUserTrips]);

  useEffect(() => {
    if (targetUserId) {
      fetchProfileAndTrips();
    }
  }, [targetUserId]);

  const loadMore = useCallback(() => {
    if (!tripsLoadingRef.current && hasMoreRef.current) {
      const nextPage = page + 1;
      fetchOtherUserTrips(nextPage);
    }
  }, [page, fetchOtherUserTrips]);

  // Profil sayfasındaki ScrollView için senin isCloseToBottom mantığın
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

  return {
    userProfile,
    loading,
    trips,
    tripsLoading,
    hasMore,
    onRefresh: fetchProfileAndTrips,

    isCloseToBottom,
    loadMore,
  };
}
