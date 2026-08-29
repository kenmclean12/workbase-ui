import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "../../context";
import {
  type RequestPriority,
  type RequestResponseDto,
  type RequestStatus,
} from "../../types/request";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5223";

async function request<T>(url: string, config?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${url}`, config);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Request failed");
  }

  return res.json() as Promise<T>;
}

export type RequestHistoryEntryDto = {
  id: number;
  requestId: number;
  userId: number;
  action: string;
  createdAt: string;
  details?: string | null;
};

export function useRequestsGetAll(options?: { enabled?: boolean }) {
  return useQuery<RequestResponseDto[]>({
    queryKey: ["requests"],
    queryFn: () => request<RequestResponseDto[]>(`/request/`),
    ...options,
  });
}

export function useRequestsGetByClient(
  clientId?: number,
  options?: { enabled?: boolean },
) {
  return useQuery<RequestResponseDto[]>({
    queryKey: ["requests", "client", clientId],
    queryFn: () => request<RequestResponseDto[]>(`/request/client/${clientId}`),
    enabled: !!clientId,
    ...options,
  });
}

export function useRequestsGetByUser(
  userId?: number,
  options?: { enabled?: boolean },
) {
  return useQuery<RequestResponseDto[]>({
    queryKey: ["requests", "user", userId],
    queryFn: () => request<RequestResponseDto[]>(`/request/user/${userId}`),
    enabled: !!userId,
    ...options,
  });
}

export function useRequestHistory(requestId?: number, options?: { enabled?: boolean }) {
  return useQuery<RequestHistoryEntryDto[]>({
    queryKey: ["request-history", requestId],
    queryFn: () => request<RequestHistoryEntryDto[]>(`/request-history/request/${requestId}`),
    enabled: !!requestId,
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
      title?: string;
      description?: string;
      status?: RequestStatus;
      priority?: RequestPriority;
      assignedToUserId?: number | null;
    }) => {
      const { actionUserId, ...payload } = dto;
      const query = new URLSearchParams({ actionUserId: String(actionUserId) });

      return fetchWithAuth(`/request/${requestId}?${query.toString()}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
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
