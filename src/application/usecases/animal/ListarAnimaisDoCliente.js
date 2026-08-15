export class ListarAnimaisDoCliente {
  constructor({ animalRepository }) {
    this.animalRepository = animalRepository;
  }

  async execute({ usuarioId }) {
    return this.animalRepository.listarPorUsuario(usuarioId);
  }
}
