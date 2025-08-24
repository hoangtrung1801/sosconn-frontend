export interface User {
  id: string
  email: string
  username: string
  fullName?: string
  avatar?: string
  role: 'admin' | 'user' | 'moderator'
  createdAt: string
  updatedAt: string
}

export interface UserType {
  id: string
  email: string
  username: string
  fullName?: string
  avatar?: string
  role: 'admin' | 'user' | 'moderator'
  createdAt: string
  updatedAt: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  username: string
  password: string
  fullName?: string
}

export interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
}