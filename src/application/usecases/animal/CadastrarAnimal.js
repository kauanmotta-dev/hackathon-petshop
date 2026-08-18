import { Animal } from '../../../domain/entities/Animal.js';

export class CadastrarAnimal {
  constructor({ animalRepository }) {
    this.animalRepository = animalRepository;
  }

  async execute({ usuarioId, nome, especie, raca, porte, dataNascimento, cor, observacoes, condicoes }) {
    const animal = new Animal({
      usuarioId,
      nome,
      especie,
      raca,
      porte,
      dataNascimento: dataNascimento ? new Date(dataNascimento) : null,
      cor,
      observacoes,
      condicoes,
    });
    return this.animalRepository.salvar(animal);
  }
}
