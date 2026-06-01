import { apiClient } from '@/src/api/client';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

interface Trip {
  id: string;
  title: string;
  description?: string;
  is_public: boolean;
  is_active: boolean;
  category_ids?: string[];
  cover_image_url?: string;
}

export function useUpdateTrip(trip: Trip | null, onComplete: () => void) {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [isActive, setIsActive] = useState(true);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [isCoverUploading, setIsCoverUploading] = useState(false);
  useEffect(() => {
    if (trip) {
      setTitle(trip.title);
      setDesc(trip.description || '');
      setIsPublic(trip.is_public);
      setIsActive(trip.is_active);
      setCoverImageUrl(trip.cover_image_url || null);
    }
  }, [trip]);

  const handleUpdateTrip = async () => {
    if (!trip) return;
    if (!title.trim() || title.length < 3) {
      Alert.alert('Hata', 'Gezi başlığı en az 3 karakter olmalıdır.');
      return;
    }

    setLoading(true);
    try {
      const body = {
        title: title.trim(),
        desc: desc.trim() || null,
        is_public: isPublic,
        is_active: isActive,
        cover_image_url: coverImageUrl,
      };

      await apiClient.put(`/api/v1/trips/${trip.id}`, body);

      Alert.alert('Başarılı', 'Gezi planı başarıyla güncellendi.');
      onComplete();
    } catch (error: any) {
      console.error('Trip update error:', error);
      const errorMsg =
        error.response?.data?.error || 'Gezi güncellenirken bir hata oluştu.';
      Alert.alert('Hata', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    title,
    setTitle,
    desc,
    setDesc,
    isPublic,
    setIsPublic,
    isActive,
    setIsActive,
    coverImageUrl,
    setCoverImageUrl,
    isCoverUploading,
    setIsCoverUploading,
    handleUpdateTrip,
  };
}
