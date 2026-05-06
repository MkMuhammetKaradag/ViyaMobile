import { apiClient } from '@/src/api/client';
import { useThemeColors } from '@/src/hooks/theme/useThemeColors';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface FollowRequest {
  follower_id: string;
  username: string;
  avatar_url: string;
  created_at: string;
}

export default function  () {
  const theme = useThemeColors();
  const [requests, setRequests] = useState<FollowRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. İstekleri Getir
  const fetchRequests = async () => {
    try {
      const response = await apiClient.get('/api/v1/social/pending-requests');
      setRequests(response.data.requests || []);
    } catch (error) {
      console.error('İstekler çekilemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // 2. İsteği Yönet (Onayla/Reddet)
  const handleAction = async (
    followerId: string,
    action: 'accept' | 'reject',
  ) => {
    try {
      // Backend tarafındaki endpoint'ine göre burayı güncelle
      // Örn: POST /api/v1/social/follow-request/resolve

      // İşlem başarılıysa listeden kaldır
      //   setRequests((prev) =>
      //     prev.filter((req) => req.follower_id !== followerId),
      //   );

      Alert.alert(
        'Başarılı',
        action === 'accept' ? 'Takip isteği onaylandı.' : 'İstek reddedildi.',
      );
    } catch (error) {
      Alert.alert('Hata', 'İşlem gerçekleştirilemedi.');
    }
  };

  if (loading) {
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

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      {/* Header */}
      <View
        style={{
          padding: 20,
          borderBottomWidth: 1,
          borderBottomColor: theme.border,
        }}
      >
        <Text style={{ fontSize: 24, fontWeight: '900', color: theme.text }}>
          Takip İstekleri
        </Text>
      </View>

      <FlatList
        data={requests}
        keyExtractor={(item) => item.follower_id}
        ListEmptyComponent={() => (
          <View style={{ flex: 1, alignItems: 'center', marginTop: 100 }}>
            <Ionicons name="people-outline" size={64} color={theme.border} />
            <Text style={{ color: theme.subtext, marginTop: 16, fontSize: 16 }}>
              Şu an bekleyen istek yok.
            </Text>
          </View>
        )}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 16,
              borderBottomWidth: 1,
              borderBottomColor: theme.border,
              backgroundColor: theme.surface,
            }}
          >
            <Image
              source={{ uri: item.avatar_url }}
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: theme.border,
              }}
            />

            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text
                style={{ color: theme.text, fontWeight: '700', fontSize: 16 }}
              >
                @{item.username}
              </Text>
              <Text style={{ color: theme.subtext, fontSize: 12 }}>
                {new Date(item.created_at).toLocaleDateString('tr-TR')}
              </Text>
            </View>

            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                onPress={() => handleAction(item.follower_id, 'accept')}
                style={{
                  backgroundColor: theme.primary,
                  padding: 8,
                  borderRadius: 8,
                  marginRight: 8,
                }}
              >
                <Ionicons name="checkmark" size={20} color="white" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleAction(item.follower_id, 'reject')}
                style={{
                  backgroundColor: theme.border,
                  padding: 8,
                  borderRadius: 8,
                }}
              >
                <Ionicons name="close" size={20} color={theme.text} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}
