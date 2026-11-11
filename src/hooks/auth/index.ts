const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export type User = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string | null;
  createdAt?: string;
  role?: string;
  clientId?: number | null;
};

/** The auth service serializes TokenResponseDTO.Token as `token`. */
export type TokenResponse = { token: string; refreshToken: string; expiresIn?: number };

export type RegisterPayload = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  inviteToken: string;
};

async function errorMessage(res: Response, fallback: string) {
  const text = await res.text();
  return text || fallback;
}

export async function loginRequest(email: string, password: string) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error(await errorMessage(res, "Invalid email or password."));
  return (await res.json()) as TokenResponse;
}

export async function registerRequest(payload: RegisterPayload) {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await errorMessage(res, "This invitation is invalid or has expired."));
}

export async function refreshRequest(refreshToken: string) {
  const res = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ refreshToken }),
  });
  if (!res.ok) return null;
  return (await res.json()) as TokenResponse;
}

export async function logoutRequest(refreshToken: string) {
  await fetch(`${API_BASE_URL}/auth/logout`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ refreshToken }),
  });
}

/** Loads the signed-in user through the only available user route: /user/{id}. */
export async function currentUserRequest(token: string) {
  const userId = getJwtPayload(token)?.sub;
  if (!userId || !/^\d+$/.test(userId)) throw new Error("Invalid access token.");
  const res = await authFetch(`/user/${userId}`, token);
  if (!res.ok) throw new Error(await errorMessage(res, "Failed to load user."));
  return (await res.json()) as User;
}

export async function authFetch(path: string, token: string, config: RequestInit = {}) {
  return fetch(`${API_BASE_URL}${path}`, {
    ...config,
    headers: { "Content-Type": "application/json", ...(config.headers ?? {}), Authorization: `Bearer ${token}` },
  });
}

type JwtPayload = { sub?: string; exp?: number };

export function getJwtPayload(token: string): JwtPayload | null {
  try {
    const encoded = token.split(".")[1];
    if (!encoded) return null;
    const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(atob(base64).split("").map((char) =>
      `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`).join(""));
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

export function getTokenExpiryMs(token: string) {
  const exp = getJwtPayload(token)?.exp;
  return typeof exp === "number" ? exp * 1000 : null;
}
