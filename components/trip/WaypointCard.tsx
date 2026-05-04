import { useThemeColors } from '@/src/hooks/theme/useThemeColors';
import { WaypointDraft } from '@/src/hooks/useCreateTrip';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  ActivityIndicator,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { CategorySearchPicker } from './CategorySearchPicker';

interface WaypointCardProps {
  index: number;
  waypoint: any;
  onUpdate: (field: keyof WaypointDraft, val: any) => void;
  onRemove: () => void;
  onPickImage: () => void;
  onRemoveImage: (imageIndex: number) => void;
  onOpenMap: () => void;
  onEditTags: (photoIdx: number) => void;

  isUploading: boolean;
}

export const WaypointCard = ({
  index,
  waypoint,
  onUpdate,
  onRemove,
  onPickImage,
  onRemoveImage,
  onOpenMap,
  isUploading,
  onEditTags,
}: WaypointCardProps) => {
  const theme = useThemeColors();

  return (
    <View
      style={{
        backgroundColor: theme.surface,
        padding: 20,
        borderRadius: 32,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: theme.border,
        shadowColor: theme.text,
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 2,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.primary + '15',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 999,
          }}
        >
          <Text
            style={{ color: theme.primary, fontWeight: '900', fontSize: 13 }}
          >
            DURAK {index + 1}
          </Text>
        </View>
        <TouchableOpacity onPress={onRemove} style={{ padding: 8 }}>
          <Ionicons name="trash-outline" size={22} color={theme.danger} />
        </TouchableOpacity>
      </View>

      <TextInput
        placeholder="Nereye gittin? (Örn: Odunpazarı)"
        placeholderTextColor={theme.placeholder}
        value={waypoint.title}
        onChangeText={(val) => onUpdate('title', val)}
        style={{
          backgroundColor: theme.background,
          padding: 16,
          borderRadius: 24,
          marginBottom: 12,
          borderWidth: 1,
          borderColor: theme.border,
          color: theme.text,
          fontSize: 16,
          fontWeight: '700',
        }}
      />

      <TouchableOpacity
        onPress={onOpenMap}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: theme.background,
          padding: 14,
          borderRadius: 24,
          marginBottom: 12,
          borderWidth: 1,
          borderColor: theme.border,
        }}
      >
        <View
          style={{
            backgroundColor: theme.primary,
            padding: 10,
            borderRadius: 18,
            marginRight: 14,
            elevation: 2,
          }}
        >
          <Ionicons name="location" size={18} color={theme.accentText} />
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: theme.subtext,
              fontSize: 10,
              fontWeight: '800',
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}
          >
            Koordinatlar
          </Text>
          <Text style={{ color: theme.text, fontSize: 13, fontWeight: '600' }}>
            {waypoint.latitude !== 0
              ? `${waypoint.latitude.toFixed(4)}, ${waypoint.longitude.toFixed(4)}`
              : 'Haritadan Konum Seç'}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={theme.placeholder} />
      </TouchableOpacity>

      <TextInput
        placeholder="Bu durak hakkında bir şeyler karala..."
        placeholderTextColor={theme.placeholder}
        value={waypoint.note}
        onChangeText={(val) => onUpdate('note', val)}
        multiline
        style={{
          backgroundColor: theme.background,
          padding: 16,
          borderRadius: 24,
          marginBottom: 16,
          borderWidth: 1,
          borderColor: theme.border,
          color: theme.text,
          fontSize: 14,
          minHeight: 80,
          textAlignVertical: 'top',
        }}
      />
      <CategorySearchPicker
        label="Bu Durağın Kategorisi"
        selectedCategory={waypoint.category}
        onSelect={(cat) => onUpdate('category', cat)}
      />

      <Text
        style={{
          color: theme.subtext,
          fontSize: 10,
          fontWeight: '800',
          textTransform: 'uppercase',
          marginBottom: 8,
          marginLeft: 4,
        }}
      >
        Fotoğraflar
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {waypoint.photos.map((photoObj: any, pIdx: number) => (
          <View
            key={pIdx}
            style={{ position: 'relative', marginRight: 12, marginBottom: 12 }}
          >
            <TouchableOpacity onPress={() => onEditTags(pIdx)}>
              <Image
                source={{ uri: photoObj.url }}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 24,
                  borderWidth: 1,
                  borderColor: theme.border,
                }}
              />
              {photoObj.tags?.length > 0 && (
                <View
                  style={{
                    position: 'absolute',
                    bottom: 6,
                    right: 6,
                    backgroundColor: theme.primary,
                    borderRadius: 999,
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                  }}
                >
                  <Text
                    style={{
                      color: theme.accentText,
                      fontSize: 8,
                      fontWeight: '900',
                    }}
                  >
                    {photoObj.tags.length}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity
          onPress={onPickImage}
          disabled={isUploading}
          style={{
            width: 80,
            height: 80,
            backgroundColor: theme.surface,
            borderRadius: 24,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderStyle: 'dashed',
            borderColor: theme.border,
          }}
        >
          {isUploading ? (
            <ActivityIndicator size="small" color={theme.primary} />
          ) : (
            <View style={{ alignItems: 'center' }}>
              <Ionicons name="camera" size={24} color={theme.subtext} />
              <Text
                style={{
                  color: theme.subtext,
                  fontSize: 8,
                  fontWeight: '800',
                  marginTop: 6,
                }}
              >
                EKLE
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};
