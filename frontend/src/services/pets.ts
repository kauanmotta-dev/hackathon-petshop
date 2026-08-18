import { get, post, patch, ApiError } from './http';
import type { Pet } from '../types';

interface BackendProntuario {
  id: number;
  animalId: number;
  historico: string;
  vacinas: string;
}

interface BackendAnimal {
  id: number;
  usuarioId: number;
  nome: string;
  especie: string;
  raca: string | null;
  porte: string | null;
  dataNascimento: string | null;
  cor: string | null;
  observacoes: string;
  condicoes: string;
  prontuario: BackendProntuario | null;
}

export interface Prontuario {
  id: string;
  animalId: string;
  historico: string;
  vacinas: string;
}

function toPet(a: BackendAnimal): Pet {
  return {
    id: String(a.id),
    ownerId: String(a.usuarioId),
    name: a.nome,
    species: (a.especie as Pet['species']) || 'Outro',
    breed: a.raca ?? '',
    size: (a.porte as Pet['size']) || 'Médio',
    birthDate: a.dataNascimento ?? '',
    notes: a.observacoes ?? '',
    conditions: a.condicoes ?? '',
    color: a.cor ?? '#536273',
  };
}

function toProntuario(p: BackendProntuario): Prontuario {
  return { id: String(p.id), animalId: String(p.animalId), historico: p.historico, vacinas: p.vacinas };
}

export interface PetInput {
  name: string;
  species: string;
  breed?: string;
  size?: string;
  birthDate?: string;
  color?: string;
  notes?: string;
  conditions?: string;
}

function toBody(input: Partial<PetInput>) {
  return {
    nome: input.name,
    especie: input.species,
    raca: input.breed || undefined,
    porte: input.size || undefined,
    dataNascimento: input.birthDate || undefined,
    cor: input.color || undefined,
    observacoes: input.notes,
    condicoes: input.conditions,
  };
}

export async function listMyPets(): Promise<Pet[]> {
  const animais = await get<BackendAnimal[]>('/animais');
  return animais.map(toPet);
}

export async function createPet(input: PetInput): Promise<Pet> {
  const animal = await post<BackendAnimal>('/animais', toBody(input));
  return toPet(animal);
}

export async function updatePet(id: string, input: Partial<PetInput>): Promise<Pet> {
  const animal = await patch<BackendAnimal>(`/animais/${id}`, toBody(input));
  return toPet(animal);
}

export async function getProntuario(petId: string): Promise<Prontuario | null> {
  try {
    const prontuario = await get<BackendProntuario>(`/animais/${petId}/prontuario`);
    return toProntuario(prontuario);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  }
}

export async function registerProntuario(petId: string, input: { historico?: string; vacinas?: string }): Promise<Prontuario> {
  const prontuario = await post<BackendProntuario>(`/animais/${petId}/prontuario`, input);
  return toProntuario(prontuario);
}

export async function updateProntuario(petId: string, input: { historico?: string; vacinas?: string }): Promise<Prontuario> {
  const prontuario = await patch<BackendProntuario>(`/animais/${petId}/prontuario`, input);
  return toProntuario(prontuario);
}
