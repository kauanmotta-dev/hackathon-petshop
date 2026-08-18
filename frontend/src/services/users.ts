import { apiFetchPaged, get, patch, post } from './http';
import type { User, UserRole } from '../types';

interface BackendUsuario {
  id: number;
  nome: string;
  email: string;
  cpf: string | null;
  ativo: boolean;
  funcoes: string[];
  telefones: string[];
}

function pickRole(funcoes: string[]): UserRole {
  if (funcoes.includes('ADMIN')) return 'ADMIN';
  if (funcoes.includes('BANHISTA')) return 'BANHISTA';
  return 'CLIENTE';
}

function toUser(u: BackendUsuario): User {
  return {
    id: String(u.id),
    name: u.nome,
    email: u.email,
    phone: u.telefones?.[0] ?? '',
    role: pickRole(u.funcoes),
    active: u.ativo,
    createdAt: '',
  };
}

export async function listUsers(page = 1, pageSize = 100): Promise<User[]> {
  const { data } = await apiFetchPaged<BackendUsuario[]>(`/usuarios?page=${page}&pageSize=${pageSize}`);
  return data.map(toUser);
}

export async function setUserActive(userId: string, active: boolean): Promise<User> {
  const usuario = await patch<BackendUsuario>(`/usuarios/${userId}`, { ativo: active });
  return toUser(usuario);
}

export async function setUserRole(userId: string, role: UserRole): Promise<User> {
  const usuario = await post<BackendUsuario>(`/usuarios/${userId}/funcoes`, { funcao: role });
  return toUser(usuario);
}

export async function createUser(input: { name: string; email: string; phone?: string; role: UserRole; password: string }): Promise<User> {
  // Uses the plain registration endpoint (not the auth.register() helper) so the
  // admin creating the account never gets logged in as it — that helper swaps the
  // stored session token to the new user's, which would hijack the admin's session.
  const usuario = await post<BackendUsuario>('/usuarios', { nome: input.name, email: input.email, senha: input.password });
  if (input.phone) {
    await post(`/usuarios/${usuario.id}/telefones`, { telefone: input.phone });
  }
  if (input.role !== 'CLIENTE') {
    return setUserRole(String(usuario.id), input.role);
  }
  return toUser(usuario);
}

export interface TeamMember {
  id: string;
  name: string;
  roles: string[];
}

export async function listTeam(): Promise<TeamMember[]> {
  const equipe = await get<{ id: number; nome: string; funcoes: string[] }[]>('/usuarios/equipe');
  return equipe.map((u) => ({ id: String(u.id), name: u.nome, roles: u.funcoes }));
}
