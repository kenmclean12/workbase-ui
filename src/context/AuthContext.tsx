import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  authFetch,
  loginRequest,
  meRequest,
  refreshRequest,
  registerRequest,
  type User,
} from "../hooks";

type AuthContextValue = {
  token: string | null;
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (p: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => Promise<void>;
  logout: () => void;
  fetchWithAuth: (path: string, config?: RequestInit) => Promise<Response>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("accessToken"),
  );
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setToken(null);
    setUser(null);
  }, []);

  const loadUser = useCallback(async () => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const data = await meRequest(token);
      setUser(data);
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  }, [token, logout]);

  useEffect(() => {
    void loadUser();
  }, [loadUser]);

  const login = useCallback(async (email: string, password: string) => {
    const data = await loginRequest(email, password);

    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);

    setToken(data.accessToken);
  }, []);

  const register = useCallback(
    async (payload: any) => {
      await registerRequest(payload);
      await login(payload.email, payload.password);
    },
    [login],
  );

  const refresh = useCallback(async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return null;

    const data = await refreshRequest(refreshToken);
    if (!data) {
      logout();
      return null;
    }

    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);

    setToken(data.accessToken);
    return data.accessToken;
  }, [logout]);

  const fetchWithAuth = useCallback(
    async (path: string, config: RequestInit = {}) => {
      const res = await authFetch(path, token!, config);

      if (res.status !== 401) return res;

      const newToken = await refresh();
      if (!newToken) throw new Error("Unauthorized");

      return authFetch(path, newToken, config);
    },
    [token, refresh],
  );

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      login,
      register,
      logout,
      fetchWithAuth,
    }),
    [token, user, loading, login, register, logout, fetchWithAuth],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used inside provider");
  return ctx;
}
