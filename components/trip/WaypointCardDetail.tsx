import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useState } from 'react';
import {
  Dimensions,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
const { width } = Dimensions.get('window');

const ModalTag = ({ tag }: { tag: any }) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      {/* 📍 Resim Üzerindeki Küçük Sabit Etiket İkonu */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={{
          position: 'absolute',
          left: `${tag.x_pos}%`,
          top: `${tag.y_pos}%`,
          transform: [{ translateX: -12 }, { translateY: -12 }], // Tam merkezi hizalar
        }}
        className="bg-[#4ECDC4] w-7 h-7 rounded-full border-2 border-white items-center justify-center shadow-lg"
      >
        <Ionicons name="pricetag" size={12} color="white" />
      </TouchableOpacity>

      {/* 🖼️ Etiket Detay Modalı */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
          className="flex-1 bg-black/60 justify-center items-center px-10"
        >
          {/* Kart İçeriği */}
          <View
            onStartShouldSetResponder={() => true} // Kartın içine tıklayınca kapanmasın
            className="bg-white w-full rounded-[32px] p-6 shadow-2xl"
          >
            <View className="flex-row items-center mb-4">
              <View className="bg-[#4ECDC4]/10 p-2 rounded-full">
                <Ionicons name="location" size={20} color="#4ECDC4" />
              </View>
              <Text className="text-gray-400 text-[10px] font-black uppercase ml-3 tracking-widest">
                Durak Notu
              </Text>
            </View>

            <ScrollView style={{ maxHeight: 200 }}>
              <Text className="text-gray-800 text-lg font-bold leading-6">
                {tag.label}
              </Text>
            </ScrollView>

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="mt-6 bg-gray-100 py-4 rounded-2xl items-center"
            >
              <Text className="text-gray-500 font-bold">Kapat</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};
export const WaypointCardDetail = ({ waypoint, isLast, index }: any) => {
  return (
    <View className="flex-row">
      {/* Sol Çizelge (Timeline Line) */}
      <View className="items-center mr-4">
        {/* Numara Baloncuğu */}
        <View className="w-9 h-9 rounded-full bg-[#4ECDC4] items-center justify-center z-10 shadow-lg shadow-teal-200">
          <Text className="text-white font-black text-xs">{index + 1}</Text>
        </View>
        {/* Çizgi: Eğer son durak değilse aşağı uzanır */}
        {!isLast && <View className="w-[1.5px] flex-1 bg-gray-200/80 my-1" />}
      </View>

      {/* Sağ İçerik Alanı */}
      <View className="flex-1 pb-12">
        {/* Başlık ve Küçük Badge */}
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-xl font-black text-gray-800 flex-1">
            {waypoint.title}
          </Text>
        </View>

        {/* 📸 Fotoğraf Carousel */}
        {waypoint.photos?.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={312} // 300 (genişlik) + 12 (margin)
            decelerationRate="fast"
            className="my-3"
          >
            {waypoint.photos.map((p: any) => (
              <View
                key={p.id}
                style={{
                  width: 300,
                  height: 400,
                  marginRight: 12,
                  position: 'relative',
                }}
              >
                <Image
                  source={p.url}
                  style={{ width: '100%', height: '100%', borderRadius: 24 }}
                  contentFit="cover"
                  transition={500}
                />

                {/* 🏷️ Resim Üzerindeki Etiketler (Tags) */}
                {p.tags?.map((tag: any) => (
                  <ModalTag key={tag.id} tag={tag} />
                ))}
              </View>
            ))}
          </ScrollView>
        )}

        {/* 📝 Not Kutusu (Deneyim Alanı) */}
        <View className="bg-white p-5 rounded-[28px] border border-gray-100 shadow-sm shadow-gray-200/50">
          <View className="flex-row items-center mb-2">
            <Ionicons name="sparkles" size={14} color="#FFD700" />
            <Text className="text-[10px] font-black text-gray-400 uppercase ml-1 tracking-widest">
              Gezgin Notu
            </Text>
          </View>

          <Text className="text-gray-600 text-[15px] leading-6 font-medium">
            {waypoint.note || 'Bu durak için henüz bir not bırakılmamış.'}
          </Text>

          <View className="h-[1px] bg-gray-50 my-4" />

          {/* Aksiyon Butonları */}
          <View className="flex-row justify-between items-center">
            <TouchableOpacity className="flex-row items-center bg-gray-50 px-4 py-2 rounded-full">
              <Ionicons name="location" size={14} color="#4ECDC4" />
              <Text className="text-[#4ECDC4] text-[11px] font-bold ml-1">
                Haritada Aç
              </Text>
            </TouchableOpacity>

            {/* Bu kısım opsiyonel: O durak özelinde "beğeni" veya "kaydet" */}
            <TouchableOpacity className="p-2">
              <Ionicons name="bookmark-outline" size={18} color="#cbd5e1" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};
