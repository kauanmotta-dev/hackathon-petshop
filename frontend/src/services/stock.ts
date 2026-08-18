import { get, post } from './http';
import type { StockItem, StockLocation, StockMovement } from '../types';

interface BackendMaterial {
  id: number;
  nome: string;
  tipo: string;
  unidade: string;
  categoria: string;
  quantidadeCritica: number;
}

interface BackendSaldo {
  material: BackendMaterial;
  quantidade: number;
}

interface BackendEstoque {
  id: number;
  nome: string;
  descricao: string;
  materiais: BackendSaldo[];
}

interface BackendMovimentacao {
  id: number;
  materialId: number;
  materialNome: string;
  unidade: string;
  estoqueId: number;
  tipo: 'ENTRADA' | 'SAIDA';
  quantidade: number;
  observacoes: string;
  usuarioId: number | null;
  usuarioNome: string | null;
  criadoEm: string;
}

function itemId(estoqueId: number, materialId: number) {
  return `${estoqueId}:${materialId}`;
}

export function parseItemId(id: string): { locationId: string; materialId: string } {
  const [estoqueId, materialId] = id.split(':');
  return { locationId: estoqueId, materialId };
}

function toLocation(e: BackendEstoque): StockLocation {
  return { id: String(e.id), name: e.nome, description: e.descricao ?? '' };
}

function toItems(e: BackendEstoque): StockItem[] {
  return e.materiais.map((s) => ({
    id: itemId(e.id, s.material.id),
    locationId: String(e.id),
    locationName: e.nome,
    name: s.material.nome,
    unit: s.material.unidade,
    quantity: s.quantidade,
    criticalQty: s.material.quantidadeCritica,
    category: s.material.categoria,
  }));
}

function toMovement(m: BackendMovimentacao): StockMovement {
  return {
    id: String(m.id),
    itemId: itemId(m.estoqueId, m.materialId),
    itemName: m.materialNome,
    type: m.tipo,
    quantity: m.quantidade,
    date: m.criadoEm.slice(0, 10),
    notes: m.observacoes,
    userId: m.usuarioId ? String(m.usuarioId) : '',
    userName: m.usuarioNome ?? 'Sistema',
  };
}

export async function listLocations(): Promise<StockLocation[]> {
  const estoques = await get<BackendEstoque[]>('/estoques');
  return estoques.map(toLocation);
}

export async function listItems(): Promise<StockItem[]> {
  const estoques = await get<BackendEstoque[]>('/estoques');
  return estoques.flatMap(toItems);
}

export async function listMaterials(): Promise<BackendMaterial[]> {
  return get<BackendMaterial[]>('/estoques/materiais');
}

export async function createLocation(nome: string, descricao?: string): Promise<StockLocation> {
  const estoque = await post<BackendEstoque>('/estoques', { nome, descricao });
  return toLocation({ ...estoque, materiais: [] });
}

export async function createMaterial(input: {
  nome: string;
  tipo: string;
  unidade?: string;
  categoria?: string;
  quantidadeCritica?: number;
}): Promise<BackendMaterial> {
  return post<BackendMaterial>('/estoques/materiais', input);
}

export async function registerEntry(locationId: string, materialId: string, quantidade: number, observacoes?: string) {
  return post(`/estoques/${locationId}/entradas`, { materialId: Number(materialId), quantidade, observacoes });
}

export async function registerExit(locationId: string, materialId: string, quantidade: number, observacoes?: string) {
  return post(`/estoques/${locationId}/saidas`, { materialId: Number(materialId), quantidade, observacoes });
}

export async function listMovements(locationId: string): Promise<StockMovement[]> {
  const movimentacoes = await get<BackendMovimentacao[]>(`/estoques/${locationId}/movimentacoes`);
  return movimentacoes.map(toMovement);
}

export async function listAllMovements(): Promise<StockMovement[]> {
  const estoques = await get<BackendEstoque[]>('/estoques');
  const lists = await Promise.all(estoques.map((e) => listMovements(String(e.id))));
  return lists.flat().sort((a, b) => (a.date < b.date ? 1 : -1));
}
