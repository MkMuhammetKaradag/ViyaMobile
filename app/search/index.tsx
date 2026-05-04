import { useThemeColors } from '@/src/hooks/theme/useThemeColors';
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

  const theme = useThemeColors();

  return (
    <View
      style={{ flex: 1, backgroundColor: theme.background, paddingTop: 48 }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          marginBottom: 8,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginRight: 12 }}
        >
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>

        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.surface,
            borderRadius: 24,
            paddingHorizontal: 12,
            paddingVertical: 8,
          }}
        >
          <TextInput
            placeholder="Kullanıcı ara..."
            placeholderTextColor={theme.placeholder}
            autoFocus
            value={query}
            onChangeText={handleTextChange}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
            style={{
              flex: 1,
              fontSize: 16,
              color: theme.text,
              paddingVertical: 2,
            }}
          />
          {query.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setQuery('');
                setIsSearched(false);
              }}
            >
              <Ionicons name="close-circle" size={18} color={theme.subtext} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {isSearched && (
        <View
          style={{
            flexDirection: 'row',
            borderBottomWidth: 1,
            borderBottomColor: theme.border,
          }}
        >
          {[
            { id: 'all', label: 'Senin İçin' },
            { id: 'accounts', label: 'Hesaplar' },
            { id: 'categories', label: 'Kategoriler' },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                paddingVertical: 12,
                alignItems: 'center',
                borderBottomWidth: activeTab === tab.id ? 2 : 0,
                borderBottomColor:
                  activeTab === tab.id ? theme.primary : 'transparent',
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: activeTab === tab.id ? '800' : '400',
                  color: activeTab === tab.id ? theme.text : theme.subtext,
                }}
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
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 16,
                paddingVertical: 12,
              }}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 999,
                  backgroundColor: theme.surface,
                }}
              />
              <View style={{ marginLeft: 12 }}>
                <Text style={{ color: theme.text, fontWeight: '700' }}>
                  @{item.username}
                </Text>
                <Text style={{ color: theme.subtext, fontSize: 12 }}>
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
