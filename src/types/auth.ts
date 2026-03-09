// src/types/auth.ts

export interface User {
  id: string;
  username: string;
  email: string;
}

export interface AuthResponse {
  user: User;
  session_id: string;
  message?: string;
}

export interface ApiError {
  message: string;
}
