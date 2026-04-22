import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../api/client';

export function useUserSearch(query: string) {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 10;

  // Sorgu değiştiğinde her şeyi sıfırla
  useEffect(() => {
    if (query.length < 2) {
      setUsers([]);
      setHasMore(false);
      return;
    }

    const timer = setTimeout(() => {
      searchUsers(1, true);
    }, 400); // 400ms bekleme (Debounce)

    return () => clearTimeout(timer);
  }, [query]);

  const searchUsers = async (pageNum: number, isNewSearch = false) => {
    if (loading || (!isNewSearch && !hasMore)) return;

    setLoading(true);
    try {
      const response = await apiClient.get(`/api/v1/users/search?q=${query}&page=${pageNum}&limit=${LIMIT}`);
      const newUsers = response.data.users || [];

      setUsers(prev => isNewSearch ? newUsers : [...prev, ...newUsers]);
      setPage(pageNum);
      setHasMore(newUsers.length === LIMIT);
    } catch (error) {
      console.error("User search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreUsers = () => {
    if (hasMore && !loading) {
      searchUsers(page + 1);
    }
  };

  return { users, loading, loadMoreUsers };
}