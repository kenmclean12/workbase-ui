import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  authFetch, currentUserRequest, getTokenExpiryMs, loginRequest, logoutRequest, refreshRequest,
  registerRequest, type RegisterPayload, type TokenResponse, type User,
} from "../hooks";

type AuthContextValue = {
  token: string | null;
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  fetchWithAuth: (path: string, config?: RequestInit) => Promise<Response>;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const REFRESH_EARLY_MS = 60_000;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("accessToken"));
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const refreshInFlight = useRef<Promise<string | null> | null>(null);

  const clearSession = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setToken(null);
    setUser(null);
  }, []);

  const storeTokens = useCallback((data: TokenResponse) => {
    localStorage.setItem("accessToken", data.token);
    localStorage.setItem("refreshToken", data.refreshToken);
    setToken(data.token);
    return data.token;
  }, []);

  const refresh = useCallback(async () => {
    if (refreshInFlight.current) return refreshInFlight.current;
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return null;

    const operation = refreshRequest(refreshToken)
      .then((data) => (data ? storeTokens(data) : null))
      .catch(() => null)
      .then((newToken) => {
        if (!newToken) clearSession();
        return newToken;
      })
      .finally(() => { refreshInFlight.current = null; });
    refreshInFlight.current = operation;
    return operation;
  }, [clearSession, storeTokens]);

  const logout = useCallback(async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    clearSession();
    if (refreshToken) {
      try { await logoutRequest(refreshToken); } catch { /* local logout still succeeds */ }
    }
  }, [clearSession]);

  const loadUser = useCallback(async () => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      let activeToken = token;
      const expiry = getTokenExpiryMs(activeToken);
      if (!expiry || expiry - Date.now() <= REFRESH_EARLY_MS) {
        const refreshed = await refresh();
        if (!refreshed) return;
        activeToken = refreshed;
      }

      try {
        setUser(await currentUserRequest(activeToken));
      } catch {
        const refreshed = await refresh();
        if (!refreshed) return;
        setUser(await currentUserRequest(refreshed));
      }
    } catch {
      clearSession();
    } finally {
      setLoading(false);
    }
  }, [clearSession, refresh, token]);

  useEffect(() => { void loadUser(); }, [loadUser]);

  useEffect(() => {
    if (!token) return;
    const expiry = getTokenExpiryMs(token);
    const delay = Math.max((expiry ?? Date.now() + 25 * 60_000) - Date.now() - REFRESH_EARLY_MS, 0);
    const timeout = window.setTimeout(() => void refresh(), delay);
    return () => window.clearTimeout(timeout);
  }, [refresh, token]);

  const login = useCallback(async (email: string, password: string) => {
    storeTokens(await loginRequest(email, password));
  }, [storeTokens]);

  const register = useCallback(async (payload: RegisterPayload) => {
    await registerRequest(payload);
    await login(payload.email, payload.password);
  }, [login]);

  const fetchWithAuth = useCallback(async (path: string, config: RequestInit = {}) => {
    let activeToken = token ?? await refresh();
    if (!activeToken) throw new Error("You are not signed in.");

    const expiry = getTokenExpiryMs(activeToken);
    if (!expiry || expiry - Date.now() <= REFRESH_EARLY_MS) {
      activeToken = await refresh();
      if (!activeToken) throw new Error("Your session has expired. Please sign in again.");
    }

    const response = await authFetch(path, activeToken, config);
    if (response.status !== 401) return response;

    activeToken = await refresh();
    if (!activeToken) throw new Error("Your session has expired. Please sign in again.");
    return authFetch(path, activeToken, config);
  }, [refresh, token]);

  const value = useMemo(() => ({ token, user, loading, login, register, logout, fetchWithAuth }),
    [token, user, loading, login, register, logout, fetchWithAuth]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used inside provider");
  return ctx;
}
