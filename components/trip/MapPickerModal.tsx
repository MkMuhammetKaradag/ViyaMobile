import { Ionicons } from '@expo/vector-icons';
import * as ExpoLocation from 'expo-location';
import React, { useRef, useState } from 'react';
import { Alert, Modal, Text, TouchableOpacity, View } from 'react-native';
import MapView from 'react-native-maps';

type Region = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

type Props = {
  visible: boolean;
  initialRegion: Region;
  onClose: () => void;
  onConfirm: (latitude: number, longitude: number) => void;
};

export function MapPickerModal({
  visible,
  initialRegion,
  onClose,
  onConfirm,
}: Props) {
  const mapRef = useRef<MapView>(null);
  const [tempRegion, setTempRegion] = useState<Region>(initialRegion);

  const goToMyLocation = async () => {
    const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('İzin Gerekli', 'Konum izni verilmedi.');
      return;
    }

    const userLocation = await ExpoLocation.getCurrentPositionAsync({});
    const newRegion = {
      ...tempRegion,
      latitude: userLocation.coords.latitude,
      longitude: userLocation.coords.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
    setTempRegion(newRegion);
    mapRef.current?.animateToRegion(newRegion, 1000);
  };

  const handleConfirm = () => {
    onConfirm(tempRegion.latitude, tempRegion.longitude);
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={{ flex: 1 }}>
        <MapView
          ref={mapRef}
          style={{ flex: 1 }}
          initialRegion={initialRegion}
          onRegionChangeComplete={(region) => setTempRegion(region)}
        />

        {/* Merkeze sabit pin */}
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

        {/* Konumuma git butonu */}
        <TouchableOpacity
          onPress={goToMyLocation}
          style={{
            position: 'absolute',
            bottom: 112,
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

        {/* Alt butonlar */}
        <View className="absolute bottom-12 left-6 right-6 flex-row gap-x-4">
          <TouchableOpacity
            onPress={onClose}
            className="flex-1 bg-white h-16 rounded-3xl items-center justify-center shadow-xl border border-gray-100"
          >
            <Text className="font-bold text-gray-500">Kapat</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleConfirm}
            className="flex-[2] bg-[#4ECDC4] h-16 rounded-3xl items-center justify-center shadow-xl shadow-teal-500/30"
          >
            <Text className="font-black text-white text-lg">KONUMU SEÇ</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
