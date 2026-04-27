import { apiClient } from '@/src/api/client';
import { uploadToCloudinary } from '@/src/utils/cloudinary';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, Platform } from 'react-native';

export type WaypointDraft = {
  title: string;
  note: string;
  photos: PhotoDraft[];
  latitude: number;
  longitude: number;
  order_index: number;
  category: Category; // Backend'e sadece ID'leri gönderiyoruz
};

export type PhotoDraft = {
  url: string;
  tags: TagDraft[];
};
export type Category = {
  id: string;
  name: string;
};

export type TagDraft = {
  label: string;
  x_pos: number;
  y_pos: number;
};

export function useCreateTrip() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  // Form alanları
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isPublic, setIsPublic] = useState(true);
  const [publishedAt, setPublishedAt] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [waypoints, setWaypoints] = useState<WaypointDraft[]>([]);
  const [coverImageUrl, setCoverImageUrl] = useState<string>('');
  const [isCoverUploading, setIsCoverUploading] = useState(false);
  const [category, setCategory] = useState<Category | null>(null);

  // Yeniye:
  const [categories, setCategories] = useState<Category[]>([]);
  const onDateChange = useCallback((_event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') setShowPicker(false);
    if (selectedDate) setPublishedAt(selectedDate);
  }, []);

  const addWaypoint = useCallback(() => {
    setWaypoints((prev) => [
      ...prev,
      {
        title: '',
        note: '',
        photos: [],
        latitude: 0,
        longitude: 0,
        order_index: prev.length,
        category: {
          id: '',
          name: '',
        },
      },
    ]);
  }, []);

  const removeWaypoint = useCallback((index: number) => {
    setWaypoints((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const updateWaypoint = useCallback(
    (index: number, field: keyof WaypointDraft, value: any) => {
      setWaypoints((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], [field]: value };
        return updated;
      });
    },
    [],
  );

  const pickImage = useCallback(async (waypointIndex: number) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 5],
      quality: 0.8,
    });

    if (!result.canceled) {
      setUploadingIndex(waypointIndex);
      try {
        const url = await uploadToCloudinary(result.assets[0].uri);
        setWaypoints((prev) => {
          const updated = [...prev];
          updated[waypointIndex].photos.push({ url, tags: [] });
          return updated;
        });
      } catch {
        Alert.alert('Hata', 'Resim yüklenemedi.');
      } finally {
        setUploadingIndex(null);
      }
    }
  }, []);

  const removeImage = useCallback(
    (waypointIndex: number, photoIndex: number) => {
      setWaypoints((prev) => {
        const updated = [...prev];
        updated[waypointIndex].photos.splice(photoIndex, 1);
        return updated;
      });
    },
    [],
  );
  const pickCoverImage = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      setIsCoverUploading(true);
      try {
        const url = await uploadToCloudinary(result.assets[0].uri);
        setCoverImageUrl(url);
      } catch (error) {
        Alert.alert('Hata', 'Kapak resmi yüklenemedi.');
      } finally {
        setIsCoverUploading(false);
      }
    }
  }, []);

  const removeCoverImage = () => {
    setCoverImageUrl('');
  };
  const updateWaypointLocation = useCallback(
    (waypointIndex: number, latitude: number, longitude: number) => {
      setWaypoints((prev) => {
        const updated = [...prev];
        updated[waypointIndex] = {
          ...updated[waypointIndex],
          latitude,
          longitude,
        };
        return updated;
      });
    },
    [],
  );

  const addTag = useCallback(
    (waypointIndex: number, photoIndex: number, tag: TagDraft) => {
      setWaypoints((prev) => {
        const updated = [...prev];
        updated[waypointIndex].photos[photoIndex].tags.push(tag);
        return updated;
      });
    },
    [],
  );

  const updateTag = useCallback(
    (
      waypointIndex: number,
      photoIndex: number,
      tagIndex: number,
      label: string,
    ) => {
      setWaypoints((prev) => {
        const updated = [...prev];
        updated[waypointIndex].photos[photoIndex].tags[tagIndex].label = label;
        return updated;
      });
    },
    [],
  );

  const deleteTag = useCallback(
    (waypointIndex: number, photoIndex: number, tagIndex: number) => {
      setWaypoints((prev) => {
        const updated = [...prev];
        updated[waypointIndex].photos[photoIndex].tags.splice(tagIndex, 1);
        return updated;
      });
    },
    [],
  );
  const addCategory = (cat: Category) => {
    setCategories((prev) =>
      prev.find((c) => c.id === cat.id) ? prev : [...prev, cat],
    );
  };

  const removeCategory = (catId: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== catId));
  };

  const handleSave = useCallback(async () => {
    if (title.length < 3) {
      return Alert.alert('Hata', 'Başlık çok kısa.');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (publishedAt < today) {
      return Alert.alert(
        'Hata',
        'Geçmişe dönük bir paylaşım tarihi seçemezsiniz.',
      );
    }

    setLoading(true);
    try {
      const payload = {
        title,
        desc,
        is_active: isActive,
        is_public: isPublic,
        waypoints: waypoints.map((wp) => ({
          ...wp,
          photos: wp.photos.map((p) => ({ url: p.url, tags: p.tags || [] })),
          category_id: wp.category.id || undefined,
        })),
        published_at: publishedAt.toISOString(),
        category_ids: categories.map((c) => c.id),
        cover_image_url: coverImageUrl,
      };

      await apiClient.post('/api/v1/trips', payload);
      router.back();
    } catch (e) {
      console.error('Kaydetme Hatası:', e);
      Alert.alert('Hata', 'Kaydedilemedi.');
    } finally {
      setLoading(false);
    }
  }, [
    title,
    desc,
    isActive,
    isPublic,
    waypoints,
    publishedAt,
    router,
    categories,
    coverImageUrl,
  ]);

  return {
    // State
    title,
    setTitle,
    desc,
    setDesc,
    isActive,
    setIsActive,
    isPublic,
    setIsPublic,
    publishedAt,
    showPicker,
    setShowPicker,
    waypoints,
    loading,
    uploadingIndex,
    category,
    setCategory,
    categories,
    setCategories,
    coverImageUrl,
    isCoverUploading,

    // Actions
    addCategory,
    removeCategory,
    onDateChange,
    addWaypoint,
    removeWaypoint,
    updateWaypoint,
    pickImage,
    removeImage,
    updateWaypointLocation,
    addTag,
    updateTag,
    deleteTag,
    handleSave,

    pickCoverImage,
    removeCoverImage,
  };
}
