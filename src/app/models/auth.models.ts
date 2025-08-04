// Auth-related interfaces
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface CreateUserRequest {
  username: string;
  password: string;
  email: string;
  nome: string;
}

export interface ResetPasswordRequest {
  username: string;
  new_password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
    name: string;
  };
}

// User interface
export interface User {
  id: number;
  name: string;
  email: string;
  department: string;
  position: string;
  startDate: string;
  totalPoints: number;
  totalCheckins: number;
  currentStreak: number;
}

// Checkin-related interfaces
export interface CheckinRequest {
  userId?: number;
  timestamp?: string;
  location?: string;
  notes?: string;
}

export interface CheckinResponse {
  id: number;
  userId: number;
  timestamp: Date;
  location: string;
  notes: string;
  status: string;
}

export interface CheckinStatusResponse {
  canCheckIn: boolean;
  lastCheckin: Date | null;
  message: string;
  can_checkin?: boolean;
  reason?: string;
  today?: string;
  is_weekend?: boolean;
  already_checked_in?: boolean;
}
