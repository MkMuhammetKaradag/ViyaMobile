import ProfileHeader from '@/components/profile/ProfileHeader';
import { TripCard } from '@/components/profile/TripCard';
import { useThemeColors } from '@/src/hooks/theme/useThemeColors';
import { useLikedTrips } from '@/src/hooks/useLikedTrips';
import { useUserTrips } from '@/src/hooks/useUserTrips';
import { useUserStore } from '@/src/store/useUserStore';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

type TabType = 'myTrips' | 'likedTrips';

const TripSkeleton = () => (
  <View
    style={{ width: width / 3, height: (width / 3) * 1.2 }}
    className="p-[0.5px]"
  >
    <View className="flex-1 bg-gray-200" />
  </View>
);

export default function ProfileScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('myTrips');
  const { user } = useUserStore();

  const myTripsHook = useUserTrips();
  const likedTripsHook = useLikedTrips();

  const gridOpacity = useSharedValue(1);
  const indicatorLeft = useSharedValue(0);

  const gridAnimatedStyle = useAnimatedStyle(() => ({
    opacity: gridOpacity.value,
  }));

  const indicatorAnimatedStyle = useAnimatedStyle(() => ({
    left: indicatorLeft.value,
  }));
  console.log('ProfileScreen render oldu. User:', user);
  useFocusEffect(
    useCallback(() => {
      // Sadece o an aktif olan sekmeyi tazelemek performansı korur
      if (activeTab === 'likedTrips') {
        likedTripsHook.onRefresh();
      } else {
        myTripsHook.onRefresh();
      }
    }, [activeTab]), // activeTab değiştiğinde veya sayfaya dönüldüğünde tetiklenir
  );
  const handleTabChange = (tab: TabType) => {
    if (tab === activeTab) return;

    indicatorLeft.value = withTiming(tab === 'myTrips' ? 0 : width / 2, {
      duration: 200,
    });

    gridOpacity.value = withTiming(0, { duration: 100 }, () => {
      runOnJS(setActiveTab)(tab);
      gridOpacity.value = withTiming(1, { duration: 180 });
    });
  };

  const theme = useThemeColors();

  if (myTripsHook.loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.background,
        }}
      >
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  const currentHook = activeTab === 'myTrips' ? myTripsHook : likedTripsHook;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      showsVerticalScrollIndicator={false}
      stickyHeaderIndices={[1]}
      refreshControl={
        <RefreshControl
          refreshing={currentHook.refreshing}
          onRefresh={currentHook.onRefresh}
          tintColor={theme.primary}
        />
      }
      onScroll={({ nativeEvent }) => {
        if (currentHook.isCloseToBottom(nativeEvent)) {
          currentHook.loadMore();
        }
      }}
      scrollEventThrottle={100}
    >
      <ProfileHeader user={user} />

      <View
        style={{
          borderBottomWidth: 1,
          borderBottomColor: theme.border,
          backgroundColor: theme.surface,
        }}
        className="flex-row"
      >
        <TouchableOpacity
          onPress={() => handleTabChange('myTrips')}
          activeOpacity={0.6}
          style={{ flex: 1, alignItems: 'center', paddingVertical: 16 }}
        >
          <Ionicons
            name="grid-outline"
            size={22}
            color={activeTab === 'myTrips' ? theme.primary : theme.subtext}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleTabChange('likedTrips')}
          activeOpacity={0.6}
          style={{ flex: 1, alignItems: 'center', paddingVertical: 16 }}
        >
          <Ionicons
            name="heart-outline"
            size={24}
            color={activeTab === 'likedTrips' ? theme.primary : theme.subtext}
          />
        </TouchableOpacity>

        <Animated.View
          style={[
            {
              position: 'absolute',
              bottom: 0,
              width: '50%',
              height: 2,
              backgroundColor: theme.primary,
            },
            indicatorAnimatedStyle,
          ]}
        />
      </View>

      <Animated.View style={gridAnimatedStyle}>
        {(['myTrips', 'likedTrips'] as TabType[]).map((tab) => {
          const hook = tab === 'myTrips' ? myTripsHook : likedTripsHook;

          return (
            <View
              key={tab}
              style={{ display: activeTab === tab ? 'flex' : 'none' }}
            >
              <View className="flex-row flex-wrap w-full">
                {hook.trips.map((item) => (
                  <TripCard
                    key={item.id}
                    trip={item}
                    onPress={(id) =>
                      router.push({
                        pathname: '/trip/[id]',
                        params: { id },
                      })
                    }
                  />
                ))}

                {hook.tripsLoading && hook.trips.length === 0 && (
                  <>
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <TripSkeleton key={i} />
                    ))}
                  </>
                )}
              </View>

              {!hook.tripsLoading && hook.trips.length === 0 && (
                <View
                  style={{
                    paddingVertical: 80,
                    alignItems: 'center',
                    width: '100%',
                  }}
                >
                  <Ionicons
                    name={
                      tab === 'myTrips'
                        ? 'map-outline'
                        : 'heart-dislike-outline'
                    }
                    size={40}
                    color={theme.border}
                  />
                  <Text
                    style={{
                      color: theme.subtext,
                      marginTop: 8,
                      fontWeight: '500',
                    }}
                  >
                    {tab === 'myTrips'
                      ? 'Henüz rota oluşturmadın.'
                      : 'Beğendiğin rota bulunamadı.'}
                  </Text>
                </View>
              )}

              <View className="w-full py-10">
                {hook.tripsLoading && hook.trips.length > 0 ? (
                  <ActivityIndicator size="small" color="#4ECDC4" />
                ) : (
                  hook.hasMore && (
                    <TouchableOpacity
                      onPress={hook.loadMore}
                      style={{ alignItems: 'center' }}
                    >
                      <Text style={{ color: theme.primary, fontWeight: '700' }}>
                        Daha Fazla Göster
                      </Text>
                    </TouchableOpacity>
                  )
                )}

                {!hook.hasMore && hook.trips.length > 0 && (
                  <Text
                    style={{
                      color: theme.subtext,
                      textAlign: 'center',
                      fontSize: 12,
                    }}
                  >
                    Tüm rotalar yüklendi
                  </Text>
                )}
              </View>
            </View>
          );
        })}
      </Animated.View>
    </ScrollView>
  );
}
