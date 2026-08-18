export class ListarServicos {
  constructor({ servicoRepository }) {
    this.servicoRepository = servicoRepository;
  }

  async execute({ apenasAtivos = true } = {}) {
    return apenasAtivos ? this.servicoRepository.listarAtivos() : this.servicoRepository.listar();
  }
}
