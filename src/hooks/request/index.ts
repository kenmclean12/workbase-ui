import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { useAuthContext } from "../../context";
import {
  type RequestCreateDto,
  type RequestNoteResponseDto,
  type RequestResponseDto,
  type RequestStatus,
} from "../../types/request";
import type { UserResponseDto } from "../../types/user";

async function request<T>(
  fetchWithAuth: (path: string, config?: RequestInit) => Promise<Response>,
  url: string,
  config?: RequestInit,
): Promise<T> {
  const res = await fetchWithAuth(url, config);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Request failed");
  }

  return res.json() as Promise<T>;
}

export type RequestHistoryEntryDto = {
  id: number;
  requestId: number;
  request?: RequestResponseDto | null;
  userId: number;
  user?: UserResponseDto | null;
  action: string;
  createdAt: string;
  details?: string | null;
};

export function useRequestsGetAll(options?: { enabled?: boolean }) {
  const { fetchWithAuth } = useAuthContext();
  return useQuery<RequestResponseDto[]>({
    queryKey: ["requests"],
    queryFn: () => request<RequestResponseDto[]>(fetchWithAuth, `/request/`),
    ...options,
  });
}

export function useRequestsGetByClient(
  clientId?: number,
  options?: { enabled?: boolean },
) {
  const { fetchWithAuth } = useAuthContext();
  return useQuery<RequestResponseDto[]>({
    queryKey: ["requests", "client", clientId],
    queryFn: () => request<RequestResponseDto[]>(fetchWithAuth, `/request/client/${clientId}`),
    enabled: !!clientId,
    ...options,
  });
}

export function useRequestsGetByUser(
  userId?: number,
  options?: { enabled?: boolean },
) {
  const { fetchWithAuth } = useAuthContext();
  return useQuery<RequestResponseDto[]>({
    queryKey: ["requests", "user", userId],
    queryFn: () => request<RequestResponseDto[]>(fetchWithAuth, `/request/user/${userId}`),
    enabled: !!userId,
    ...options,
  });
}

export function useRequestCreate(options?: { onSuccess?: () => void }) {
  const qc = useQueryClient();
  const { fetchWithAuth } = useAuthContext();

  return useMutation({
    mutationFn: async (dto: RequestCreateDto) => {
      const response = await fetchWithAuth("/request/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto),
      });

      const text = await response.text();
      if (!response.ok) {
        throw new Error(text || "Request creation failed");
      }

      return text ? (JSON.parse(text) as RequestResponseDto) : null;
    },
    onSuccess: async () => {
      options?.onSuccess?.();
      await qc.invalidateQueries({ queryKey: ["requests"] });
      enqueueSnackbar("Request created successfully", { variant: "success" });
    },
    onError: (error: Error) => {
      enqueueSnackbar(error.message, { variant: "error" });
    },
  });
}

export function useRequestHistory(requestId?: number, options?: { enabled?: boolean }) {
  const { fetchWithAuth } = useAuthContext();
  return useQuery<RequestHistoryEntryDto[]>({
    queryKey: ["request-history", requestId],
    queryFn: async () => {
      const payload = await request<unknown>(fetchWithAuth, `/request-history/request/${requestId}`);
      return Array.isArray(payload) ? (payload as RequestHistoryEntryDto[]) : [];
    },
    enabled: !!requestId,
    ...options,
  });
}

export function useUserActivity(userId?: number, options?: { enabled?: boolean }) {
  const { fetchWithAuth } = useAuthContext();
  return useQuery<RequestHistoryEntryDto[]>({
    queryKey: ["request-history", "user", userId],
    queryFn: async () => {
      const payload = await request<unknown>(fetchWithAuth, `/request-history/user/${userId}`);
      return Array.isArray(payload) ? (payload as RequestHistoryEntryDto[]) : [];
    },
    enabled: !!userId,
    ...options,
  });
}

export function useRequestUpdate(
  requestId?: number,
  options?: { onSuccess?: () => void },
) {
  const qc = useQueryClient();
  const { fetchWithAuth } = useAuthContext();

  return useMutation({
    mutationFn: (dto: {
      actionUserId: number;
      status?: RequestStatus;
      assignedToUserId?: number | null;
    }) => {
      return fetchWithAuth(`/request/${requestId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dto),
      }).then(async (res) => {
        const text = await res.text();
        if (!res.ok) {
          throw new Error(text || "Request update failed");
        }

        return text ? (JSON.parse(text) as RequestResponseDto) : null;
      });
    },
    onSuccess: async (_, __) => {
      await qc.invalidateQueries({ queryKey: ["requests"] });
      await qc.invalidateQueries({ queryKey: ["request-history"] });
      options?.onSuccess?.();
    },
  });
}

export function useRequestNotesGetByRequest(
  requestId?: number,
  options?: { enabled?: boolean },
) {
  const { fetchWithAuth } = useAuthContext();
  return useQuery<RequestNoteResponseDto[]>({
    queryKey: ["request-notes", requestId],
    queryFn: () => request<RequestNoteResponseDto[]>(fetchWithAuth, `/request-note/request/${requestId}`),
    enabled: !!requestId,
    ...options,
  });
}

export function useRequestNoteCreate(
  options?: { onSuccess?: () => void },
) {
  const qc = useQueryClient();
  const { fetchWithAuth } = useAuthContext();

  return useMutation({
    mutationFn: (dto: {
      requestId: number;
      createdByUserId: number;
      content: string;
    }) =>
      fetchWithAuth(`/request-note/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dto),
      }).then(async (res) => {
        const text = await res.text();
        if (!res.ok) {
          throw new Error(text || "Request note create failed");
        }

        return text ? (JSON.parse(text) as RequestNoteResponseDto) : null;
      }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["request-notes"] });
      options?.onSuccess?.();
    },
  });
}

export function useRequestNoteUpdate(
  options?: { onSuccess?: () => void },
) {
  const qc = useQueryClient();
  const { fetchWithAuth } = useAuthContext();

  return useMutation({
    mutationFn: (dto: {
      id: number;
      content: string;
    }) =>
      fetchWithAuth(`/request-note/${dto.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: dto.content }),
      }).then(async (res) => {
        const text = await res.text();
        if (!res.ok) {
          throw new Error(text || "Request note update failed");
        }

        return text ? (JSON.parse(text) as RequestNoteResponseDto) : null;
      }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["request-notes"] });
      options?.onSuccess?.();
    },
  });
}

export function useRequestNoteDelete(
  options?: { onSuccess?: () => void },
) {
  const qc = useQueryClient();
  const { fetchWithAuth } = useAuthContext();

  return useMutation({
    mutationFn: (noteId: number) =>
      fetchWithAuth(`/request-note/${noteId}`, {
        method: "DELETE",
      }).then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Request note delete failed");
        }

        return true;
      }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["request-notes"] });
      options?.onSuccess?.();
    },
  });
}
