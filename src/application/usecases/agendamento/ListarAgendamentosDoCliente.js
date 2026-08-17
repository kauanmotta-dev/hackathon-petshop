export class ListarAgendamentosDoCliente {
  constructor({ agendamentoRepository }) {
    this.agendamentoRepository = agendamentoRepository;
  }

  async execute({ clienteId }) {
    return this.agendamentoRepository.listarPorCliente(clienteId);
  }
}
