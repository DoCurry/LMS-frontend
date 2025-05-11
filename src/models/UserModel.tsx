export enum UserRole {
    Admin = 'Admin',
    User = 'User',
    Librarian = 'Librarian',
    // Add other roles as needed
  }
  
  export interface UserDto {
    id: string;
    email: string;
    username: string;
    membershipId: string;
    role: UserRole;
    isActive: boolean;
    isDiscountAvailable: boolean;
    createdAt: string; 
    lastUpdated?: string; 
    orderCount: number;
    reviewCount: number;
    bookmarkCount: number;
  }
  
  export interface UpdateUserDto {
    email?: string;
    username?: string;
    role?: UserRole;
  }
  
  export interface LoginDto {
    email: string;
    password: string;
  }
  
  export interface RegisterDto {
    email: string;
    username: string;
    password: string;
    membershipId: string;
  }
  
  export interface LoginResponseDto {
    userId: string;
    email: string;
    username: string;
    membershipId: string;
    role: string;
    token: string;
  }
  
  export interface ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
  }
  
  export interface AuthResponseDto {
    token: string;
    refreshToken: string;
    expiresAt: string; // or Date
    user: UserDto;
  }
  