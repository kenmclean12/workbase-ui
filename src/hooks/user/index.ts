import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { useAuthContext } from "../../context";
import type {
  PasswordResetDto,
  UserCreateDto,
  UserInviteBulkCreateDto,
  UserResponseDto,
  UserUpdateDto,
} from "../../types/user";

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
  const { fetchWithAuth, user } = useAuthContext();

  return useQuery<UserResponseDto>({
    ...options,
    // The service has no /user/me endpoint. AuthProvider resolves this user
    // from the JWT `sub` claim; this hook refreshes that same user's record.
    queryKey: ["user", user?.id],
    queryFn: () => {
      if (!user?.id) throw new Error("You are not signed in.");
      return request<UserResponseDto>(fetchWithAuth, `${BASE_URL}/${user.id}`);
    },
    enabled: Boolean(user?.id) && (options?.enabled ?? true),
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

export function useUsersGetByClient(
  clientId?: number,
  options?: { enabled?: boolean },
) {
  const { fetchWithAuth } = useAuthContext();

  return useQuery<UserResponseDto[]>({
    queryKey: ["users", "client", clientId],
    queryFn: () =>
      request<UserResponseDto[]>(fetchWithAuth, `${BASE_URL}/client/${clientId}`),
    enabled: !!clientId,
    ...options,
  });
}

export function useAssignableUsersGetAll(options?: { enabled?: boolean }) {
  const { fetchWithAuth } = useAuthContext();

  return useQuery<UserResponseDto[]>({
    queryKey: ["users", "assignable"],
    queryFn: () =>
      request<UserResponseDto[]>(fetchWithAuth, `${BASE_URL}/assignable-users`),
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

export function useUserInviteCreate(options?: { onSuccess?: () => void }) {
  const qc = useQueryClient();
  const { fetchWithAuth } = useAuthContext();

  return useMutation({
    mutationFn: async (dto: UserInviteBulkCreateDto) => {
      const response = await fetchWithAuth("/user-invites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "User invite creation failed");
      }
    },
    onSuccess: async () => {
      options?.onSuccess?.();
      await qc.invalidateQueries({ queryKey: ["users"] });
      enqueueSnackbar("User invitations sent successfully", { variant: "success" });
    },
    onError: (error: Error) => {
      enqueueSnackbar(error.message, { variant: "error" });
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
