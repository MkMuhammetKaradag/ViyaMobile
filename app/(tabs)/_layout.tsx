import { Ionicons } from '@expo/vector-icons'; // Expo ile hazır gelir
import { Tabs, useRouter } from 'expo-router';

export default function TabsLayout() {
  const router = useRouter();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#4ECDC4',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: {
          // height: 60,
          // paddingBottom: 20,
          // paddingTop: 8,s
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
  );
}
