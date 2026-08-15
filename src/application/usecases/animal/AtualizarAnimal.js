import { NotFoundError } from '../../../domain/errors/NotFoundError.js';
import { garantirAcessoAoAnimal } from './_acesso.js';

export class AtualizarAnimal {
  constructor({ animalRepository }) {
    this.animalRepository = animalRepository;
  }

  async execute({ animalId, requesterId, requesterFuncoes, nome, especie, raca }) {
    const animal = await this.animalRepository.buscarPorId(animalId);
    if (!animal) {
      throw new NotFoundError('Animal não encontrado');
    }

    garantirAcessoAoAnimal(animal, { requesterId, requesterFuncoes });

    if (nome !== undefined) animal.nome = nome.trim();
    if (especie !== undefined) animal.especie = especie.trim();
    if (raca !== undefined) animal.raca = raca ? raca.trim() : null;

    return this.animalRepository.atualizar(animal);
  }
}
