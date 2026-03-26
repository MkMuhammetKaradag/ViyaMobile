import { create } from 'zustand';
import { apiClient } from '../api/client';
import { UserProfile } from '../types/user';

interface UserState {
  user: UserProfile | null;
  loading: boolean;
  // Aksiyonlar
  setUser: (user: UserProfile) => void;
  fetchUser: () => Promise<void>;
  updateUserLocal: (updatedData: Partial<UserProfile>) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  loading: false,

  // Kullanıcıyı direkt set etme
  setUser: (user) => set({ user }),

  // API'den güncel profili çekme
  fetchUser: async () => {
    set({ loading: true });
    try {
      const res = await apiClient.get<{ user: UserProfile }>(
        '/api/v1/users/me',
      );
      set({ user: res.data.user });
    } finally {
      set({ loading: false });
    }
  },

  // Düzenleme sayfasından gelince anında arayüzü güncelleme (Sihirli dokunuş!)
  updateUserLocal: (updatedData) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updatedData } : null,
    })),
}));
