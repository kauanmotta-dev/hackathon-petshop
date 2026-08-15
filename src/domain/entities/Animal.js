import { ValidationError } from '../errors/ValidationError.js';

export class Animal {
  constructor({ id, usuarioId, nome, especie, raca = null, prontuario = null }) {
    if (!usuarioId) {
      throw new ValidationError('Animal precisa de um dono (usuarioId)');
    }
    if (!nome || nome.trim().length < 1) {
      throw new ValidationError('Nome do animal é obrigatório');
    }
    if (!especie || especie.trim().length < 1) {
      throw new ValidationError('Espécie do animal é obrigatória');
    }

    this.id = id;
    this.usuarioId = usuarioId;
    this.nome = nome.trim();
    this.especie = especie.trim();
    this.raca = raca ? raca.trim() : null;
    this.prontuario = prontuario;
  }

  pertenceA(usuarioId) {
    return this.usuarioId === usuarioId;
  }
}
