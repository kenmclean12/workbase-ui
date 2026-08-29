import { useQuery } from "@tanstack/react-query";
import type { ClientResponseDto } from "../../types/client";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5223";

async function request<T>(url: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${url}`);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Request failed");
  }

  return res.json() as Promise<T>;
}

export function useClientsGetAll(options?: { enabled?: boolean }) {
  return useQuery<ClientResponseDto[]>({
    queryKey: ["clients"],
    queryFn: () => request<ClientResponseDto[]>(`/client/`),
    ...options,
  });
}

export function useClientGetById(id?: number, options?: { enabled?: boolean }) {
  return useQuery<ClientResponseDto>({
    queryKey: ["client", id],
    queryFn: () => request<ClientResponseDto>(`/client/${id}`),
    enabled: !!id,
    ...options,
  });
}
