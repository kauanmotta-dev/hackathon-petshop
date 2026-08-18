import { get, post, patch, setToken, getToken } from './http';
import type { User, UserRole } from '../types';

interface BackendUsuario {
  id: number;
  nome: string;
  email: string;
  cpf: string | null;
  ativo?: boolean;
  funcoes: string[];
  telefones?: string[];
}

function pickRole(funcoes: string[]): UserRole {
  if (funcoes.includes('ADMIN')) return 'ADMIN';
  if (funcoes.includes('BANHISTA')) return 'BANHISTA';
  return 'CLIENTE';
}

export function toUser(u: BackendUsuario): User {
  return {
    id: String(u.id),
    name: u.nome,
    email: u.email,
    phone: u.telefones?.[0] ?? '',
    role: pickRole(u.funcoes),
    active: u.ativo ?? true,
    createdAt: '',
  };
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export async function fetchMe(): Promise<User> {
  const usuario = await get<BackendUsuario>('/usuarios/me');
  return toUser(usuario);
}

export async function login(email: string, senha: string): Promise<User> {
  const result = await post<{ token: string; usuario: BackendUsuario }>('/usuarios/login', { email, senha });
  setToken(result.token);
  return fetchMe();
}

export async function register(nome: string, email: string, senha: string, telefone?: string): Promise<User> {
  await post<BackendUsuario>('/usuarios', { nome, email, senha });
  const user = await login(email, senha);
  if (telefone) {
    await post(`/usuarios/${user.id}/telefones`, { telefone });
  }
  return user;
}

export async function updateProfile(userId: string, input: { nome?: string; email?: string }): Promise<User> {
  const usuario = await patch<BackendUsuario>(`/usuarios/${userId}`, input);
  return toUser(usuario);
}

export async function addPhone(userId: string, telefone: string): Promise<User> {
  const usuario = await post<BackendUsuario>(`/usuarios/${userId}/telefones`, { telefone });
  return toUser(usuario);
}

export async function changePassword(senhaAtual: string, novaSenha: string): Promise<void> {
  await post('/usuarios/me/senha', { senhaAtual, novaSenha });
}

export function logout() {
  setToken(null);
}
