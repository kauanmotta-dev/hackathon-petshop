import { ValidationError } from '../errors/ValidationError.js';

export class Prontuario {
  constructor({ id, animalId, historico = '', vacinas = '' }) {
    if (!animalId) {
      throw new ValidationError('Prontuário precisa estar vinculado a um animal');
    }
    this.id = id;
    this.animalId = animalId;
    this.historico = historico ?? '';
    this.vacinas = vacinas ?? '';
  }

  atualizar({ historico, vacinas }) {
    if (historico !== undefined) this.historico = historico;
    if (vacinas !== undefined) this.vacinas = vacinas;
  }
}
