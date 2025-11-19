export interface User {
  id: number;
  username: string;
  email: string;
}

export interface LoginResponse {
  message: string;
  access_token: string;
  user: User;
}