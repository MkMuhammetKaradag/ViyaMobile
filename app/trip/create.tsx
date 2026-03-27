import { WaypointCard } from '@/components/trip/WaypointCard';
import { apiClient } from '@/src/api/client';

import { uploadToCloudinary } from '@/src/utils/cloudinary'; // Buraya kendi upload fonksiyonunu koy
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as ExpoLocation from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView from 'react-native-maps';

export default function CreateTripScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [isActive, setIsActive] = useState(true);
  const [isPublic, setIsPublic] = useState(true);
  const mapRef = useRef<MapView>(null);

  // Form States
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [waypoints, setWaypoints] = useState<any[]>([]);
  const [mapVisible, setMapVisible] = useState(false);
  const [selectedWpIndex, setSelectedWpIndex] = useState<number | null>(null);
  const [tempRegion, setTempRegion] = useState({
    latitude: 39.9334,
    longitude: 32.8597,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const handleOpenMap = (index: number) => {
    setSelectedWpIndex(index);
    if (waypoints[index].latitude !== 0) {
      setTempRegion({
        ...tempRegion,
        latitude: waypoints[index].latitude,
        longitude: waypoints[index].longitude,
      });
    }
    setMapVisible(true);
  };
  const goToMyLocation = async () => {
    const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('İzin Gerekli', 'Konum izni verilmedi.');
      return;
    }

    const userLocation = await ExpoLocation.getCurrentPositionAsync({});

    setTempRegion((prev) => ({
      ...prev,
      latitude: userLocation.coords.latitude,
      longitude: userLocation.coords.longitude,
    }));

    mapRef.current?.animateToRegion(
      {
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      1000,
    );
  };
  // ✅ Seçilen konumu onayla
  const confirmLocation = () => {
    if (selectedWpIndex !== null) {
      const updated = [...waypoints];
      updated[selectedWpIndex].latitude = tempRegion.latitude;
      updated[selectedWpIndex].longitude = tempRegion.longitude;
      setWaypoints(updated);
    }
    setMapVisible(false);
  };
  const addWaypoint = () => {
    setWaypoints([
      ...waypoints,
      {
        title: '',
        note: '',
        photos: [],
        latitude: 0,
        longitude: 0,
        order_index: waypoints.length,
      },
    ]);
  };

  const updateWaypoint = (index: number, field: string, value: any) => {
    const updated = [...waypoints];
    updated[index][field] = value;
    setWaypoints(updated);
  };

  const handlePickImage = async (index: number) => {
    const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.5 });
    if (!result.canceled) {
      setUploadingIndex(index);
      try {
        const url = await uploadToCloudinary(result.assets[0].uri);
        const updated = [...waypoints];
        updated[index].photos.push(url);
        setWaypoints(updated);
      } catch (e) {
        Alert.alert('Hata', 'Resim yüklenemedi.');
      } finally {
        setUploadingIndex(null);
      }
    }
  };
  // 1. Resim Silme Fonksiyonu
  const handleRemoveImage = (wpIndex: number, imgIndex: number) => {
    const updated = [...waypoints];
    updated[wpIndex].photos.splice(imgIndex, 1); // Belirli indeksteki resmi diziden çıkar
    setWaypoints(updated);
  };

  const handleSave = async () => {
    if (title.length < 3) return Alert.alert('Hata', 'Başlık çok kısa.');
    setLoading(true);
    try {
      const payload = {
        title,
        desc,
        is_active: isActive,
        is_public: isPublic,
        waypoints,
        published_at: new Date().toISOString(),
      };
      await apiClient.post('/api/v1/trips', payload);
      router.back();
    } catch (e) {
      Alert.alert('Hata', 'Kaydedilemedi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1 bg-white px-6">
        <View className="mt-14 mb-8 flex-row justify-between items-center">
          <Text className="text-3xl font-black text-gray-900">Yeni Rota</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="close" size={30} />
          </TouchableOpacity>
        </View>

        <TextInput
          placeholder="Rotalara bir isim ver..."
          value={title}
          onChangeText={setTitle}
          className="text-xl font-bold p-4 bg-gray-50 rounded-2xl mb-4 border border-gray-100"
        />

        <TextInput
          placeholder="Hikayen ne?"
          value={desc}
          onChangeText={setDesc}
          multiline
          className="p-4 bg-gray-50 rounded-2xl mb-8 min-h-[100]"
        />
        <View className="bg-gray-50 p-4 rounded-3xl mb-8 border border-gray-100">
          <Text className="text-gray-400 font-bold text-[10px] uppercase mb-4 ml-1">
            Gezi Ayarları
          </Text>

          {/* Herkese Açık Mı? */}
          <View className="flex-row justify-between items-center mb-4 px-2">
            <View className="flex-1 mr-4">
              <Text className="font-bold text-gray-800">Herkese Açık</Text>
              <Text className="text-gray-500 text-xs">
                Bu rotayı diğer kullanıcılar keşfet sayfasında görebilir.
              </Text>
            </View>
            <Switch
              trackColor={{ false: '#cbd5e1', true: '#4ECDC4' }}
              thumbColor={isPublic ? '#fff' : '#f4f3f4'}
              onValueChange={() => setIsPublic(!isPublic)}
              value={isPublic}
            />
          </View>

          <View className="h-[1px] bg-gray-200 my-2 w-full" />

          {/* Aktif Mi? */}
          <View className="flex-row justify-between items-center mt-2 px-2">
            <View className="flex-1 mr-4">
              <Text className="font-bold text-gray-800">Yayına Al</Text>
              <Text className="text-gray-500 text-xs">
                Pasif yaparsan gezi profilinde gizlenir.
              </Text>
            </View>
            <Switch
              trackColor={{ false: '#cbd5e1', true: '#4ECDC4' }}
              thumbColor={isActive ? '#fff' : '#f4f3f4'}
              onValueChange={() => setIsActive(!isActive)}
              value={isActive}
            />
          </View>
        </View>
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-xl font-black text-gray-800">Duraklar</Text>
          <TouchableOpacity
            onPress={addWaypoint}
            className="bg-[#4ECDC4] p-2 px-4 rounded-full flex-row items-center"
          >
            <Ionicons name="add" size={20} color="white" />
            <Text className="text-white font-bold ml-1">Ekle</Text>
          </TouchableOpacity>
        </View>

        {waypoints.map((wp, i) => (
          <WaypointCard
            key={i}
            index={i}
            waypoint={wp}
            onUpdate={(field, val) => {
              const updated = [...waypoints];
              updated[i][field] = val;
              setWaypoints(updated);
            }}
            onRemove={() =>
              setWaypoints(waypoints.filter((_, idx) => idx !== i))
            }
            onPickImage={() => handlePickImage(i)}
            onRemoveImage={(imgIdx) => {
              const updated = [...waypoints];
              updated[i].photos.splice(imgIdx, 1);
              setWaypoints(updated);
            }}
            onOpenMap={() => handleOpenMap(i)}
            isUploading={uploadingIndex === i}
          />
        ))}

        <TouchableOpacity
          onPress={handleSave}
          disabled={loading}
          className="bg-[#4ECDC4] p-5 rounded-3xl items-center mb-10 shadow-lg shadow-teal-300"
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-black text-lg">ROTAYI PAYLAŞ</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
      <Modal visible={mapVisible} animationType="slide">
        <View style={{ flex: 1 }}>
          <MapView
            ref={mapRef}
            style={{ flex: 1 }}
            initialRegion={tempRegion}
            onRegionChangeComplete={(region) => setTempRegion(region)}
            // onPress={(e) => {
            //   const { latitude, longitude } = e.nativeEvent.coordinate;
            //   setTempRegion((prev) => ({ ...prev, latitude, longitude }));
            // }}
          >
            {/* <Marker
              coordinate={{
                latitude: tempRegion.latitude,
                longitude: tempRegion.longitude,
              }}
            >
              <Ionicons name="location" size={36} color="#FF6B6B" />
            </Marker> */}
          </MapView>
          {/* Merkeze Sabit Pin */}
          <View
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              marginTop: -35,
              marginLeft: -18,
            }}
            pointerEvents="none"
          >
            <Ionicons name="location" size={36} color="#FF6B6B" />
          </View>
          {/* Butonlar */}
          <View className="absolute bottom-12 left-6 right-6 flex-row gap-x-4">
            <TouchableOpacity
              onPress={() => setMapVisible(false)}
              className="flex-1 bg-white h-16 rounded-3xl items-center justify-center shadow-xl border border-gray-100"
            >
              <Text className="font-bold text-gray-500">Kapat</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={goToMyLocation}
              style={{
                position: 'absolute',
                top: 60,
                right: 16,
                backgroundColor: 'white',
                padding: 12,
                borderRadius: 50,
                shadowColor: '#000',
                shadowOpacity: 0.15,
                shadowRadius: 6,
                elevation: 5,
              }}
            >
              <Ionicons name="locate" size={24} color="#4ECDC4" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={confirmLocation}
              className="flex-[2] bg-[#4ECDC4] h-16 rounded-3xl items-center justify-center shadow-xl shadow-teal-500/30"
            >
              <Text className="font-black text-white text-lg">KONUMU SEÇ</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
