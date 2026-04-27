import { useCallback, useEffect, useState } from 'react';
import { DeviceEventEmitter } from 'react-native';
import { apiClient } from '../api/client';
import { useUserStore } from '../store/useUserStore';
import { TripComment } from '../types/comment';

export function useComments(tripId: string) {
  const [comments, setComments] = useState<TripComment[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const currentUser = useUserStore.getState().user;

  const fetchComments = useCallback(
    async (isNextPage = false) => {
      if (loading || (!isNextPage && comments.length > 0)) return;

      setLoading(true);
      try {
        const currentPage = isNextPage ? page + 1 : 1;
        const response = await apiClient.get(
          `/api/v1/comments/trip/${tripId}?limit=10&page=${currentPage}`,
        );

        const newComments: TripComment[] = response.data.comments || [];

        if (isNextPage) {
          setComments((prev) => [...prev, ...newComments]);
          setPage(currentPage);
        } else {
          setComments(newComments);
          setPage(1);
        }

        setHasMore(newComments.length === 10);
      } catch (error) {
        console.error('Yorumlar yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    },
    [tripId, page, loading],
  );

  const addComment = async (content: string, parentId?: string) => {
    try {
      if (!currentUser) {
        throw new Error('Yorum yapmak için giriş yapmalısınız.');
      }
      const response = await apiClient.post('/api/v1/comments', {
        trip_id: tripId,
        content: content,
        parent_id: parentId || null,
      });
      const result = response.data;
      const newComment: TripComment = {
        id: result?.id || Math.random().toString(),
        trip_id: tripId,
        user_id: currentUser.id,
        parent_id: parentId || null,
        content: content,
        username: currentUser.username || 'Gezgin',
        avatar_url:
          currentUser.avatar_url || 'https://www.gravatar.com/avatar?d=mp',
        reply_count: 0,
        created_at: new Date().toISOString(),
      };

      if (!parentId) {
        setComments((prev) => [newComment, ...prev]);
        // Yeni yorumu listenin en başına koyduk.
      } else {
        // Eğer backend sadece ID dönüyorsa, listeyi baştan çekebilirsin:
        DeviceEventEmitter.emit(`NEW_REPLY_${parentId}`, newComment);
        fetchComments();
      }

      return response.data;
    } catch (error: any) {
      const msg = error.response?.data?.error || 'Yorum gönderilemedi';
      throw new Error(msg);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [tripId]);

  return {
    comments,
    loading,
    hasMore,
    loadMore: () => fetchComments(true),
    addComment,
  };
}
