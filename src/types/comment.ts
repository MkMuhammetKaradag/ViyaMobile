export interface TripComment {
  id: string;
  trip_id: string;
  user_id: string;
  parent_id: string | null;
  username: string;
  avatar_url: string;
  content: string;
  reply_count: number;
  created_at: string;
}
