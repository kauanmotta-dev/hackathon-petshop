import { NotFoundError } from '../../../domain/errors/NotFoundError.js';
import { garantirAcessoAoAnimal } from './_acesso.js';

export class AtualizarAnimal {
  constructor({ animalRepository }) {
    this.animalRepository = animalRepository;
  }

  async execute({
    animalId,
    requesterId,
    requesterFuncoes,
    nome,
    especie,
    raca,
    porte,
    dataNascimento,
    cor,
    observacoes,
    condicoes,
  }) {
    const animal = await this.animalRepository.buscarPorId(animalId);
    if (!animal) {
      throw new NotFoundError('Animal não encontrado');
    }

    garantirAcessoAoAnimal(animal, { requesterId, requesterFuncoes });

    if (nome !== undefined) animal.nome = nome.trim();
    if (especie !== undefined) animal.especie = especie.trim();
    if (raca !== undefined) animal.raca = raca ? raca.trim() : null;
    if (porte !== undefined) animal.porte = porte ? porte.trim() : null;
    if (dataNascimento !== undefined) animal.dataNascimento = dataNascimento ? new Date(dataNascimento) : null;
    if (cor !== undefined) animal.cor = cor ? cor.trim() : null;
    if (observacoes !== undefined) animal.observacoes = observacoes ?? '';
    if (condicoes !== undefined) animal.condicoes = condicoes ?? '';

    return this.animalRepository.atualizar(animal);
  }
}
