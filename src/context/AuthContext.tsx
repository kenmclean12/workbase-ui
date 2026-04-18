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
  createdAt?: string;
  role?: string;
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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const storeTokens = useCallback(
    (accessToken: string, refreshToken: string) => {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      setToken(accessToken);
    },
    [],
  );

  const clearTokens = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setToken(null);
  }, []);

  const logout = useCallback(() => {
    clearTokens();
    setUser(null);
    setLoading(false);
  }, [clearTokens]);

  const refreshAccessToken = useCallback(async () => {
    const storedRefresh = localStorage.getItem("refreshToken");
    if (!storedRefresh) return null;

    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: storedRefresh }),
    });

    if (!res.ok) {
      logout();
      return null;
    }

    const data = await res.json();
    storeTokens(data.accessToken, data.refreshToken);
    return data.accessToken as string;
  }, [logout, storeTokens]);

  const fetchWithAuth = useCallback(
    async (path: string, config: RequestInit = {}) => {
      const accessToken = localStorage.getItem("accessToken");

      const makeRequest = async (t?: string) => {
        return fetch(`${API_BASE_URL}${path}`, {
          ...config,
          headers: {
            "Content-Type": "application/json",
            ...(config.headers ?? {}),
            ...(t ? { Authorization: `Bearer ${t}` } : {}),
          },
        });
      };

      let response = await makeRequest(accessToken || undefined);

      if (response.status !== 401) return response;

      const newToken = await refreshAccessToken();
      if (!newToken) throw new Error("Unauthorized");

      response = await makeRequest(newToken);

      if (response.status === 401) {
        logout();
        throw new Error("Unauthorized");
      }

      return response;
    },
    [logout, refreshAccessToken],
  );

  const loadUser = useCallback(async () => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      console.log("Access Token");
      const res = await fetch(`${API_BASE_URL}/user/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await res.json();
      setUser(data);
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    void loadUser();
  }, [token, loadUser]);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await decodeResponse<{
        accessToken: string;
        refreshToken: string;
      }>(res);

      storeTokens(data.accessToken, data.refreshToken);
    },
    [storeTokens],
  );

  const register = useCallback(
    async (payload: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
    }) => {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Registration failed");
      }

      await login(payload.email, payload.password);
    },
    [login],
  );

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
