import ProfileHeader from '@/components/profile/ProfileHeader';
import { TripCard } from '@/components/profile/TripCard';
import { useUserStore } from '@/src/store/useUserStore';
import { TripSummary } from '@/src/types/trip';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { apiClient } from '../../../src/api/client';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const router = useRouter();
  const { user, fetchUser } = useUserStore();
  // const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [trips, setTrips] = useState<TripSummary[]>([]); // TripSummary
  const [page, setPage] = useState(1);
  const [tripsLoading, setTripsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  // const fetchProfile = async () => {
  //   try {
  //     const response = await apiClient.get<{ user: UserProfile }>(
  //       '/api/v1/users/me',
  //     );
  //     setUser(response.data.user);
  //     console.log(response.data.user);
  //   } catch (error) {
  //     console.error('Profil çekme hatası:', error);
  //   } finally {
  //     setLoading(false);
  //     setRefreshing(false);
  //   }
  // };

  const fetchUserTrips = async (pageNum = 1) => {
    const LIMIT = 12;
    if (tripsLoading || (pageNum !== 1 && !hasMore)) return;

    try {
      setTripsLoading(true);
      const response = await apiClient.get<{ trip: TripSummary[] }>(
        `/api/v1/trips/me?page=${pageNum}&limit=${LIMIT}`,
      );

      const newItems = response.data.trip || [];

      setTrips((prev) => {
        // Eğer ilk sayfayı çekiyorsak listeyi sıfırla, değilse üstüne ekle
        return pageNum === 1 ? newItems : [...prev, ...newItems];
      });

      setPage(pageNum);

      const moreAvailable = newItems.length === LIMIT;
      setHasMore(moreAvailable);

      // EKRAN DOLANA KADAR OTOMATİK ÇEKME
      // Burada 'updatedCount' kontrolünü trips.length + newItems.length olarak düşün
      if (moreAvailable && pageNum * LIMIT < 15) {
        setTimeout(() => {
          fetchUserTrips(pageNum + 1);
        }, 100);
      }
    } catch (error) {
      console.error('Rota çekme hatası:', error);
    } finally {
      setTripsLoading(false);
    }
  };
  // useEffect içine ekle
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      if (!user) {
        fetchUser(); // Sadece veri yoksa çek
      }
      await fetchUserTrips(1); // Profil bittikten sonra rotaları çek
      setLoading(false);
    };
    init();
  }, []);
  const onRefresh = () => {
    setRefreshing(true);
    // fetchProfile();
    if (!user) {
      fetchUser(); // Sadece veri yoksa çek
    }
    fetchUserTrips(1);
  };
  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }: any) => {
    const paddingToBottom = 200; // Alt kısımdan ne kadar önce yüklensin?
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };
  const loadMore = () => {
    if (!tripsLoading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchUserTrips(nextPage);
    }
  };
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#4ECDC4" />
      </View>
    );
  }

  const TripSkeleton = () => (
    <View
      style={{ width: width / 3, height: (width / 3) * 1.2 }}
      className="p-[0.5px]"
    >
      <View className="flex-1 bg-gray-200 animate-pulse" />
      {/* 'animate-pulse' Tailwind (NativeWind) ile hafif yanıp sönme efekti verir */}
    </View>
  );
  return (
    <View className="flex-1 bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#4ECDC4"
          />
        }
        onScroll={({ nativeEvent }) => {
          if (isCloseToBottom(nativeEvent)) {
            loadMore();
          }
        }}
        scrollEventThrottle={100}
      >
        <ProfileHeader user={user} />

        {/* 1. GRUP: Sadece Rotalar (Izgara Yapısı) */}
        <View className="flex-row flex-wrap w-full">
          {trips.map((item) => (
            <TripCard
              key={item.id}
              trip={item}
              onPress={(id) => router.push(`/(tabs)/profile`)}
            />
          ))}
          {tripsLoading && trips.length === 0 && (
            <>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                <TripSkeleton key={i} />
              ))}
            </>
          )}
        </View>

        {/* 2. GRUP: Izgaranın DIŞINDA kalan alt elemanlar */}
        <View className="w-full py-10">
          {tripsLoading ? (
            // Yüklenirken her zaman bu dönsün
            <ActivityIndicator size="small" color="#4ECDC4" />
          ) : (
            // Yükleme bittiğinde ve daha fazla veri varsa buton çıksın
            hasMore && (
              <TouchableOpacity onPress={loadMore} className="items-center">
                <Text className="text-[#4ECDC4] font-bold">
                  Daha Fazla Göster
                </Text>
              </TouchableOpacity>
            )
          )}

          {/* Debug için: Hiç rota yoksa veya bittiyse ufak bir not */}
          {!hasMore && trips.length > 0 && (
            <Text className="text-gray-400 text-center text-xs">
              Tüm rotalar yüklendi
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
