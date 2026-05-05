import { useState } from 'react';
import { Alert } from 'react-native';
import { apiClient } from '../../api/client';

export const useSocialActions = () => {
  const [loading, setLoading] = useState(false);

  const followUser = async (userId: string, onSuccess?: () => void) => {
    setLoading(true);
    try {
      await apiClient.post(`/api/v1/social/follow/${userId}`);
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error('Follow error:', error);
      Alert.alert('Hata', 'Takip işlemi başarısız oldu.');
    } finally {
      setLoading(false);
    }
  };

  const unfollowUser = async (userId: string, onSuccess?: () => void) => {
    setLoading(true);
    try {
      await apiClient.post(`/api/v1/social/unfollow/${userId}`);
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error('Unfollow error:', error);
      Alert.alert('Hata', 'Takipten çıkma işlemi başarısız oldu.');
    } finally {
      setLoading(false);
    }
  };

  return { followUser, unfollowUser, loading };
};
