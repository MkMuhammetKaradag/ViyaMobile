import { apiClient } from '@/src/api/client';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, Platform } from 'react-native';

export type WaypointImage = {
  uri: string;
  tags: WaypointTag[];
};

export type WaypointTag = {
  label: string;
  x_pos: number;
  y_pos: number;
};

export function useAddWaypoint() {
  const { tripId, nextOrder } = useLocalSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [note, setNote] = useState('');
  const [location, setLocation] = useState({
    latitude: 39.9334,
    longitude: 32.8597,
  });
  const [images, setImages] = useState<WaypointImage[]>([]);

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
      setImages((prev) => [...prev, { uri: result.assets[0].uri, tags: [] }]);
    }
  }, []);

  const removeImage = useCallback((index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }, []);

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

  const handleSave = useCallback(async () => {
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
        const uri =
          Platform.OS === 'android' ? img.uri : img.uri.replace('file://', '');
        formData.append('images', {
          uri,
          name: `wp_photo_${index}.jpg`,
          type: 'image/jpeg',
        } as any);
        formData.append(`tags_${index}`, JSON.stringify(img.tags || []));
      });

      await apiClient.post('/api/v1/waypoints', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      Alert.alert('Başarılı', 'Durak eklendi!', [
        { text: 'Tamam', onPress: () => router.back() },
      ]);
    } catch {
      Alert.alert('Hata', 'Kaydedilemedi.');
    } finally {
      setLoading(false);
    }
  }, [title, desc, note, location, images, tripId, nextOrder, router]);

  return {
    loading,
    title,
    setTitle,
    desc,
    setDesc,
    note,
    setNote,
    location,
    setLocation,
    images,
    pickImage,
    removeImage,
    addTag,
    updateTag,
    deleteTag,
    handleSave,
  };
}
