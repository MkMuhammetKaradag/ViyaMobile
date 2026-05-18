import ScreenWrapper from '@/components/common/ScreenWrapper';
import { useThemeColors } from '@/src/hooks/theme/useThemeColors';
import { useUserStore } from '@/src/store/useUserStore';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import { router, useFocusEffect } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { apiClient } from '../../../src/api/client';

// Backend'den gelen veri tipi
interface Trip {
  id: string;
  user_id: string;
  title: string;
  display_image: string | null;
  total_likes: number;
  total_comments: number;
  view_count: number;
  waypoint_count: number;
  owner_username: string;
  owner_avatar: string | null;
  published_at: string;
}

export default function HomeScreen() {
  const colors = useThemeColors();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { user } = useUserStore();
  const fetchHomeFeed = async (
    pageNum: number,
    isRefresh = false,
    signal?: AbortSignal,
  ) => {
    // 🛑 KORUMA DUVARI: Eğer kullanıcı çıkış yaptıysa veya oturumu yoksa İSTEK ATMA!
    if (!user) {
      return;
    }

    try {
      const res = await apiClient.get(
        `/api/v1/trips/home-feed?page=${pageNum}&limit=10`,
        { signal }, // İptal sinyalini bağladık
      );
      const newTrips = res.data.trips || [];

      if (isRefresh) {
        setTrips(newTrips);
      } else {
        setTrips((prev) => [...prev, ...newTrips]);
      }

      if (newTrips.length < 5) setHasMore(false);
    } catch (error) {
      if (axios.isCancel(error)) return; // İstek bizim tarafımızdan iptal edildiyse hata basma
      console.error('Feed error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      // Eğer kullanıcı zaten yoksa hiç başlama
      if (!user) return;

      const controller = new AbortController();
      fetchHomeFeed(1, true, controller.signal);

      // Kullanıcı Settings'e gidip çıkış yaptığında veya sekmeyi değiştirdiğinde:
      return () => {
        controller.abort(); // Ağ isteğini anında keser
      };
    }, [user]), // user değiştiğinde de tetiklenmesi için bağımlılık ekledik
  );

  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    setHasMore(true);
    fetchHomeFeed(1, true);
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchHomeFeed(nextPage);
    }
  };

  const renderTripItem = ({ item }: { item: Trip }) => (
    <TouchableOpacity
      onPress={() => router.push(`/trip/${item.id}`)}
      style={{
        backgroundColor: colors.surface,
        borderRadius: 20,
        marginBottom: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      {/* Header: Kullanıcı Bilgisi */}
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 12 }}>
        <Image
          source={{
            uri: item.owner_avatar || 'https://via.placeholder.com/40',
          }}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: colors.border,
          }}
        />
        <View style={{ marginLeft: 10, flex: 1 }}>
          <Text style={{ color: colors.text, fontWeight: '700' }}>
            {item.owner_username}
          </Text>
          <Text style={{ color: colors.subtext, fontSize: 11 }}>
            {formatDistanceToNow(new Date(item.published_at), {
              addSuffix: true,
              locale: tr,
            })}
          </Text>
        </View>
        <TouchableOpacity>
          <Ionicons
            name="ellipsis-horizontal"
            size={20}
            color={colors.subtext}
          />
        </TouchableOpacity>
      </View>

      {/* Ana Görsel */}
      <View
        style={{ width: '100%', height: 300, backgroundColor: colors.border }}
      >
        {item.display_image ? (
          <Image
            source={{ uri: item.display_image }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
        ) : (
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <Ionicons name="image-outline" size={48} color={colors.subtext} />
          </View>
        )}
        {/* Durak Sayısı Badge */}
        <View
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            backgroundColor: 'rgba(0,0,0,0.6)',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: 'white', fontSize: 12 }}>
            📍 {item.waypoint_count} Durak
          </Text>
        </View>
      </View>

      {/* Alt Kısım: Başlık ve Sosyal Kanıtlar */}
      <View style={{ padding: 12 }}>
        <Text
          style={{
            color: colors.text,
            fontSize: 16,
            fontWeight: '800',
            marginBottom: 8,
          }}
        >
          {item.title}
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="heart-outline" size={20} color={colors.primary} />
            <Text
              style={{ color: colors.text, marginLeft: 4, fontWeight: '600' }}
            >
              {item.total_likes}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons
              name="chatbubble-outline"
              size={18}
              color={colors.primary}
            />
            <Text
              style={{ color: colors.text, marginLeft: 4, fontWeight: '600' }}
            >
              {item.total_comments}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="eye-outline" size={18} color={colors.subtext} />
            <Text style={{ color: colors.subtext, marginLeft: 4 }}>
              {item.view_count}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper>
      <TouchableOpacity style={{ flex: 1, backgroundColor: colors.background }}>
        {/* Navbar */}
        <View
          style={{
            paddingHorizontal: 20,
            paddingVertical: 15,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 24, fontWeight: '900', color: colors.text }}>
            Viya
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/profile/settings')}
          >
            <Ionicons
              name="notifications-outline"
              size={26}
              color={colors.text}
            />
          </TouchableOpacity>
        </View>

        <FlatList
          data={trips}
          renderItem={renderTripItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() =>
            hasMore ? (
              <ActivityIndicator
                style={{ margin: 20 }}
                color={colors.primary}
              />
            ) : null
          }
          ListEmptyComponent={() =>
            !loading ? (
              <View style={{ alignItems: 'center', marginTop: 100 }}>
                <Ionicons name="map-outline" size={64} color={colors.border} />
                <Text style={{ color: colors.subtext, marginTop: 10 }}>
                  Henüz gezi yok. Keşfetmeye başla!
                </Text>
              </View>
            ) : null
          }
        />
      </TouchableOpacity>
    </ScreenWrapper>
  );
}
