const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

export type User = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string | null;
  createdAt?: string;
  role?: string;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
};

export async function loginRequest(email: string, password: string) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) throw new Error("Login failed");

  return (await res.json()) as LoginResponse;
}

export async function registerRequest(payload: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}) {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Registration failed");
}

export async function refreshRequest(refreshToken: string) {
  const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) return null;

  return res.json() as Promise<LoginResponse>;
}

export async function meRequest(token: string) {
  const res = await fetch(`${API_BASE_URL}/user/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to load user");

  return res.json() as Promise<User>;
}

export async function authFetch(
  path: string,
  token: string,
  config: RequestInit = {},
) {
  return fetch(`${API_BASE_URL}${path}`, {
    ...config,
    headers: {
      "Content-Type": "application/json",
      ...(config.headers ?? {}),
      Authorization: `Bearer ${token}`,
    },
  });
}
