import { Stack } from 'expo-router';

export default function ProfileStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      {/* presentaton: 'modal' yaparak sayfanın aşağıdan yukarı açılmasını sağlayabilirsin (Opsiyonel) */}
      <Stack.Screen name="profile_edit" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
