import { useUserSearch } from '@/src/hooks/useUserSearch';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isSearched, setIsSearched] = useState(false); // Büyütece basıldı mı?
  const [activeTab, setActiveTab] = useState('accounts');

  const { users, loading, loadMoreUsers } = useUserSearch(query);

  // Klavyedeki arama butonuna basılınca
  const handleSearchSubmit = () => {
    if (query.length >= 2) {
      setIsSearched(true);
    }
  };

  // Yazı değiştiğinde isSearched'i sıfırlayalım (isteğe bağlı)
  const handleTextChange = (text: string) => {
    setQuery(text);
    if (text.length === 0) setIsSearched(false);
  };

  return (
    <View className="flex-1 bg-white pt-12">
      {/* Search Header */}
      <View className="flex-row items-center px-4 mb-2">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        <View className="flex-1 flex-row items-center bg-gray-100 rounded-xl px-3 py-1.5">
          <TextInput
            placeholder="Kullanıcı ara..."
            autoFocus
            value={query}
            onChangeText={handleTextChange}
            onSubmitEditing={handleSearchSubmit} // Klavyedeki ara/büyüteç butonu
            returnKeyType="search" // Klavyede büyüteç ikonu çıkartır
            className="flex-1 text-base py-1"
          />
          {query.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setQuery('');
                setIsSearched(false);
              }}
            >
              <Ionicons name="close-circle" size={18} color="#94a3b8" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {isSearched && (
        <View className="flex-row border-b border-gray-100">
          {[
            { id: 'all', label: 'Senin İçin' },
            { id: 'accounts', label: 'Hesaplar' },
            { id: 'categories', label: 'Kategoriler' },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 items-center ${activeTab === tab.id ? 'border-b-2 border-black' : ''}`}
            >
              <Text
                className={`text-sm ${activeTab === tab.id ? 'font-bold text-black' : 'text-gray-500'}`}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* SONUÇ LİSTESİ */}
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        onEndReached={loadMoreUsers}
        onEndReachedThreshold={0.4}
        renderItem={({ item }) => {
          // Tablar arası mantık burada ayrılacak
          if (activeTab === 'categories') {
            // Şimdilik boş ama sonra etiket kartı gelecek
            return null;
          }

          // 'all' (Senin İçin) ve 'accounts' için kullanıcı satırı
          return (
            <TouchableOpacity
              onPress={() =>
                router.push({ pathname: '/user/[id]', params: { id: item.id } })
              }
              className="flex-row items-center px-4 py-3"
            >
              <View className="w-12 h-12 rounded-full bg-gray-200" />
              <View className="ml-3">
                <Text className="font-bold">@{item.username}</Text>
                <Text className="text-gray-500 text-sm">
                  {item.first_name} {item.last_name}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
        ListFooterComponent={() =>
          loading && <ActivityIndicator className="my-4" color="#4ECDC4" />
        }
      />
    </View>
  );
}
