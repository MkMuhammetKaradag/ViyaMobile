import { apiClient } from '@/src/api/client';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

interface Category {
  id: string;
  name: string;
}

interface Props {
  selectedCategory: Category | null;
  onSelect: (category: Category | null) => void;
  label: string;
}

export const CategorySearchPicker = ({
  selectedCategory,
  onSelect,
  label,
}: Props) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Input ref — modal açıldığında otomatik focus için
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length > 1) searchCategories();
      else setResults([]);
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  const searchCategories = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(
        `/api/v1/categories/search?search_query=${query}`,
      );
      setResults(response.data.categories || []);
    } catch (error) {
      console.error('Kategori arama hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setQuery('');
    setResults([]);
    setModalVisible(true);
    // Modal render olduktan sonra focus ver
    setTimeout(() => inputRef.current?.focus(), 150);
  };

  const handleSelect = (item: Category) => {
    onSelect(item);
    setModalVisible(false);
    setQuery('');
    setResults([]);
  };

  const handleClose = () => {
    Keyboard.dismiss();
    setModalVisible(false);
    setQuery('');
    setResults([]);
  };

  return (
    <View className="mb-4">
      <Text className="text-gray-400 text-[10px] font-black uppercase mb-2 ml-1">
        {label}
      </Text>

      {/* Seçili kategori veya açma butonu */}
      <TouchableOpacity
        onPress={handleOpen}
        className="flex-row items-center bg-white border border-gray-100 p-4 rounded-2xl shadow-sm"
      >
        <Ionicons
          name={selectedCategory ? 'checkmark-circle' : 'search'}
          size={18}
          color={selectedCategory ? '#4ECDC4' : '#94a3b8'}
        />
        <Text
          className={`flex-1 ml-3 font-bold ${
            selectedCategory ? 'text-gray-800' : 'text-gray-400'
          }`}
        >
          {selectedCategory ? selectedCategory.name : 'Kategori ara...'}
        </Text>
        {selectedCategory && (
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              onSelect(null);
            }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="close-circle" size={18} color="#94a3b8" />
          </TouchableOpacity>
        )}
      </TouchableOpacity>

      {/* Modal — klavye katmanının üzerinde render edilir */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={handleClose}
      >
        {/* Arka plan — tıklanınca kapat */}
        <TouchableWithoutFeedback onPress={handleClose}>
          <View className="flex-1 bg-black/40" />
        </TouchableWithoutFeedback>

        {/* Arama paneli — ekranın alt kısmında */}
        <View className="bg-white rounded-t-3xl px-6 pt-4 pb-8">
          {/* Tutamaç çizgisi */}
          <View className="w-10 h-1 bg-gray-200 rounded-full self-center mb-4" />

          <Text className="text-base font-black text-gray-800 mb-3">
            Kategori Seç
          </Text>

          {/* Arama input */}
          <View className="flex-row items-center bg-gray-50 border border-gray-100 px-4 rounded-2xl mb-3">
            <Ionicons name="search" size={18} color="#94a3b8" />
            <TextInput
              ref={inputRef}
              placeholder="Kategori ara..."
              className="flex-1 ml-3 py-4 font-bold text-gray-800"
              value={query}
              onChangeText={setQuery}
              returnKeyType="search"
              autoCorrect={false}
            />
            {loading && <ActivityIndicator size="small" color="#4ECDC4" />}
            {query.length > 0 && !loading && (
              <TouchableOpacity
                onPress={() => {
                  setQuery('');
                  setResults([]);
                }}
              >
                <Ionicons name="close" size={18} color="#94a3b8" />
              </TouchableOpacity>
            )}
          </View>

          {/* Sonuç listesi */}
          {results.length > 0 ? (
            results.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => handleSelect(item)}
                className="flex-row justify-between items-center py-3 border-b border-gray-50"
              >
                <Text className="font-bold text-gray-700">{item.name}</Text>
                <Ionicons name="add-circle-outline" size={20} color="#4ECDC4" />
              </TouchableOpacity>
            ))
          ) : query.length > 1 && !loading ? (
            <Text className="text-gray-400 italic text-center py-6">
              Kategori bulunamadı...
            </Text>
          ) : query.length === 0 ? (
            <Text className="text-gray-400 text-center py-6 text-sm">
              Aramak istediğiniz kategoriyi yazın
            </Text>
          ) : null}
        </View>
      </Modal>
    </View>
  );
};
