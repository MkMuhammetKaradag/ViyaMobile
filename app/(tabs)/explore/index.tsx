import { ExploreTripCard } from '@/components/explore/ExploreTripCard';
import { useThemeColors } from '@/src/hooks/theme/useThemeColors';
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

  const theme = useThemeColors();

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
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
          <View style={{ paddingHorizontal: 12, paddingVertical: 12 }}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push('/search')}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: theme.surface,
                borderRadius: 24,
                paddingHorizontal: 16,
                paddingVertical: 14,
                borderWidth: 1,
                borderColor: theme.border,
              }}
            >
              <Ionicons name="search" size={20} color={theme.subtext} />
              <Text
                style={{ marginLeft: 8, fontSize: 16, color: theme.subtext }}
              >
                Kullanıcı veya gezi ara...
              </Text>
            </TouchableOpacity>
          </View>
        }
        ListFooterComponent={() =>
          loading && (
            <ActivityIndicator
              style={{ marginVertical: 32 }}
              color={theme.primary}
            />
          )
        }
      />
    </View>
  );
}
