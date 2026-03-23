import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className=" p-4">
        <Text className="text-2xl font-bold text-gray-800">Profilim</Text>

        {/* Düzenle Butonu */}
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/profile/profile_edit')}
          className="mt-4 bg-indigo-600 p-4 rounded-xl items-center shadow-md"
        >
          <Text className="text-white font-semibold">Profili Düzenle</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
