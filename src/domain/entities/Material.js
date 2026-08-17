import { ValidationError } from '../errors/ValidationError.js';

export class Material {
  constructor({ id, nome, tipo }) {
    if (!nome || nome.trim().length < 1) {
      throw new ValidationError('Nome do material é obrigatório');
    }
    if (!tipo || tipo.trim().length < 1) {
      throw new ValidationError('Tipo do material é obrigatório');
    }
    this.id = id;
    this.nome = nome.trim();
    this.tipo = tipo.trim();
  }
}

export class MaterialEstoque {
  constructor({ id, materialId, estoqueId, quantidade = 0 }) {
    if (!materialId || !estoqueId) {
      throw new ValidationError('Material e estoque são obrigatórios');
    }
    if (quantidade < 0) {
      throw new ValidationError('Quantidade não pode ser negativa');
    }
    this.id = id;
    this.materialId = materialId;
    this.estoqueId = estoqueId;
    this.quantidade = quantidade;
  }
}
