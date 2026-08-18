import { ValidationError } from '../errors/ValidationError.js';

export class Material {
  constructor({ id, nome, tipo, unidade = 'unidades', categoria = 'Geral', quantidadeCritica = 0 }) {
    if (!nome || nome.trim().length < 1) {
      throw new ValidationError('Nome do material é obrigatório');
    }
    if (!tipo || tipo.trim().length < 1) {
      throw new ValidationError('Tipo do material é obrigatório');
    }
    this.id = id;
    this.nome = nome.trim();
    this.tipo = tipo.trim();
    this.unidade = unidade ? unidade.trim() : 'unidades';
    this.categoria = categoria ? categoria.trim() : 'Geral';
    this.quantidadeCritica = Number(quantidadeCritica) || 0;
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
