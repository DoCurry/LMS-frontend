import { UserRole } from './enums';

export interface UserDto {
  id: string;
  email: string;
  username: string;
  membershipId: string;
  role: UserRole;
  isActive: boolean;
  isDiscountAvailable: boolean;
  createdAt: Date;
  lastUpdated?: Date;
  orderCount: number;
  reviewCount: number;
  bookmarkCount: number;
}

export interface RegisterDto {
  email: string;
  username: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface SendPasswordResetCodeDto {
  email: string;
}

export interface ResetPasswordDto {
  email: string;
  resetCode: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UpdateUserDto {
  username?: string;
  email?: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface AuthResponseDto {
  token: string;
  refreshToken: string;
  expiresAt: Date;
  user: UserDto;
}
