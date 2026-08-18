const API_URL = (import.meta.env.VITE_API_URL as string | undefined) || 'http://localhost:3000/api/v1';
const TOKEN_KEY = 'petshop_token';

export class ApiError extends Error {
  status: number;
  code: string;
  details: unknown[];

  constructor(status: number, code: string, message: string, details: unknown[] = []) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

interface Envelope<T> {
  data?: T;
  meta?: { page: number; pageSize: number; total: number };
  error?: { code: string; message: string; details: unknown[] };
}

async function request<T>(path: string, options: RequestInit = {}): Promise<Envelope<T>> {
  const token = getToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (options.headers) Object.assign(headers, options.headers as Record<string, string>);
  if (token) headers.Authorization = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, { ...options, headers });
  } catch {
    throw new ApiError(0, 'NETWORK_ERROR', 'Não foi possível conectar ao servidor. Verifique sua conexão.');
  }

  if (res.status === 204) return {};

  const body = (await res.json().catch(() => null)) as Envelope<T> | null;

  if (!res.ok) {
    const err = body?.error;
    throw new ApiError(res.status, err?.code ?? 'UNKNOWN', err?.message ?? 'Erro inesperado. Tente novamente.', err?.details ?? []);
  }

  return body ?? {};
}

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const body = await request<T>(path, options);
  return body.data as T;
}

export async function apiFetchPaged<T>(
  path: string,
  options?: RequestInit,
): Promise<{ data: T; meta: { page: number; pageSize: number; total: number } }> {
  const body = await request<T>(path, options);
  return { data: body.data as T, meta: body.meta! };
}

export function get<T>(path: string): Promise<T> {
  return apiFetch<T>(path);
}

export function post<T>(path: string, body?: unknown): Promise<T> {
  return apiFetch<T>(path, { method: 'POST', body: body !== undefined ? JSON.stringify(body) : undefined });
}

export function patch<T>(path: string, body?: unknown): Promise<T> {
  return apiFetch<T>(path, { method: 'PATCH', body: body !== undefined ? JSON.stringify(body) : undefined });
}

export function del<T>(path: string): Promise<T> {
  return apiFetch<T>(path, { method: 'DELETE' });
}
