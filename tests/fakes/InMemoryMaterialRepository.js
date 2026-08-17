import { MaterialRepository } from '../../src/domain/repositories/MaterialRepository.js';
import { Material } from '../../src/domain/entities/Material.js';

export class InMemoryMaterialRepository extends MaterialRepository {
  constructor() {
    super();
    this.materiais = new Map();
    this.proximoId = 1;
  }

  async salvar(material) {
    const id = this.proximoId++;
    const salvo = new Material({ ...material, id });
    this.materiais.set(id, salvo);
    return salvo;
  }

  async buscarPorId(id) {
    return this.materiais.get(Number(id)) ?? null;
  }

  async listar() {
    return [...this.materiais.values()];
  }
}
