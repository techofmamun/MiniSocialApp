// User types for authentication and profiles
export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  photoURL?: string | null;
  bio?: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  username: string;
  displayName: string;
}
