export class ListarServicos {
  constructor({ servicoRepository }) {
    this.servicoRepository = servicoRepository;
  }

  async execute() {
    return this.servicoRepository.listarAtivos();
  }
}
