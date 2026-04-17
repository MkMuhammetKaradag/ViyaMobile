// src/types/trip.ts

export interface TripSummary {
  id: string; // UUID
  title: string;
  cover_image_url: string | null; // Akıllı kapak mantığından gelen URL
  is_public: boolean;
  view_count: number;
  waypoint_count: number; // SQL'deki COUNT(*) sonucu
  created_at: string; // ISO Date string
}

// Eğer detay sayfasına geçeceksen ilerde lazım olur:
export interface Waypoint {
  id: string;
  title: string;
  description: string;
  order_index: number;
  latitude: number;
  longitude: number;
  note?: string;
  photos: string[];
}
export interface TripExploreDTO {
  id: string;
  user_id: string;
  title: string;
  display_image: string | null; // Go'daki *string karşılığı
  total_likes: number;
  total_comments: number;
  view_count: number;
  waypoint_count: number;
  owner_username: string;
  owner_avatar: string | null;
  published_at: string; // ISO formatında gelecek
}
