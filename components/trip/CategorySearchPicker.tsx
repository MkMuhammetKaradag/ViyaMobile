import { apiClient } from '@/src/api/client';
import { useThemeColors } from '@/src/hooks/theme/useThemeColors';
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
  const theme = useThemeColors();

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
    <View style={{ marginBottom: 16 }}>
      <Text
        style={{
          color: theme.subtext,
          fontSize: 10,
          fontWeight: '900',
          textTransform: 'uppercase',
          marginBottom: 8,
          marginLeft: 4,
        }}
      >
        {label}
      </Text>

      <TouchableOpacity
        onPress={handleOpen}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: theme.surface,
          borderWidth: 1,
          borderColor: theme.border,
          padding: 16,
          borderRadius: 24,
          shadowColor: theme.text,
          shadowOpacity: 0.03,
          shadowRadius: 10,
          elevation: 1,
        }}
      >
        <Ionicons
          name={selectedCategory ? 'checkmark-circle' : 'search'}
          size={18}
          color={selectedCategory ? theme.primary : theme.placeholder}
        />
        <Text
          style={{
            flex: 1,
            marginLeft: 12,
            fontWeight: '800',
            color: selectedCategory ? theme.text : theme.subtext,
          }}
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
            <Ionicons name="close-circle" size={18} color={theme.subtext} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={handleClose}
      >
        <TouchableWithoutFeedback onPress={handleClose}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }} />
        </TouchableWithoutFeedback>

        <View
          style={{
            backgroundColor: theme.surface,
            borderTopLeftRadius: 32,
            borderTopRightRadius: 32,
            paddingHorizontal: 24,
            paddingTop: 16,
            paddingBottom: 32,
          }}
        >
          <View
            style={{
              width: 40,
              height: 4,
              backgroundColor: theme.border,
              borderRadius: 999,
              alignSelf: 'center',
              marginBottom: 16,
            }}
          />

          <Text
            style={{
              color: theme.text,
              fontSize: 18,
              fontWeight: '900',
              marginBottom: 16,
            }}
          >
            Kategori Seç
          </Text>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: theme.background,
              borderWidth: 1,
              borderColor: theme.border,
              paddingHorizontal: 16,
              borderRadius: 24,
              marginBottom: 16,
            }}
          >
            <Ionicons name="search" size={18} color={theme.placeholder} />
            <TextInput
              ref={inputRef}
              placeholder="Kategori ara..."
              placeholderTextColor={theme.placeholder}
              style={{
                flex: 1,
                marginLeft: 12,
                paddingVertical: 14,
                fontWeight: '800',
                color: theme.text,
              }}
              value={query}
              onChangeText={setQuery}
              returnKeyType="search"
              autoCorrect={false}
            />
            {loading && (
              <ActivityIndicator size="small" color={theme.primary} />
            )}
            {query.length > 0 && !loading && (
              <TouchableOpacity
                onPress={() => {
                  setQuery('');
                  setResults([]);
                }}
              >
                <Ionicons name="close" size={18} color={theme.subtext} />
              </TouchableOpacity>
            )}
          </View>

          {results.length > 0 ? (
            results.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => handleSelect(item)}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingVertical: 14,
                  borderBottomWidth: 1,
                  borderBottomColor: theme.border,
                }}
              >
                <Text style={{ color: theme.text, fontWeight: '900' }}>
                  {item.name}
                </Text>
                <Ionicons
                  name="add-circle-outline"
                  size={20}
                  color={theme.primary}
                />
              </TouchableOpacity>
            ))
          ) : query.length > 1 && !loading ? (
            <Text
              style={{
                color: theme.subtext,
                fontStyle: 'italic',
                textAlign: 'center',
                paddingVertical: 24,
              }}
            >
              Kategori bulunamadı...
            </Text>
          ) : query.length === 0 ? (
            <Text
              style={{
                color: theme.subtext,
                textAlign: 'center',
                paddingVertical: 24,
                fontSize: 14,
              }}
            >
              Aramak istediğiniz kategoriyi yazın
            </Text>
          ) : null}
        </View>
      </Modal>
    </View>
  );
};
