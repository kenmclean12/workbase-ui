/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

type User = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string | null;
};

type AuthContextValue = {
  token: string | null;
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => Promise<void>;
  logout: () => void;
  fetchWithAuth: (path: string, config?: RequestInit) => Promise<Response>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function decodeResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.text();
    throw new Error(body || res.statusText);
  }

  return res.json() as Promise<T>;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("accessToken"),
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(
    localStorage.getItem("refreshToken"),
  );
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const storeTokens = useCallback(
    (accessToken: string, newRefreshToken: string) => {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", newRefreshToken);
      setToken(accessToken);
      setRefreshToken(newRefreshToken);
    },
    [],
  );

  const clearTokens = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setToken(null);
    setRefreshToken(null);
  }, []);

  const fetchWithAuth = useCallback(
    async (path: string, config: RequestInit = {}) => {
      const activeToken = localStorage.getItem("accessToken");
      const headers = {
        "Content-Type": "application/json",
        ...(config.headers ?? {}),
        Authorization: activeToken ? `Bearer ${activeToken}` : "",
      };

      let response = await fetch(`${API_BASE_URL}${path}`, {
        ...config,
        headers,
      });

      if (response.status === 401 && refreshToken) {
        const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });

        if (!refreshResponse.ok) {
          logout();
          throw new Error("Unauthorized");
        }

        const payload = await refreshResponse.json();
        storeTokens(payload.accessToken, payload.refreshToken);

        response = await fetch(`${API_BASE_URL}${path}`, {
          ...config,
          headers: {
            ...headers,
            Authorization: `Bearer ${payload.accessToken}`,
          },
        });
      }

      return response;
    },
    [refreshToken, storeTokens],
  );

  const loadUser = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await fetchWithAuth("/user/me");
      const data = await decodeResponse<User>(response);
      setUser(data);
    } catch (error) {
      clearTokens();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [clearTokens, fetchWithAuth, token]);

  useEffect(() => {
    void loadUser();
  }, [loadUser]);

  const login = useCallback(
    async (email: string, password: string) => {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await decodeResponse<{
        accessToken: string;
        refreshToken: string;
      }>(response);
      storeTokens(data.accessToken, data.refreshToken);
      const userResponse = await fetchWithAuth("/user/me");
      const userData = await decodeResponse<User>(userResponse);
      setUser(userData);
    },
    [fetchWithAuth, storeTokens],
  );

  const register = useCallback(
    async (payload: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
    }) => {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      await login(payload.email, payload.password);
    },
    [login],
  );

  const logout = useCallback(() => {
    clearTokens();
    setUser(null);
  }, [clearTokens]);

  const value = useMemo(
    () => ({ token, user, loading, login, register, logout, fetchWithAuth }),
    [token, user, loading, login, register, logout, fetchWithAuth],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
}
