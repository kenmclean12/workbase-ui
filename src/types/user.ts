export const Role = {
  SUPERADMIN: "SUPERADMIN",
  ADMIN: "ADMIN",
  STANDARD: "STANDARD",
  READONLY: "READONLY",
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export const USER_ROLE_LABELS: Record<string, string> = {
  [Role.SUPERADMIN]: "Super Admin",
  [Role.ADMIN]: "Admin",
  [Role.STANDARD]: "Standard",
  [Role.READONLY]: "Read Only",
  "4": "Super Admin",
  "3": "Admin",
  "2": "Standard",
  "1": "Read Only",
};

export function getUserRoleLabel(role: string | number | null | undefined) {
  if (role == null) return "Unknown Role";

  if (typeof role === "number") {
    return USER_ROLE_LABELS[String(role)] ?? "Unknown Role";
  }

  return USER_ROLE_LABELS[role] ?? role
    .replace(/_/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

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

export type UserInviteBulkCreateDto = {
  emails: string[];
  role?: number;
  clientId?: number;
  invitedByUserId: number;
};

export interface UserResponseDto {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  createdAt: string;
  role: Role;
}
