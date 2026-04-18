import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { useAuthContext } from "../context";
import type {
  PasswordResetDto,
  UserCreateDto,
  UserResponseDto,
  UserUpdateDto,
} from "../types/user";

const BASE_URL = "/user";

async function request<T>(
  fetchWithAuth: (path: string, config?: RequestInit) => Promise<Response>,
  url: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetchWithAuth(url, options);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Request failed");
  }

  return res.json();
}

export function useUserMe(options?: { enabled?: boolean }) {
  const { fetchWithAuth } = useAuthContext();

  return useQuery<UserResponseDto>({
    queryKey: ["user", "me"],
    queryFn: () => request<UserResponseDto>(fetchWithAuth, `${BASE_URL}/me`),
    ...options,
  });
}

export function useUsersGetAll(options?: { enabled?: boolean }) {
  const { fetchWithAuth } = useAuthContext();

  return useQuery<UserResponseDto[]>({
    queryKey: ["users"],
    queryFn: () => request<UserResponseDto[]>(fetchWithAuth, `${BASE_URL}`),
    ...options,
  });
}

export function useUserGetById(id?: number, options?: { enabled?: boolean }) {
  const { fetchWithAuth } = useAuthContext();

  return useQuery<UserResponseDto>({
    queryKey: ["user", id],
    queryFn: () => request<UserResponseDto>(fetchWithAuth, `${BASE_URL}/${id}`),
    enabled: !!id,
    ...options,
  });
}

export function useUserCreate() {
  const qc = useQueryClient();
  const { fetchWithAuth } = useAuthContext();

  return useMutation({
    mutationFn: (dto: UserCreateDto) =>
      request<UserResponseDto>(fetchWithAuth, `${BASE_URL}`, {
        method: "POST",
        body: JSON.stringify(dto),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
      enqueueSnackbar("User created successfully", {
        variant: "success",
      });
    },
    onError: (err: Error) => {
      enqueueSnackbar(err.message, {
        variant: "error",
      });
    },
  });
}

export function useUserUpdate(id: number) {
  const qc = useQueryClient();
  const { fetchWithAuth } = useAuthContext();

  return useMutation({
    mutationFn: (dto: UserUpdateDto) =>
      request<UserResponseDto>(fetchWithAuth, `${BASE_URL}/${id}`, {
        method: "PATCH",
        body: JSON.stringify(dto),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
      qc.invalidateQueries({ queryKey: ["user", id] });
      enqueueSnackbar("User updated successfully", {
        variant: "success",
      });
    },
    onError: (err: Error) => {
      enqueueSnackbar(err.message, {
        variant: "error",
      });
    },
  });
}

export function useUserChangePassword(id: number) {
  const qc = useQueryClient();
  const { fetchWithAuth } = useAuthContext();

  return useMutation({
    mutationFn: (dto: PasswordResetDto) =>
      request<UserResponseDto>(
        fetchWithAuth,
        `${BASE_URL}/change-password/${id}`,
        {
          method: "PATCH",
          body: JSON.stringify(dto),
        },
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["user", id] });
      enqueueSnackbar("Password changed successfully", {
        variant: "success",
      });
    },
    onError: (err: Error) => {
      enqueueSnackbar(err.message, {
        variant: "error",
      });
    },
  });
}

export function useUserDelete(id: number) {
  const qc = useQueryClient();
  const { fetchWithAuth } = useAuthContext();

  return useMutation({
    mutationFn: () =>
      request<UserResponseDto>(fetchWithAuth, `${BASE_URL}/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
      qc.invalidateQueries({ queryKey: ["user", id] });
      enqueueSnackbar("User deleted successfully", {
        variant: "success",
      });
    },
    onError: (err: Error) => {
      enqueueSnackbar(err.message, {
        variant: "error",
      });
    },
  });
}
