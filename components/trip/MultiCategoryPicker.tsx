// components/trip/MultiCategoryPicker.tsx
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
  selectedCategories: Category[];
  onAdd: (category: Category) => void;
  onRemove: (categoryId: string) => void;
  label: string;
}

export const MultiCategoryPicker = ({
  selectedCategories,
  onAdd,
  onRemove,
  label,
}: Props) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
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
      // Zaten seçili olanları filtrele
      const filtered = (response.data.categories || []).filter(
        (cat: Category) => !selectedCategories.find((s) => s.id === cat.id),
      );
      setResults(filtered);
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
    setTimeout(() => inputRef.current?.focus(), 150);
  };

  const handleSelect = (item: Category) => {
    onAdd(item);
    // Modalı kapatma — birden fazla seçim yapılabilsin
    setQuery('');
    setResults([]);
    setTimeout(() => inputRef.current?.focus(), 100);
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

      {/* Seçili kategoriler — chip listesi */}
      {selectedCategories.length > 0 && (
        <View className="flex-row flex-wrap gap-2 mb-3">
          {selectedCategories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              onPress={() => onRemove(cat.id)}
              className="flex-row items-center bg-[#4ECDC4]/15 px-3 py-1.5 rounded-full border border-[#4ECDC4]/30"
            >
              <Text className="text-[#2BA89E] font-bold text-xs mr-1.5">
                {cat.name}
              </Text>
              <Ionicons name="close-circle" size={14} color="#2BA89E" />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Ekle butonu */}
      <TouchableOpacity
        onPress={handleOpen}
        className="flex-row items-center bg-white border border-dashed border-gray-200 p-3 rounded-2xl"
      >
        <View className="bg-[#4ECDC4]/10 p-1.5 rounded-xl mr-3">
          <Ionicons name="add" size={16} color="#4ECDC4" />
        </View>
        <Text className="text-gray-400 font-bold text-sm flex-1">
          {selectedCategories.length === 0
            ? 'Kategori ekle...'
            : 'Başka kategori ekle...'}
        </Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={handleClose}
      >
        <TouchableWithoutFeedback onPress={handleClose}>
          <View className="flex-1 bg-black/40" />
        </TouchableWithoutFeedback>

        <View className="bg-white rounded-t-3xl px-6 pt-4 pb-8">
          {/* Tutamaç */}
          <View className="w-10 h-1 bg-gray-200 rounded-full self-center mb-4" />

          <Text className="text-base font-black text-gray-800 mb-3">
            Kategori Seç
          </Text>

          {/* Seçili chipler — modal içinde de görünsün */}
          {selectedCategories.length > 0 && (
            <View className="flex-row flex-wrap gap-2 mb-3">
              {selectedCategories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => onRemove(cat.id)}
                  className="flex-row items-center bg-[#4ECDC4]/15 px-3 py-1.5 rounded-full border border-[#4ECDC4]/30"
                >
                  <Text className="text-[#2BA89E] font-bold text-xs mr-1.5">
                    {cat.name}
                  </Text>
                  <Ionicons name="close-circle" size={14} color="#2BA89E" />
                </TouchableOpacity>
              ))}
            </View>
          )}

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

          {/* Sonuçlar */}
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

          {/* Tamam butonu */}
          {selectedCategories.length > 0 && (
            <TouchableOpacity
              onPress={handleClose}
              className="mt-4 bg-[#4ECDC4] p-4 rounded-2xl items-center"
            >
              <Text className="text-white font-black">
                {selectedCategories.length} Kategori Seçildi — Tamam
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </Modal>
    </View>
  );
};
