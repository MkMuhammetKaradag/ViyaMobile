import { ExploreTripCard } from '@/components/explore/ExploreTripCard';
import { useExplore } from '@/src/hooks/useExplore';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  TextInput,
  View,
} from 'react-native';

export default function ExploreScreen() {
  const router = useRouter();
  const { trips, loading, refreshing, onRefresh, loadMore } = useExplore();

  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={trips}
        numColumns={3}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ExploreTripCard
            trip={item}
            onPress={(id) => router.push(`/trip/${id}`)}
          />
        )}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#4ECDC4"
          />
        }
        ListHeaderComponent={
          <View className="px-3 py-4 pt-12">
            <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2">
              <Ionicons name="search" size={18} color="#94a3b8" />
              <TextInput
                placeholder="Ara"
                className="flex-1 ml-2 text-base py-1"
              />
            </View>
          </View>
        }
        ListFooterComponent={() =>
          loading && <ActivityIndicator className="my-8" color="#4ECDC4" />
        }
      />
    </View>
  );
}
