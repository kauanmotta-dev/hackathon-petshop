import { Material } from '../../../domain/entities/Material.js';

export class CriarMaterial {
  constructor({ materialRepository }) {
    this.materialRepository = materialRepository;
  }

  async execute({ nome, tipo }) {
    const material = new Material({ nome, tipo });
    return this.materialRepository.salvar(material);
  }
}
