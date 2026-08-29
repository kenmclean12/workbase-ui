import { useQuery } from "@tanstack/react-query";
import type { RequestResponseDto } from "../../types/request";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5223";

async function request<T>(url: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${url}`);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Request failed");
  }

  return res.json() as Promise<T>;
}

export function useRequestsGetAll(options?: { enabled?: boolean }) {
  return useQuery<RequestResponseDto[]>({
    queryKey: ["requests"],
    queryFn: () => request<RequestResponseDto[]>(`/request/`),
    ...options,
  });
}

export function useRequestsGetByClient(clientId?: number, options?: { enabled?: boolean }) {
  return useQuery<RequestResponseDto[]>({
    queryKey: ["requests", "client", clientId],
    queryFn: () => request<RequestResponseDto[]>(`/request/client/${clientId}`),
    enabled: !!clientId,
    ...options,
  });
}
