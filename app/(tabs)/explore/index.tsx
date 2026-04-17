import { ExploreTripCard } from '@/components/explore/ExploreTripCard';
import { apiClient } from '@/src/api/client';
import { TripExploreDTO } from '@/src/types/trip';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  TextInput,
  View,
} from 'react-native';

export default function ExploreScreen() {
  const router = useRouter();
  const [trips, setTrips] = useState<TripExploreDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState('');

  const LIMIT = 21; 

  const fetchExplore = async (pageNum = 1, isRefresh = false) => {
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
  };

  useEffect(() => {
    fetchExplore(1);
  }, []);

  const renderHeader = () => (
    <View className="px-3 py-4 bg-white">
      <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2">
        <Ionicons name="search" size={18} color="#94a3b8" />
        <TextInput
          placeholder="Ara"
          className="flex-1 ml-2 text-base py-1"
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#94a3b8"
        />
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-black pt-12">
    

      {/* 📸 Grid Akışı */}
      <FlatList
        data={trips}
        numColumns={3}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        renderItem={({ item }) => (
          <ExploreTripCard
            trip={item}
            onPress={(id) => router.push(`/trip/${id}`)}
          />
        )}
        onEndReached={() => fetchExplore(page + 1)}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchExplore(1, true)}
          />
        }
        ListFooterComponent={() =>
          loading ? (
            <ActivityIndicator className="my-4" color="#4ECDC4" />
          ) : null
        }
      />
    </View>
  );
}
