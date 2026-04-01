import { apiClient } from '@/src/api/client';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as ExpoLocation from 'expo-location';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView from 'react-native-maps';

export default function AddWayPointScreen() {
  const { tripId, nextOrder } = useLocalSearchParams();
  const router = useRouter();
  const mapRef = useRef<MapView>(null);

  const [loading, setLoading] = useState(false);
  const [mapVisible, setMapVisible] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [note, setNote] = useState('');
  const [location, setLocation] = useState({
    latitude: 39.9334,
    longitude: 32.8597,
  });

  const [images, setImages] = useState<any[]>([]); // Yerel URI'leri tutar

  // 📸 Resim Seçme (Upload yok, sadece listeye ekler)
  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 5],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImages([...images, result.assets[0]]);
    }
  };

  // 📍 Mevcut Konuma Git
  const goToMyLocation = async () => {
    const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
    if (status !== 'granted') return Alert.alert('Hata', 'İzin verilmedi.');

    const userLoc = await ExpoLocation.getCurrentPositionAsync({});
    const coords = {
      latitude: userLoc.coords.latitude,
      longitude: userLoc.coords.longitude,
    };
    setLocation(coords);
    mapRef.current?.animateToRegion({
      ...coords,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  };

  // 🚀 Backend'e Gönder (Multipart Form)
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

      // Resimleri backende yolla
      images.forEach((img, index) => {
        formData.append('images', {
          uri: img.uri,
          name: `wp_photo_${index}.jpg`,
          type: 'image/jpeg',
        } as any);
      });

      await apiClient.post('/api/v1/waypoints', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      Alert.alert('Başarılı', 'Yeni durak eklendi!', [
        { text: 'Tamam', onPress: () => router.back() },
      ]);
    } catch (err) {
      console.error(err);
      Alert.alert('Hata', 'Sunucuya kaydedilemedi.');
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
        {/* Header */}
        <View className="flex-row items-center mb-8">
          <TouchableOpacity
            onPress={() => router.back()}
            className="mr-4 bg-gray-100 p-2 rounded-full"
          >
            <Ionicons name="close" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-2xl font-black text-gray-900">Durak Ekle</Text>
        </View>

        {/* Başlık Girişi */}
        <TextInput
          placeholder="Durak ismi (Örn: Eskişehir Odunpazarı)"
          value={title}
          onChangeText={setTitle}
          className="bg-gray-50 p-5 rounded-3xl mb-4 font-bold border border-gray-100 text-lg"
        />

        {/* 🗺️ Konum Seçici Kartı */}
        <TouchableOpacity
          onPress={() => setMapVisible(true)}
          className="bg-blue-50/50 p-5 rounded-3xl mb-4 border border-blue-100 flex-row items-center"
        >
          <View className="bg-blue-500 p-3 rounded-2xl mr-4 shadow-sm">
            <Ionicons name="map" size={20} color="white" />
          </View>
          <View className="flex-1">
            <Text className="text-blue-500 font-bold text-[10px] uppercase tracking-tighter">
              Konum Belirle
            </Text>
            <Text className="text-blue-900 font-bold text-sm">
              {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#3b82f6" />
        </TouchableOpacity>

        {/* Hikaye/Açıklama */}
        <TextInput
          placeholder="Neler yaptın? (Açıklama)"
          value={desc}
          onChangeText={setDesc}
          multiline
          className="bg-gray-50 p-5 rounded-3xl mb-4 min-h-[120px] text-gray-700 border border-gray-100"
          textAlignVertical="top"
        />

        {/* Resimler Bölümü */}
        <Text className="text-gray-400 font-bold text-[10px] uppercase mb-3 ml-2">
          Fotoğraflar
        </Text>
        <View className="flex-row flex-wrap mb-8">
          {images.map((img, i) => (
            <View key={i} className="mr-3 mb-3 relative">
              <Image
                source={{ uri: img.uri }}
                className="w-24 h-24 rounded-3xl border border-gray-200"
              />
              <TouchableOpacity
                onPress={() => setImages(images.filter((_, idx) => idx !== i))}
                className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 border-2 border-white"
              >
                <Ionicons name="close" size={14} color="white" />
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity
            onPress={handlePickImage}
            className="w-24 h-24 bg-gray-50 rounded-3xl items-center justify-center border-2 border-dashed border-gray-200"
          >
            <Ionicons name="camera" size={30} color="#94a3b8" />
            <Text className="text-[8px] font-black text-gray-400 mt-1">
              EKLE
            </Text>
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

      {/* 🗺️ HARİTA MODALI */}
      <Modal visible={mapVisible} animationType="slide">
        <View style={{ flex: 1, backgroundColor: 'white' }}>
          <MapView
            ref={mapRef}
            style={StyleSheet.absoluteFillObject} // 👈 Tüm ekranı kaplamasını garantiler
            provider="google" // 👈 Eğer Android kullanıyorsan bunu ekle (yüklü olmalı)
            initialRegion={{
              ...location,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
            onRegionChangeComplete={(r) => {
              setLocation({ latitude: r.latitude, longitude: r.longitude });
            }}
          />

          {/* Sabit Merkez Pin - PointerEvents none olmalı ki haritayı kaydırmayı engellemesin */}
          <View style={styles.markerFixed} pointerEvents="none">
            <Ionicons name="location" size={45} color="#FF6B6B" />
            <View className="w-2 h-2 bg-black/20 rounded-full mt-[-5px]" />
          </View>

          {/* Üst Butonlar */}
          <View className="absolute top-14 left-6 right-6 flex-row justify-between">
            <TouchableOpacity
              onPress={() => setMapVisible(false)}
              className="bg-white/90 p-3 rounded-2xl shadow-lg"
            >
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={goToMyLocation}
              className="bg-white/90 p-3 rounded-2xl shadow-lg"
            >
              <Ionicons name="locate" size={24} color="#4ECDC4" />
            </TouchableOpacity>
          </View>

          {/* Alt Onay Butonu */}
          <View className="absolute bottom-12 px-10 w-full">
            <TouchableOpacity
              onPress={() => setMapVisible(false)}
              className="bg-[#4ECDC4] p-5 rounded-[28px] items-center shadow-2xl shadow-teal-500"
            >
              <Text className="font-black text-white text-lg tracking-widest">
                KONUMU ONAYLA
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  markerFixed: {
    left: '50%',
    marginLeft: -22, // İkon genişliğinin yarısı
    marginTop: -45, // İkon yüksekliği
    position: 'absolute',
    top: '50%',
    alignItems: 'center',
  },
});
