import { useThemeColors } from '@/src/hooks/theme/useThemeColors';
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
  const theme = useThemeColors();

  return (
    <View style={{ marginBottom: 32 }}>
      <View
        style={{
          backgroundColor: theme.surface,
          padding: 16,
          borderRadius: 32,
          marginBottom: 16,
          borderWidth: 1,
          borderColor: theme.border,
        }}
      >
        <Text
          style={{
            color: theme.subtext,
            fontWeight: '900',
            fontSize: 11,
            textTransform: 'uppercase',
            marginBottom: 16,
          }}
        >
          Gezi Ayarları
        </Text>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
            paddingHorizontal: 4,
          }}
        >
          <View style={{ flex: 1, marginRight: 16 }}>
            <Text
              style={{ color: theme.text, fontWeight: '900', fontSize: 15 }}
            >
              Herkese Açık
            </Text>
            <Text style={{ color: theme.subtext, fontSize: 12 }}>
              Bu rotayı diğer kullanıcılar keşfet sayfasında görebilir.
            </Text>
          </View>
          <Switch
            trackColor={{ false: theme.border, true: theme.primary }}
            thumbColor={isPublic ? theme.background : theme.surface}
            onValueChange={onPublicChange}
            value={isPublic}
          />
        </View>

        <View
          style={{
            height: 1,
            backgroundColor: theme.border,
            marginVertical: 12,
            width: '100%',
          }}
        />

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 4,
          }}
        >
          <View style={{ flex: 1, marginRight: 16 }}>
            <Text
              style={{ color: theme.text, fontWeight: '900', fontSize: 15 }}
            >
              Yayına Al
            </Text>
            <Text style={{ color: theme.subtext, fontSize: 12 }}>
              Pasif yaparsan gezi profilinde gizlenir.
            </Text>
          </View>
          <Switch
            trackColor={{ false: theme.border, true: theme.primary }}
            thumbColor={isActive ? theme.background : theme.surface}
            onValueChange={onActiveChange}
            value={isActive}
          />
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 4,
        }}
      >
        <View style={{ flex: 1, marginRight: 16 }}>
          <Text style={{ color: theme.text, fontWeight: '900', fontSize: 15 }}>
            Yayın Tarihi
          </Text>
          <Text style={{ color: theme.subtext, fontSize: 12 }}>
            {publishedAt.toLocaleDateString('tr-TR')} tarihinde paylaşılacak.
          </Text>
        </View>

        <TouchableOpacity
          onPress={onShowPicker}
          style={{
            backgroundColor: theme.primary + '20',
            paddingHorizontal: 16,
            paddingVertical: 10,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: theme.primary + '40',
          }}
        >
          <Text
            style={{ color: theme.primary, fontWeight: '900', fontSize: 12 }}
          >
            TARİH SEÇ
          </Text>
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
