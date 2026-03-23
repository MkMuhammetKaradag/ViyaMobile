import { Ionicons } from '@expo/vector-icons'; // Expo ile hazır gelir
import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#4ECDC4',
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="home" // app/(tabs)/home.tsx'i açar
        options={{
          title: 'Ana Sayfa',
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile/index" // app/(tabs)/profile/index.tsx'i açar
        options={{
          headerShown: false,
          title: 'Profil',
          tabBarIcon: ({ color }) => (
            <Ionicons name="person" size={24} color={color} />
          ),
        }}
      />

      {/* profile_edit'i tab barda gizlemek için: */}
      <Tabs.Screen
        name="profile/profile_edit"
        options={{
          href: null, // Alt barda gizler
          headerShown: true, // Düzenleme sayfasında üst başlık olsun
          title: 'Profili Düzenle',
        }}
      />
    </Tabs>
  );
}
