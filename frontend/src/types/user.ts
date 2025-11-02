export type UserRole = 'athlete' | 'coach' | 'physio' | 'admin';

export type User = {
  id: string;
  name?: string;
  email: string;
  role: UserRole;
  gender?: 'male' | 'female';
  age?: number;
  heightCm?: number;
  weightKg?: number;
  bmi?: number;
  avatar?: string;
};
