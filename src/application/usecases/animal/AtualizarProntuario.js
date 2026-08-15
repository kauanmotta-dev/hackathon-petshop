import { NotFoundError } from '../../../domain/errors/NotFoundError.js';

export class AtualizarProntuario {
  constructor({ animalRepository }) {
    this.animalRepository = animalRepository;
  }

  async execute({ animalId, historico, vacinas }) {
    const prontuario = await this.animalRepository.buscarProntuarioPorAnimalId(animalId);
    if (!prontuario) {
      throw new NotFoundError('Prontuário não encontrado para este animal');
    }

    prontuario.atualizar({ historico, vacinas });

    return this.animalRepository.atualizarProntuario(prontuario);
  }
}
