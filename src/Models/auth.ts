export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  username: string;
  name: string;
}

export interface SendPasswordResetCodeDto {
  email: string;
}

export interface ResetPasswordDto {
  email: string;
  resetCode: string;
  newPassword: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  username?: string;
}

export interface UserDto {
  id: string;
  email: string;
  username: string;
  name: string;
  membershipId: string;
  role: 'Admin' | 'Member';
  isActive: boolean;
  createdAt: string;
}
