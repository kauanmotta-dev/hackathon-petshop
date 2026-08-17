import { Prontuario } from '../../../domain/entities/Prontuario.js';
import { NotFoundError } from '../../../domain/errors/NotFoundError.js';
import { ConflictError } from '../../../domain/errors/ConflictError.js';

export class RegistrarProntuario {
  constructor({ animalRepository }) {
    this.animalRepository = animalRepository;
  }

  async execute({ animalId, historico, vacinas }) {
    const animal = await this.animalRepository.buscarPorId(animalId);
    if (!animal) {
      throw new NotFoundError('Animal não encontrado');
    }

    const existente = await this.animalRepository.buscarProntuarioPorAnimalId(animalId);
    if (existente) {
      throw new ConflictError('Este animal já possui um prontuário; atualize o existente');
    }

    const prontuario = new Prontuario({ animalId, historico, vacinas });
    return this.animalRepository.salvarProntuario(prontuario);
  }
}
