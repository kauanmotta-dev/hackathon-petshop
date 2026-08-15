import { Animal } from '../../../domain/entities/Animal.js';

export class CadastrarAnimal {
  constructor({ animalRepository }) {
    this.animalRepository = animalRepository;
  }

  async execute({ usuarioId, nome, especie, raca }) {
    const animal = new Animal({ usuarioId, nome, especie, raca });
    return this.animalRepository.salvar(animal);
  }
}
