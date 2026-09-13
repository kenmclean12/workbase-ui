import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { useAuthContext } from "../../context";
import type { ClientCreateDto, ClientResponseDto } from "../../types/client";

async function request<T>(
  fetchWithAuth: (path: string, config?: RequestInit) => Promise<Response>,
  url: string,
): Promise<T> {
  const res = await fetchWithAuth(url);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Request failed");
  }

  return res.json() as Promise<T>;
}

export function useClientsGetAll(options?: { enabled?: boolean }) {
  const { fetchWithAuth } = useAuthContext();
  return useQuery<ClientResponseDto[]>({
    queryKey: ["clients"],
    queryFn: () => request<ClientResponseDto[]>(fetchWithAuth, `/client/`),
    ...options,
  });
}

export function useClientGetById(id?: number, options?: { enabled?: boolean }) {
  const { fetchWithAuth } = useAuthContext();
  return useQuery<ClientResponseDto>({
    queryKey: ["client", id],
    queryFn: () => request<ClientResponseDto>(fetchWithAuth, `/client/${id}`),
    enabled: !!id,
    ...options,
  });
}

export function useClientCreate(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();
  const { fetchWithAuth } = useAuthContext();

  return useMutation({
    mutationFn: async (dto: ClientCreateDto) => {
      const response = await fetchWithAuth("/client/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Client creation failed");
      }

      const text = await response.text();
      return text ? (JSON.parse(text) as ClientResponseDto) : null;
    },
    onSuccess: async () => {
      options?.onSuccess?.();
      await queryClient.invalidateQueries({ queryKey: ["clients"] });
      await queryClient.refetchQueries({ queryKey: ["clients"], type: "active" });
      enqueueSnackbar("Client created successfully", { variant: "success" });
    },
    onError: (error: Error) => {
      enqueueSnackbar(error.message, { variant: "error" });
    },
  });
}
