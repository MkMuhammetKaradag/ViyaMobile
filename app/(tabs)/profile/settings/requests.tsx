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
  user_id: string; // Gönderilenlerde bu 'following_id' olacak ama API'den aynı field adı geliyorsa kalsın
  username: string;
  avatar_url: string;
  created_at: string;
}

type RequestTab = 'incoming' | 'outgoing';

export default function FollowRequestsScreen() {
  const theme = useThemeColors();
  const [activeTab, setActiveTab] = useState<RequestTab>('incoming');
  const [requests, setRequests] = useState<FollowRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Verileri Çek
  const fetchRequests = async (tab: RequestTab) => {
    setLoading(true);
    try {
      const endpoint =
        tab === 'incoming'
          ? '/api/v1/social/pending-requests'
          : '/api/v1/social/sent-follow-requests'; // Senin yeni endpointin

      const response = await apiClient.get(endpoint);
      setRequests(response.data.requests || []);
    } catch (error) {
      console.error('İstekler çekilemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests(activeTab);
  }, [activeTab]);

  const handleAction = async (
    followerId: string,
    action: 'ACCEPT' | 'REJECT' | 'CANCEL',
  ) => {
    try {
      if (action === 'CANCEL') {
        await apiClient.post(`/api/v1/social/unfollow/${followerId}`);
      } else {
        await apiClient.post(`/api/v1/social/follow-request/${followerId}`, {
          action: action,
        });
      }

      setRequests((prev) => prev.filter((req) => req.user_id !== followerId));

      Alert.alert(
        'Başarılı',
        action === 'ACCEPT' ? 'Takip isteği kabul edildi.' : 'İstek silindi.',
      );
    } catch (error: any) {
      console.error('İşlem hatası:', error.response?.data || error.message);
      Alert.alert('Hata', 'İşlem gerçekleştirilemedi. Lütfen tekrar deneyin.');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      {/* Custom Tab Switcher */}
      <View
        style={{
          flexDirection: 'row',
          padding: 10,
          backgroundColor: theme.surface,
        }}
      >
        <TouchableOpacity
          onPress={() => setActiveTab('incoming')}
          style={{
            flex: 1,
            padding: 12,
            alignItems: 'center',
            borderBottomWidth: 2,
            borderBottomColor:
              activeTab === 'incoming' ? theme.primary : 'transparent',
          }}
        >
          <Text
            style={{
              color: activeTab === 'incoming' ? theme.primary : theme.subtext,
              fontWeight: '700',
            }}
          >
            Gelenler
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('outgoing')}
          style={{
            flex: 1,
            padding: 12,
            alignItems: 'center',
            borderBottomWidth: 2,
            borderBottomColor:
              activeTab === 'outgoing' ? theme.primary : 'transparent',
          }}
        >
          <Text
            style={{
              color: activeTab === 'outgoing' ? theme.primary : theme.subtext,
              fontWeight: '700',
            }}
          >
            Gidenler
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator color={theme.primary} />
        </View>
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item) => item.user_id}
          ListEmptyComponent={() => (
            <View style={{ alignItems: 'center', marginTop: 100 }}>
              <Ionicons name="mail-outline" size={64} color={theme.border} />
              <Text style={{ color: theme.subtext, marginTop: 16 }}>
                İstek bulunmuyor.
              </Text>
            </View>
          )}
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 16,
                backgroundColor: theme.surface,
                marginBottom: 1,
              }}
            >
              <Image
                source={{ uri: item.avatar_url }}
                style={{ width: 45, height: 45, borderRadius: 22 }}
              />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={{ color: theme.text, fontWeight: '700' }}>
                  @{item.username}
                </Text>
                <Text style={{ color: theme.subtext, fontSize: 11 }}>
                  {new Date(item.created_at).toLocaleDateString()}
                </Text>
              </View>

              {activeTab === 'incoming' ? (
                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity
                    onPress={() => handleAction(item.user_id, 'ACCEPT')}
                    style={{
                      backgroundColor: theme.primary,
                      padding: 8,
                      borderRadius: 6,
                      marginRight: 5,
                    }}
                  >
                    <Ionicons name="checkmark" size={18} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleAction(item.user_id, 'REJECT')}
                    style={{
                      backgroundColor: theme.border,
                      padding: 8,
                      borderRadius: 6,
                    }}
                  >
                    <Ionicons name="close" size={18} color={theme.text} />
                  </TouchableOpacity>
                </View>
              ) : (
                // Giden isteklerde sadece "İptal Et" butonu
                <TouchableOpacity
                  onPress={() => handleAction(item.user_id, 'CANCEL')}
                  style={{
                    backgroundColor: theme.border,
                    paddingVertical: 6,
                    paddingHorizontal: 12,
                    borderRadius: 6,
                  }}
                >
                  <Text
                    style={{
                      color: theme.text,
                      fontSize: 12,
                      fontWeight: '600',
                    }}
                  >
                    İptal Et
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
}
