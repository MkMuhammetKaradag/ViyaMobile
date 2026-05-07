import { useThemeColors } from '@/src/hooks/theme/useThemeColors';
import { Ionicons } from '@expo/vector-icons';
import { Href, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function SettingsScreen() {
  const router = useRouter();
  const theme = useThemeColors();
  interface MenuItem {
    id: string;
    title: string;
    icon: string;
    path?: Href;
    color?: string;
    count?: number;
    action?: () => void;
  }
  const menuItems: MenuItem[] = [
    {
      id: 'edit',
      title: 'Profili Düzenle',
      icon: 'person-outline',
      path: '/(tabs)/profile/profile_edit',
    },
    {
      id: 'requests',
      title: 'Takip İstekleri',
      icon: 'people-outline',
      count: 5,
      path: '/(tabs)/profile/settings/requests',
    },
    {
      id: 'preferences',
      title: 'İlgi Alanlarını Sıfırla',
      icon: 'options-outline',
      path: '/(tabs)/profile/settings/preferences',
    },
    {
      id: 'logout',
      title: 'Çıkış Yap',
      icon: 'log-out-outline',
      color: '#FF5252',
      action: () => {
        /* Çıkış mantığı */
      },
    },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={{ padding: 20 }}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() =>
              item.path ? router.push(item.path) : item.action?.()
            }
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 18,
              backgroundColor: theme.surface,
              borderRadius: 16,
              marginBottom: 12,

              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 4,

              elevation: 2,
            }}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                backgroundColor: item.color
                  ? `${item.color}15`
                  : `${theme.primary}15`,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Ionicons
                name={item.icon as any}
                size={22}
                color={item.color || theme.primary}
              />
            </View>

            <Text
              style={{
                flex: 1,
                marginLeft: 15,
                color: item.color || theme.text,
                fontWeight: '600',
                fontSize: 16,
              }}
            >
              {item.title}
            </Text>

            {item.count ? (
              <View
                style={{
                  backgroundColor: theme.primary,
                  borderRadius: 20, // Tam yuvarlak
                  minWidth: 24,
                  height: 24,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 8,
                  paddingHorizontal: 6,
                }}
              >
                <Text
                  style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}
                >
                  {item.count}
                </Text>
              </View>
            ) : null}

            <Ionicons name="chevron-forward" size={18} color={theme.subtext} />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
