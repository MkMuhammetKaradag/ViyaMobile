export interface UserProfile {
  id: string;
  email: string;
  username: string;
  first_name: string | null;
  last_name: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
  avatar_url: string | null;
  banner_url: string | null;
  is_private: boolean | null;
  is_following: boolean | null;
  is_requested: boolean | null;
  is_me: boolean;
  preferences: string[];
}
