import ProfileHeader from '@/components/profile/ProfileHeader';
import { TripCard } from '@/components/profile/TripCard';
import { useLikedTrips } from '@/src/hooks/useLikedTrips';
import { useUserTrips } from '@/src/hooks/useUserTrips';
import { useUserStore } from '@/src/store/useUserStore';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
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

  if (myTripsHook.loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#4ECDC4" />
      </View>
    );
  }

  const currentHook = activeTab === 'myTrips' ? myTripsHook : likedTripsHook;

  return (
    <View className="flex-1 bg-white">
    
      <ProfileHeader user={user} />

     
      <View className="flex-row border-b border-gray-100 relative bg-white">
        <TouchableOpacity
          onPress={() => handleTabChange('myTrips')}
          activeOpacity={0.6}
          className="flex-1 items-center py-4"
        >
          <Ionicons
            name="grid-outline"
            size={22}
            color={activeTab === 'myTrips' ? '#4ECDC4' : '#9CA3AF'}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleTabChange('likedTrips')}
          activeOpacity={0.6}
          className="flex-1 items-center py-4"
        >
          <Ionicons
            name="heart-outline"
            size={24}
            color={activeTab === 'likedTrips' ? '#4ECDC4' : '#9CA3AF'}
          />
        </TouchableOpacity>

        
        <Animated.View
          style={[
            {
              position: 'absolute',
              bottom: 0,
              width: '50%',
              height: 2,
              backgroundColor: '#4ECDC4',
            },
            indicatorAnimatedStyle,
          ]}
        />
      </View>

    
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={currentHook.refreshing}
            onRefresh={currentHook.onRefresh}
            tintColor="#4ECDC4"
          />
        }
        onScroll={({ nativeEvent }) => {
          if (currentHook.isCloseToBottom(nativeEvent)) {
            currentHook.loadMore();
          }
        }}
        scrollEventThrottle={100}
      >
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
                  <View className="py-20 items-center w-full">
                    <Ionicons
                      name={
                        tab === 'myTrips'
                          ? 'map-outline'
                          : 'heart-dislike-outline'
                      }
                      size={40}
                      color="#D1D5DB"
                    />
                    <Text className="text-gray-400 mt-2 font-medium">
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
                        className="items-center"
                      >
                        <Text className="text-[#4ECDC4] font-bold">
                          Daha Fazla Göster
                        </Text>
                      </TouchableOpacity>
                    )
                  )}

                  {!hook.hasMore && hook.trips.length > 0 && (
                    <Text className="text-gray-400 text-center text-xs">
                      Tüm rotalar yüklendi
                    </Text>
                  )}
                </View>
              </View>
            );
          })}
        </Animated.View>
      </ScrollView>
    </View>
  );
}
