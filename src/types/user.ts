export const Role = {
  SUPERADMIN: "SUPERADMIN",
  ADMIN: "ADMIN",
  STANDARD: "STANDARD",
  READONLY: "READONLY",
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export interface PasswordResetDto {
  oldPassword: string;
  newPassword: string;
}

export interface UserCreateDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: Role;
  avatarUrl?: string | null;
}

export interface UserUpdateDto {
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: Role;
  avatarUrl?: string | null;
}

export interface UserResponseDto {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  createdAt: string;
  role: Role;
}
