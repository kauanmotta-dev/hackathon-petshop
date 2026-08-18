export class ListarMateriais {
  constructor({ materialRepository }) {
    this.materialRepository = materialRepository;
  }

  async execute() {
    return this.materialRepository.listar();
  }
}
