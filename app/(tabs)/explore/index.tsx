import { ExploreTripCard } from '@/components/explore/ExploreTripCard';
import { useExplore } from '@/src/hooks/useExplore';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function ExploreScreen() {
  const router = useRouter();
  const { trips, loading, refreshing, onRefresh, loadMore } = useExplore();

  return (
    <View className="flex-1 bg-red">
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
        // LİSTE BAŞLIĞI: Burası artık sadece bir buton!
        ListHeaderComponent={
          <View className="px-3 py-4 ">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push('/search')} // Dokunulduğu an yeni sayfaya uçurur
              className="flex-row items-center bg-gray-100 rounded-xl px-3 py-3 border border-gray-200"
            >
              <Ionicons name="search" size={20} color="#94a3b8" />
              <Text className="ml-2 text-base text-gray-400">
                Kullanıcı veya gezi ara...
              </Text>
            </TouchableOpacity>
          </View>
        }
        ListFooterComponent={() =>
          loading && <ActivityIndicator className="my-8" color="#4ECDC4" />
        }
      />
    </View>
  );
}
