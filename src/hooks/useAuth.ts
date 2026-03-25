import { useCallback, useState } from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

type LoginResponse = {
  accessToken: string;
  refreshToken: string;
};

export function useAuth() {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("accessToken"),
  );
  const [user, setUser] = useState<{ email: string } | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      throw new Error("Invalid credentials");
    }

    const data = (await res.json()) as LoginResponse;
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    setToken(data.accessToken);
    return data;
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }, []);

  const fetchWithAuth = useCallback(
    async (path: string, config: RequestInit = {}) => {
      const accessToken = localStorage.getItem("accessToken");
      const headers = {
        ...(config.headers as object),
        Authorization: accessToken ? `Bearer ${accessToken}` : "",
      };

      const response = await fetch(`${API_BASE_URL}${path}`, {
        ...config,
        headers,
      });

      if (response.status === 401) {
        // Refresh token logic could be inserted here.
        throw new Error("Unauthorized");
      }

      return response;
    },
    [],
  );

  return {
    token,
    user,
    login,
    logout,
    fetchWithAuth,
  };
}
