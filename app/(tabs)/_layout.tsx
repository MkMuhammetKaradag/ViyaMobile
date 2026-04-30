import ScreenWrapper from '@/components/common/ScreenWrapper';
import { Ionicons } from '@expo/vector-icons'; // Expo ile hazır gelir
import { Tabs, useRouter } from 'expo-router';

import { Platform, useColorScheme } from 'react-native';

export default function TabsLayout() {
  const router = useRouter();
  const colorScheme = useColorScheme();

  const isDark = colorScheme === 'dark';
  const themeColor = isDark ? '#000000' : '#FFFFFF';

  return (
    <ScreenWrapper>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#4ECDC4',
          tabBarInactiveTintColor: '#94a3b8',
          tabBarStyle: {
            backgroundColor: themeColor,
            borderTopWidth: 1,
            borderTopColor: isDark ? '#1e293b' : '#f1f5f9',
            height: Platform.OS === 'ios' ? 88 : 65, // iOS için standart yükseklik
            paddingBottom: Platform.OS === 'ios' ? 30 : 10,
            paddingTop: 10,
            elevation: 0, // Android alt gölgesini sıfırla (beyazlık yapabilir)
            shadowOpacity: 0, // iOS gölgesini sıfırla
          },
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="home/index"
          options={{
            title: '',
            tabBarIcon: ({ color }) => (
              <Ionicons name="home" size={26} color={color} />
            ),
          }}
        />
        {/* 🧭 KEŞFET (ANA SAYFA) */}
        <Tabs.Screen
          name="explore/index"
          options={{
            title: '',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? 'compass' : 'compass-outline'}
                size={28}
                color={color}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="create-trip-handler" // Gerçek bir dosya olmasına gerek yok
          options={{
            title: '', // Yazı olmasın
            tabBarIcon: ({ color }) => (
              <Ionicons
                name="add-circle"
                size={26}
                color={color}
                // style={{ marginBottom: 4 }} // Biraz yukarı taşsın
              />
            ),
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault(); // Sayfaya gitmesini engelle
              router.push('/trip/create'); // Bizim modalı aç!
            },
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: '',
            tabBarIcon: ({ color }) => (
              <Ionicons name="person" size={26} color={color} />
            ),
          }}
        />
      </Tabs>
    </ScreenWrapper>
  );
}
