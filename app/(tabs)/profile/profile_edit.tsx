import { useRouter } from 'expo-router';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ProfileEditScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white p-6">
      <Text className="text-gray-500 mb-2">Bio</Text>
      <TextInput
        className="border border-gray-200 p-3 rounded-xl mb-4"
        placeholder="Kendinden bahset..."
        multiline
      />

      <Text className="text-gray-500 mb-2">Şehir</Text>
      <TextInput
        className="border border-gray-200 p-3 rounded-xl mb-4"
        placeholder="Örn: İstanbul"
      />

      <TouchableOpacity
        className="bg-indigo-600 p-4 rounded-2xl items-center mt-4"
        onPress={() => router.back()}
      >
        <Text className="text-white font-bold">Güncelle</Text>
      </TouchableOpacity>
    </View>
  );
}
