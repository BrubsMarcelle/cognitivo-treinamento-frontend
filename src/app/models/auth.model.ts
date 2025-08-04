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
