import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';

export default function AuthLayout() {
  const colorScheme = useColorScheme();

  // 2. Temaya göre renkleri belirliyoruz
  const isDark = colorScheme === 'dark';
  // const themeColor = isDark ? '#000000' : '#FFFFFF';
  // const statusBarStyle = isDark ? 'light-content' : 'dark-content';
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: '#FFFFFF' },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="forgot-password" />
    </Stack>
  );
}
