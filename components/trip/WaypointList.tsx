import { WaypointCardDetail } from '@/components/trip/WaypointCardDetail';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

type Waypoint = {
  id: string;
  [key: string]: any;
};

type Props = {
  waypoints: Waypoint[];
  isMyTrip: boolean;
  tripId: string | string[];
  onDelete: (waypointId: string) => void;
  onReorder: (
    waypointId: string,
    currentIndex: number,
    direction: 'up' | 'down',
  ) => void;
};

export function WaypointList({
  waypoints,
  isMyTrip,
  tripId,
  onDelete,
  onReorder,
}: Props) {
  const router = useRouter();

  return (
    <View className="px-6 pb-20">
      <Text className="text-xl font-black text-gray-900 mb-6">
        Yolculuk Durakları
      </Text>

      {waypoints.map((wp, index) => (
        <View key={wp.id} className="relative">
          <WaypointCardDetail
            waypoint={wp}
            isLast={index === waypoints.length - 1 && !isMyTrip}
            index={index}
          />

          {/* Durak yönetim paneli — sadece sahip görebilir */}
          {isMyTrip && (
            <View className="absolute top-0 right-0 flex-row items-center space-x-2">
              {/* Yukarı taşı */}
              {index > 0 && (
                <TouchableOpacity
                  onPress={() => onReorder(wp.id, index, 'up')}
                  className="p-2 bg-gray-50 rounded-full border border-gray-100"
                >
                  <Ionicons name="chevron-up" size={18} color="#4ECDC4" />
                </TouchableOpacity>
              )}

              {/* Aşağı taşı */}
              {index < waypoints.length - 1 && (
                <TouchableOpacity
                  onPress={() => onReorder(wp.id, index, 'down')}
                  className="p-2 bg-gray-50 rounded-full border border-gray-100"
                >
                  <Ionicons name="chevron-down" size={18} color="#4ECDC4" />
                </TouchableOpacity>
              )}

              {/* Sil */}
              <TouchableOpacity
                onPress={() => onDelete(wp.id)}
                className="p-2 bg-red-50 rounded-full border border-red-100"
              >
                <Ionicons name="trash-outline" size={18} color="#EF4444" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      ))}

      {/* Yeni durak ekle — sadece sahip görebilir */}
      {isMyTrip && (
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: '/trip/add-waypoint',
              params: {
                tripId,
                nextOrder: waypoints.length,
              },
            })
          }
          activeOpacity={0.7}
          className="mt-2 p-6 border-2 border-dashed border-[#4ECDC4]/40 rounded-[32px] bg-[#4ECDC4]/5 items-center justify-center"
        >
          <View className="bg-[#4ECDC4] p-3 rounded-full shadow-lg shadow-teal-200">
            <Ionicons name="add" size={28} color="white" />
          </View>
          <Text className="text-[#4ECDC4] font-black mt-3 text-base">
            YENİ DURAK EKLE
          </Text>
          <Text className="text-gray-400 text-[10px] mt-1 font-bold">
            Macerana kaldığın yerden devam et! Yeni bir durak ekleyerek rotanı
            zenginleştir.
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
