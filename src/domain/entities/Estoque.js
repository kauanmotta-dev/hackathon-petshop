import { ValidationError } from '../errors/ValidationError.js';

export class Estoque {
  constructor({ id, nome, descricao = '' }) {
    if (!nome || nome.trim().length < 1) {
      throw new ValidationError('Nome do estoque é obrigatório');
    }
    this.id = id;
    this.nome = nome.trim();
    this.descricao = descricao ?? '';
  }
}
