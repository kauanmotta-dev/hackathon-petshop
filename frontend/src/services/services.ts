import { get, post, patch, del } from './http';
import type { Service } from '../types';

interface BackendServico {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  duracaoMinutos: number;
  portes: string[];
  especies: string[];
  ativo: boolean;
}

function toService(s: BackendServico): Service {
  return {
    id: String(s.id),
    name: s.nome,
    description: s.descricao ?? '',
    duration: s.duracaoMinutos,
    price: s.preco,
    sizes: s.portes ?? [],
    species: s.especies ?? [],
    active: s.ativo,
  };
}

function toBody(input: Partial<ServiceInput>) {
  return {
    nome: input.name,
    descricao: input.description,
    preco: input.price,
    duracaoMinutos: input.duration,
    portes: input.sizes,
    especies: input.species,
    ativo: input.active,
  };
}

export interface ServiceInput {
  name: string;
  description?: string;
  price: number;
  duration: number;
  sizes?: string[];
  species?: string[];
  active?: boolean;
}

export async function listServices(): Promise<Service[]> {
  const servicos = await get<BackendServico[]>('/servicos');
  return servicos.map(toService);
}

export async function createService(input: ServiceInput): Promise<Service> {
  const servico = await post<BackendServico>('/servicos', toBody(input));
  return toService(servico);
}

export async function updateService(id: string, input: Partial<ServiceInput>): Promise<Service> {
  const servico = await patch<BackendServico>(`/servicos/${id}`, toBody(input));
  return toService(servico);
}

export async function inactivateService(id: string): Promise<Service> {
  const servico = await del<BackendServico>(`/servicos/${id}`);
  return toService(servico);
}

export async function reactivateService(id: string): Promise<Service> {
  return updateService(id, { active: true });
}
