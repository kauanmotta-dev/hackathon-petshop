import { AnimalRepository } from '../../src/domain/repositories/AnimalRepository.js';
import { Animal } from '../../src/domain/entities/Animal.js';

export class InMemoryAnimalRepository extends AnimalRepository {
  constructor() {
    super();
    this.animais = new Map();
    this.prontuarios = new Map();
    this.proximoId = 1;
    this.proximoProntuarioId = 1;
  }

  async salvar(animal) {
    const id = this.proximoId++;
    const salvo = new Animal({ ...animal, id });
    this.animais.set(id, salvo);
    return salvo;
  }

  async buscarPorId(id) {
    return this.animais.get(Number(id)) ?? null;
  }

  async listarPorUsuario(usuarioId) {
    return [...this.animais.values()].filter((a) => a.usuarioId === usuarioId);
  }

  async atualizar(animal) {
    this.animais.set(animal.id, animal);
    return animal;
  }

  async salvarProntuario(prontuario) {
    const id = this.proximoProntuarioId++;
    const salvo = { ...prontuario, id };
    Object.setPrototypeOf(salvo, Object.getPrototypeOf(prontuario));
    this.prontuarios.set(prontuario.animalId, salvo);
    return salvo;
  }

  async buscarProntuarioPorAnimalId(animalId) {
    return this.prontuarios.get(Number(animalId)) ?? null;
  }

  async atualizarProntuario(prontuario) {
    this.prontuarios.set(prontuario.animalId, prontuario);
    return prontuario;
  }
}
