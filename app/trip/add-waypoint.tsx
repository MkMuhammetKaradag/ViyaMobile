import { apiClient } from '@/src/api/client';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView from 'react-native-maps';

const { width: screenWidth } = Dimensions.get('window');

export default function AddWayPointScreen() {
  const { tripId, nextOrder } = useLocalSearchParams();
  const router = useRouter();
  const mapRef = useRef<MapView>(null);

  const [loading, setLoading] = useState(false);
  const [mapVisible, setMapVisible] = useState(false);

  // Etiketleme State'leri
  const [taggingModalVisible, setTaggingModalVisible] = useState(false);
  const [currentPhotoIdx, setCurrentPhotoIdx] = useState<number | null>(null);
  const [imageLayout, setImageLayout] = useState({ width: 0, height: 0 });
  const [tagName, setTagName] = useState('');
  const [inputModalVisible, setInputModalVisible] = useState(false);
  const [tempCoords, setTempCoords] = useState({ x: 0, y: 0 });
  const [editingTagIndex, setEditingTagIndex] = useState<number | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [note, setNote] = useState('');
  const [location, setLocation] = useState({
    latitude: 39.9334,
    longitude: 32.8597,
  });

  const [images, setImages] = useState<any[]>([]);

  // 📸 Resim Seçme
  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Hata', 'Galeri izni gerekli.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 5],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      const newImage = {
        uri: result.assets[0].uri,
        tags: [],
      };
      // Functional update kullanarak state'i garantiye alalım
      setImages((prev) => [...prev, newImage]);
    }
  };
  // 📍 Fotoğraf Üzerine Tıklama (Koordinat Hesaplama)
  const handlePhotoPress = (event: any) => {
    const { locationX, locationY } = event.nativeEvent;
    const xPercent = (locationX / imageLayout.width) * 100;
    const yPercent = (locationY / imageLayout.height) * 100;

    setEditingTagIndex(null);
    setTempCoords({ x: xPercent, y: yPercent });
    setTagName('');
    setInputModalVisible(true);
  };

  // 💾 Etiketi Kaydet
  const saveNewTag = () => {
    if (!tagName || currentPhotoIdx === null) return;
    const updated = [...images];

    if (editingTagIndex !== null) {
      updated[currentPhotoIdx].tags[editingTagIndex].label = tagName;
    } else {
      updated[currentPhotoIdx].tags.push({
        label: tagName,
        x_pos: tempCoords.x,
        y_pos: tempCoords.y,
      });
    }

    setImages(updated);
    setInputModalVisible(false);
  };

  // 🗑️ Etiketi Sil
  const deleteTag = () => {
    if (editingTagIndex === null || currentPhotoIdx === null) return;
    const updated = [...images];
    updated[currentPhotoIdx].tags.splice(editingTagIndex, 1);
    setImages(updated);
    setInputModalVisible(false);
  };

  // 🚀 Backend'e Gönder
  const handleSave = async () => {
    if (!title) return Alert.alert('Hata', 'Durak başlığı gerekli.');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('trip_id', tripId as string);
      formData.append('title', title);
      formData.append('desc', desc);
      formData.append('note', note);
      formData.append('lat', String(location.latitude));
      formData.append('lon', String(location.longitude));
      formData.append('order_index', String(nextOrder));

      images.forEach((img, index) => {
        const imageUri =
          Platform.OS === 'android' ? img.uri : img.uri.replace('file://', '');
        formData.append('images', {
          uri: imageUri,
          name: `wp_photo_${index}.jpg`,
          type: 'image/jpeg',
        } as any);
        // Etiketleri JSON olarak gönderiyoruz
        formData.append(`tags_${index}`, JSON.stringify(img.tags || []));
      });

      await apiClient.post('/api/v1/waypoints', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      Alert.alert('Başarılı', 'Durak eklendi!', [
        { text: 'Tamam', onPress: () => router.back() },
      ]);
    } catch (err) {
      Alert.alert('Hata', 'Kaydedilemedi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        className="flex-1 px-6 pt-16"
        showsVerticalScrollIndicator={false}
      >
        {/* Header & Inputs (Aynı bıraktım) */}
        <View className="flex-row items-center mb-8">
          <TouchableOpacity
            onPress={() => router.back()}
            className="mr-4 bg-gray-100 p-2 rounded-full"
          >
            <Ionicons name="close" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-2xl font-black text-gray-900">Durak Ekle</Text>
        </View>

        <TextInput
          placeholder="Durak ismi..."
          value={title}
          onChangeText={setTitle}
          className="bg-gray-50 p-5 rounded-3xl mb-4 font-bold border border-gray-100 text-lg"
        />

        <TouchableOpacity
          onPress={() => setMapVisible(true)}
          className="bg-blue-50/50 p-5 rounded-3xl mb-4 border border-blue-100 flex-row items-center"
        >
          <View className="bg-blue-500 p-3 rounded-2xl mr-4 shadow-sm">
            <Ionicons name="map" size={20} color="white" />
          </View>
          <View className="flex-1">
            <Text className="text-blue-500 font-bold text-[10px] uppercase">
              Konum Seç
            </Text>
            <Text className="text-blue-900 font-bold text-sm">
              {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
            </Text>
          </View>
        </TouchableOpacity>

        <TextInput
          placeholder="Açıklama..."
          value={desc}
          onChangeText={setDesc}
          multiline
          className="bg-gray-50 p-5 rounded-3xl mb-6 min-h-[120px] text-gray-700 border border-gray-100"
        />

        {/* 📸 Fotoğraflar ve Etiket Sayacı */}
        <View className="flex-row flex-wrap mb-8">
          {images.map((img, i) => (
            <View key={i} className="mr-3 mb-3 relative">
              <TouchableOpacity
                onPress={() => {
                  setCurrentPhotoIdx(i);
                  setTaggingModalVisible(true);
                }}
              >
                <Image
                  key={img.uri}
                  source={img.uri} // <-- Sadece img.uri dene, eğer expo-image ise {{uri: ...}} bazen sorun çıkarır
                  style={{ width: 96, height: 96, borderRadius: 24 }} // className yerine style ile garantiye alalım
                  className="rounded-3xl border border-gray-200"
                  contentFit="cover" // expo-image için gereklidir
                />
                {img.tags?.length > 0 && (
                  <View className="absolute -top-1 -right-1 bg-[#4ECDC4] rounded-full px-2 py-0.5 border-2 border-white shadow-sm">
                    <Text className="text-[10px] text-white font-black">
                      {img.tags.length}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setImages(images.filter((_, idx) => idx !== i))}
                className="absolute -top-2 -left-2 bg-white rounded-full shadow-sm"
              >
                <Ionicons name="close-circle" size={22} color="#FF6B6B" />
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity
            onPress={handlePickImage}
            className="w-24 h-24 bg-gray-50 rounded-3xl items-center justify-center border-2 border-dashed border-gray-200"
          >
            <Ionicons name="camera" size={30} color="#94a3b8" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={handleSave}
          disabled={loading}
          className="bg-[#4ECDC4] p-6 rounded-[32px] items-center mb-12 shadow-lg shadow-teal-200"
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-black text-lg">
              YOLCULUĞA EKLE
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* 🖼️ FOTOĞRAF ETİKETLEME MODALI */}
      <Modal visible={taggingModalVisible} animationType="fade">
        <View className="flex-1 bg-black items-center justify-center">
          {currentPhotoIdx !== null && images[currentPhotoIdx] && (
            <View
              style={{ width: screenWidth, height: screenWidth * 1.25 }}
              className="relative bg-gray-900"
            >
              <TouchableOpacity
                activeOpacity={1}
                onPress={handlePhotoPress}
                onLayout={(e) =>
                  setImageLayout({
                    width: e.nativeEvent.layout.width,
                    height: e.nativeEvent.layout.height,
                  })
                }
                style={{ width: '100%', height: '100%' }}
              >
                <Image
                  source={{ uri: images[currentPhotoIdx].uri }}
                  style={{ width: '100%', height: '100%' }}
                  contentFit="cover"
                />

                {/* Etiketleri Render Et */}
                {images[currentPhotoIdx].tags?.map((tag: any, i: number) => (
                  <TouchableOpacity
                    key={i}
                    onPress={() => {
                      setEditingTagIndex(i);
                      setTagName(tag.label);
                      setInputModalVisible(true);
                    }}
                    style={{
                      position: 'absolute',
                      left: `${tag.x_pos}%`,
                      top: `${tag.y_pos}%`,
                      transform: [{ translateX: tag.x_pos > 50 ? -80 : -10 }],
                    }}
                    className="bg-[#4ECDC4] px-3 py-1.5 rounded-full border border-white shadow-lg"
                  >
                    <Text
                      numberOfLines={1}
                      className="text-white text-[10px] font-black italic"
                    >
                      {tag.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </TouchableOpacity>
            </View>
          )}
          <TouchableOpacity
            onPress={() => setTaggingModalVisible(false)}
            className="mt-10 bg-white/10 px-10 py-4 rounded-3xl border border-white/20"
          >
            <Text className="text-white font-bold">KAPAT</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* ⌨️ ETİKET İSMİ GİRİŞ MODALI */}
      <Modal visible={inputModalVisible} transparent animationType="slide">
        <View className="flex-1 bg-black/80 justify-end">
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <View className="bg-white p-8 rounded-t-[40px]">
              <Text className="text-xl font-black mb-6 text-gray-800 text-center">
                Etiketi Yönet
              </Text>
              <TextInput
                placeholder="Bu noktada ne var?"
                value={tagName}
                onChangeText={setTagName}
                autoFocus
                className="bg-gray-100 p-5 rounded-2xl mb-6 font-bold text-lg"
              />
              <View className="flex-row gap-x-3 mb-6">
                <TouchableOpacity
                  onPress={() => setInputModalVisible(false)}
                  className="flex-1 p-5 rounded-2xl bg-gray-100 items-center"
                >
                  <Text className="font-bold text-gray-400">Vazgeç</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={saveNewTag}
                  className="flex-[2] p-5 rounded-2xl bg-[#4ECDC4] items-center"
                >
                  <Text className="text-white font-bold text-lg">KAYDET</Text>
                </TouchableOpacity>
              </View>
              {editingTagIndex !== null && (
                <TouchableOpacity
                  onPress={deleteTag}
                  className="items-center pb-4"
                >
                  <Text className="text-red-500 font-bold">Etiketi Kaldır</Text>
                </TouchableOpacity>
              )}
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* HARİTA MODALI (Senin kodundakiyle aynı, dokunmadım) */}
      <Modal visible={mapVisible} animationType="slide">
        {/* ... Harita kodun buraya gelecek ... */}
        <View style={{ flex: 1 }}>
          <MapView
            ref={mapRef}
            style={StyleSheet.absoluteFillObject}
            initialRegion={{
              ...location,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
            onRegionChangeComplete={(r) =>
              setLocation({ latitude: r.latitude, longitude: r.longitude })
            }
          />
          <View style={styles.markerFixed} pointerEvents="none">
            <Ionicons name="location" size={45} color="#FF6B6B" />
          </View>
          <TouchableOpacity
            onPress={() => setMapVisible(false)}
            className="absolute bottom-12 self-center bg-[#4ECDC4] px-12 py-5 rounded-full shadow-xl"
          >
            <Text className="text-white font-black">KONUMU ONAYLA</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  markerFixed: {
    left: '50%',
    marginLeft: -22,
    marginTop: -45,
    position: 'absolute',
    top: '50%',
    alignItems: 'center',
  },
});
