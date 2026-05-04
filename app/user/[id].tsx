import ProfileHeader from '@/components/profile/ProfileHeader';
import { TripCard } from '@/components/profile/TripCard';
import { useThemeColors } from '@/src/hooks/theme/useThemeColors';
import { useOtherUserTrips } from '@/src/hooks/user/useOtherUserTrips';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type TabType = 'trips' | 'reposts' | 'continued';

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('trips');

  const { trips, userProfile, loading, isCloseToBottom, loadMore } =
    useOtherUserTrips(id);

  const theme = useThemeColors();

  if (loading && !userProfile) {
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

  const canSeeTrips = !userProfile?.is_private || userProfile?.is_following;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={{ flex: 1 }}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            position: 'absolute',
            top: 16,
            left: 16,
            zIndex: 50,
            backgroundColor: theme.surface,
            padding: 10,
            borderRadius: 999,
            shadowColor: theme.text,
            shadowOpacity: 0.08,
            shadowRadius: 10,
            elevation: 4,
          }}
        >
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>

        <ScrollView
          className="flex-1"
          stickyHeaderIndices={[1]} // Sekmelerin yukarı yapışmasını sağlar
          onScroll={({ nativeEvent }) => {
            if (isCloseToBottom(nativeEvent)) loadMore();
          }}
          scrollEventThrottle={16}
        >
          {/* 1. Header */}
          <ProfileHeader user={userProfile} isOtherUser={true} />

          {/* 2. Sticky Tab Bar */}
          <View
            style={{
              borderBottomWidth: 1,
              borderBottomColor: theme.border,
              backgroundColor: theme.surface,
            }}
            className="flex-row"
          >
            {(['trips', 'reposts', 'continued'] as TabType[]).map((tab) => {
              const icons: Record<TabType, any> = {
                trips: 'grid-outline',
                reposts: 'repeat-outline',
                continued: 'map-outline',
              };
              const isActive = activeTab === tab;
              return (
                <TouchableOpacity
                  key={tab}
                  onPress={() => setActiveTab(tab)}
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    paddingVertical: 12,
                    borderBottomWidth: 2,
                    borderBottomColor: isActive ? theme.primary : 'transparent',
                  }}
                >
                  <Ionicons
                    name={icons[tab]}
                    size={22}
                    color={isActive ? theme.primary : theme.subtext}
                  />
                </TouchableOpacity>
              );
            })}
          </View>

          {/* 3. İçerik Alanı */}
          <View style={{ minHeight: 500 }}>
            {!canSeeTrips ? (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: 80,
                  paddingHorizontal: 32,
                }}
              >
                <View
                  style={{
                    backgroundColor: theme.surface,
                    padding: 24,
                    borderRadius: 999,
                    marginBottom: 16,
                  }}
                >
                  <Ionicons
                    name="lock-closed"
                    size={40}
                    color={theme.subtext}
                  />
                </View>
                <Text
                  style={{
                    color: theme.text,
                    fontWeight: '700',
                    fontSize: 18,
                    textAlign: 'center',
                  }}
                >
                  Bu Hesap Gizli
                </Text>
                <Text
                  style={{
                    color: theme.subtext,
                    textAlign: 'center',
                    marginTop: 8,
                  }}
                >
                  Rotaları görmek için takip etmelisin.
                </Text>
              </View>
            ) : (
              <View>
                {activeTab === 'trips' && (
                  <View
                    style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      width: '100%',
                    }}
                  >
                    {trips.map((item) => (
                      <TripCard
                        key={item.id}
                        trip={item}
                        onPress={() => router.push(`/trip/${item.id}`)}
                      />
                    ))}
                    {trips.length === 0 && (
                      <Text
                        style={{
                          textAlign: 'center',
                          width: '100%',
                          paddingVertical: 40,
                          color: theme.subtext,
                        }}
                      >
                        Henüz rota yok.
                      </Text>
                    )}
                  </View>
                )}
                {/* Diğer tablar için placeholderlar... */}
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
