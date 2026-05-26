import { apiClient } from '@/src/api/client';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert, Platform } from 'react-native';

export type WaypointImage = {
  uri: string;
  isNew?: boolean; // Mevcut fotoğraflarla yenileri ayırt etmek için
  tags: WaypointTag[];
};

export type WaypointTag = {
  label: string;
  x_pos: number;
  y_pos: number;
};

interface InitialWaypointData {
  id: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  photos?: { id: string; url: string }[]; // Eğer mevcut fotoğraflar listelenecekse
}

export function useUpdateWaypoint(
  initialWaypoint: InitialWaypointData | null,
  onSuccess?: () => void,
) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [location, setLocation] = useState({
    latitude: 39.9334,
    longitude: 32.8597,
  });
  const [images, setImages] = useState<WaypointImage[]>([]);

  // 1. Düzenlenecek durak verisi geldiğinde state'leri doldur
  useEffect(() => {
    if (initialWaypoint) {
      setTitle(initialWaypoint.title);
      setDesc(initialWaypoint.description || '');
      setLocation({
        latitude: initialWaypoint.latitude,
        longitude: initialWaypoint.longitude,
      });

      // Eğer eski fotoğrafları da etiketleriyle göstermek istersen buraya haritalayabilirsin.
      // Şimdilik sadece yeni eklenecek fotoğraflar için boş array çekiyoruz.
      setImages([]);
    }
  }, [initialWaypoint]);

  // 2. Fotoğraf Seçme Mekanizması
  const pickImage = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Hata', 'Galeri izni gerekli.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [4, 5],
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.[0]) {
      setImages((prev) => [
        ...prev,
        { uri: result.assets[0].uri, isNew: true, tags: [] },
      ]);
    }
  }, []);

  const removeImage = useCallback((index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // 3. Fotoğraf Etiket (Tag) Yönetimi
  const addTag = useCallback((photoIndex: number, tag: WaypointTag) => {
    setImages((prev) => {
      const updated = [...prev];
      updated[photoIndex] = {
        ...updated[photoIndex],
        tags: [...updated[photoIndex].tags, tag],
      };
      return updated;
    });
  }, []);

  const updateTag = useCallback(
    (photoIndex: number, tagIndex: number, label: string) => {
      setImages((prev) => {
        const updated = [...prev];
        const tags = [...updated[photoIndex].tags];
        tags[tagIndex] = { ...tags[tagIndex], label };
        updated[photoIndex] = { ...updated[photoIndex], tags };
        return updated;
      });
    },
    [],
  );

  const deleteTag = useCallback((photoIndex: number, tagIndex: number) => {
    setImages((prev) => {
      const updated = [...prev];
      const tags = [...updated[photoIndex].tags];
      tags.splice(tagIndex, 1);
      updated[photoIndex] = { ...updated[photoIndex], tags };
      return updated;
    });
  }, []);

  // 4. Güncelleme ve Fotoğraf Yükleme Operasyonu (Ana Fonksiyon)
  const handleUpdate = useCallback(async () => {
    if (!initialWaypoint?.id) return;
    if (!title) return Alert.alert('Hata', 'Durak başlığı gerekli.');

    setLoading(true);

    try {
      
      await apiClient.put(`/api/v1/waypoints/${initialWaypoint.id}`, {
        title: title,
        description: desc,
        latitude: location.latitude,
        longitude: location.longitude,
      });

    
      const newImages = images.filter((img) => img.isNew);

      if (newImages.length > 0) {
        const formData = new FormData();

        newImages.forEach((img, index) => {
          const uri =
            Platform.OS === 'android'
              ? img.uri
              : img.uri.replace('file://', '');

          formData.append('images', {
            uri,
            name: `wp_update_photo_${index}.jpg`,
            type: 'image/jpeg',
          } as any);

         
          formData.append(`tags_${index}`, JSON.stringify(img.tags || []));
        });

        await apiClient.post(
          `/api/v1/waypoints/${initialWaypoint.id}/photos`,
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          },
        );
      }

      Alert.alert('Başarılı', 'Durak pürüzsüzce güncellendi!', [
        {
          text: 'Tamam',
          onPress: () => {
            if (onSuccess) onSuccess();
          },
        },
      ]);
    } catch (error) {
      console.error('Update waypoint error:', error);
      Alert.alert('Hata', 'Güncelleme sırasında bir sorun oluştu.');
    } finally {
      setLoading(false);
    }
  }, [title, desc, location, images, initialWaypoint, onSuccess]);

  return {
    loading,
    title,
    setTitle,
    desc,
    setDesc,
    location,
    setLocation,
    images,
    pickImage,
    removeImage,
    addTag,
    updateTag,
    deleteTag,
    handleUpdate,
  };
}
