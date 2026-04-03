import DateTimePicker from '@react-native-community/datetimepicker';
import React from 'react';
import { Platform, Switch, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  isPublic: boolean;
  isActive: boolean;
  publishedAt: Date;
  showPicker: boolean;
  onPublicChange: (v: boolean) => void;
  onActiveChange: (v: boolean) => void;
  onShowPicker: () => void;
  onDateChange: (event: any, date?: Date) => void;
};

export function TripSettingsCard({
  isPublic,
  isActive,
  publishedAt,
  showPicker,
  onPublicChange,
  onActiveChange,
  onShowPicker,
  onDateChange,
}: Props) {
  return (
    <View className="mb-8">
      {/* Switch'ler */}
      <View className="bg-gray-50 p-4 rounded-3xl mb-4 border border-gray-100">
        <Text className="text-gray-400 font-bold text-[10px] uppercase mb-4 ml-1">
          Gezi Ayarları
        </Text>

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
            onValueChange={onPublicChange}
            value={isPublic}
          />
        </View>

        <View className="h-[1px] bg-gray-200 my-2 w-full" />

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
            onValueChange={onActiveChange}
            value={isActive}
          />
        </View>
      </View>

      {/* Tarih seçici */}
      <View className="flex-row justify-between items-center px-2">
        <View className="flex-1 mr-4">
          <Text className="font-bold text-gray-800">Yayın Tarihi</Text>
          <Text className="text-gray-500 text-xs">
            {publishedAt.toLocaleDateString('tr-TR')} tarihinde paylaşılacak.
          </Text>
        </View>

        <TouchableOpacity
          onPress={onShowPicker}
          className="bg-[#4ECDC4]/10 px-4 py-2 rounded-xl border border-[#4ECDC4]/20"
        >
          <Text className="text-[#4ECDC4] font-bold text-xs">TARİH SEÇ</Text>
        </TouchableOpacity>
      </View>

      {showPicker && (
        <DateTimePicker
          value={publishedAt}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onDateChange}
          minimumDate={new Date()}
        />
      )}
    </View>
  );
}
