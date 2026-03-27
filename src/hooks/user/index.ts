import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "../../context/AuthContext";
import { apiFetch } from "../apiFetch";

/* =========================
   ROLE ENUM (frontend-safe)
========================= */

export enum Role {
  SUPERADMIN = "1",
  ADMIN = "2",
  STANDARD = "3",
  READONLY = "4",
}

/* =========================
   TYPES (match backend DTOs)
========================= */

export type User = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  createdAt: string;
  role: Role;
};

export type UserCreateInput = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: Role;
  avatarUrl?: string | null;
};

export type UserUpdateInput = Partial<Omit<UserCreateInput, "password">>;

/* =========================
   QUERY KEYS (scalable pattern)
========================= */

export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: () => userKeys.all,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: number) => [...userKeys.details(), id] as const,
  me: () => [...userKeys.all, "me"] as const,
};

/* =========================
   QUERIES
========================= */

export function useUserFindSelf() {
  const { token } = useAuthContext();

  return useQuery<User>({
    queryKey: userKeys.me(),
    queryFn: () => apiFetch<User>("/user/me", {}, token),
    enabled: !!token,
    staleTime: 1000 * 60 * 5,
  });
}

export function useUserFindOne(id: number) {
  const { token } = useAuthContext();

  return useQuery<User>({
    queryKey: userKeys.detail(id),
    queryFn: () => apiFetch<User>(`/user/${id}`, {}, token),
    enabled: !!id && !!token,
  });
}

export function useUsersFindAll() {
  const { token } = useAuthContext();

  return useQuery<User[]>({
    queryKey: userKeys.list(),
    queryFn: () => apiFetch<User[]>("/user", {}),
    enabled: !!token,
  });
}

/* =========================
   MUTATIONS
========================= */

export function useCreateUserMutation() {
  const queryClient = useQueryClient();
  const { token } = useAuthContext();

  return useMutation<User, Error, UserCreateInput>({
    mutationFn: (dto) =>
      apiFetch<User>(
        "/user",
        {
          method: "POST",
          body: JSON.stringify(dto),
        },
        token,
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.list() });
    },

    onError: (err) => {
      console.error("Create user failed:", err.message);
    },
  });
}

export function useUpdateUserMutation() {
  const queryClient = useQueryClient();
  const { token } = useAuthContext();

  return useMutation<User, Error, { id: number; dto: UserUpdateInput }>({
    mutationFn: ({ id, dto }) =>
      apiFetch<User>(
        `/user/${id}`,
        {
          method: "PATCH",
          body: JSON.stringify(dto),
        },
        token,
      ),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.list() });
      queryClient.invalidateQueries({
        queryKey: userKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: userKeys.me() });
    },

    onError: (err) => {
      console.error("Update failed:", err.message);
    },
  });
}

/* =========================
   DELETE USER
========================= */

export function useDeleteUserMutation() {
  const queryClient = useQueryClient();
  const { token } = useAuthContext();

  return useMutation<void, Error, number>({
    mutationFn: (id) =>
      apiFetch(
        `/user/${id}`,
        {
          method: "DELETE",
        },
        token,
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.list() });
    },

    onError: (err) => {
      console.error("Delete failed:", err.message);
    },
  });
}
