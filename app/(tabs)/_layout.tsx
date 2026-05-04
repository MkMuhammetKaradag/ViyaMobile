import ScreenWrapper from '@/components/common/ScreenWrapper';
import { useThemeColors } from '@/src/hooks/theme/useThemeColors';
import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import { Platform } from 'react-native';

export default function TabsLayout() {
  const router = useRouter();
  const theme = useThemeColors();

  return (
    // ScreenWrapper zaten arka planı ve status barı hallediyor
    <ScreenWrapper>
      <Tabs
        screenOptions={{
          // 3. Renkleri artık theme objesinden dinamik çekiyoruz
          tabBarActiveTintColor: theme.primary,
          tabBarInactiveTintColor: theme.subtext,
          tabBarStyle: {
            backgroundColor: theme.background, // themeColor yerine theme.background
            borderTopWidth: 1,
            borderTopColor: theme.border, // border rengi de dinamik
            height: Platform.OS === 'ios' ? 88 : 65,
            paddingBottom: Platform.OS === 'ios' ? 30 : 10,
            paddingTop: 10,
            elevation: 0,
            shadowOpacity: 0,
          },
          headerShown: false,
        }}
      >
        {/* Ekranlar aynı kalıyor, sadece ikon renkleri tabBarActiveTintColor'dan otomatik beslenir */}
        <Tabs.Screen
          name="home/index"
          options={{
            title: '',
            tabBarIcon: ({ color }) => (
              <Ionicons name="home" size={26} color={color} />
            ),
          }}
        />

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
          name="create-trip-handler"
          options={{
            title: '',
            tabBarIcon: ({ color }) => (
              <Ionicons name="add-circle" size={26} color={color} />
            ),
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              router.push('/trip/create');
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
