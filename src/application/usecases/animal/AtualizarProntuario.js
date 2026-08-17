import { NotFoundError } from '../../../domain/errors/NotFoundError.js';
import { garantirAcessoAoAnimal } from './_acesso.js';

export class AtualizarProntuario {
  constructor({ animalRepository }) {
    this.animalRepository = animalRepository;
  }

  async execute({ animalId, historico, vacinas, requesterId, requesterFuncoes }) {
    const animal = await this.animalRepository.buscarPorId(animalId);
    if (!animal) {
      throw new NotFoundError('Animal não encontrado');
    }

    garantirAcessoAoAnimal(animal, { requesterId, requesterFuncoes });

    const prontuario = animal.prontuario;
    if (!prontuario) {
      throw new NotFoundError('Prontuário não encontrado para este animal');
    }

    prontuario.atualizar({ historico, vacinas });

    return this.animalRepository.atualizarProntuario(prontuario);
  }
}
