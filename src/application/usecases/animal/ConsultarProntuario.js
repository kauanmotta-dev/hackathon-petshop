import { NotFoundError } from '../../../domain/errors/NotFoundError.js';
import { garantirAcessoAoAnimal } from './_acesso.js';

export class ConsultarProntuario {
  constructor({ animalRepository }) {
    this.animalRepository = animalRepository;
  }

  async execute({ animalId, requesterId, requesterFuncoes }) {
    const animal = await this.animalRepository.buscarPorId(animalId);
    if (!animal) {
      throw new NotFoundError('Animal não encontrado');
    }

    garantirAcessoAoAnimal(animal, { requesterId, requesterFuncoes });

    const prontuario = await this.animalRepository.buscarProntuarioPorAnimalId(animalId);
    if (!prontuario) {
      throw new NotFoundError('Prontuário não encontrado para este animal');
    }

    return prontuario;
  }
}
