export interface User {
  id: number;
  email: string;
  username: string;
  phone: string;
  role: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user?: User; 
}
