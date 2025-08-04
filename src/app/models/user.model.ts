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

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
    name: string;
  };
}
