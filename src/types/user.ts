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
  preferences: string[];
}
