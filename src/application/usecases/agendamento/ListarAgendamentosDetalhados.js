export class ListarAgendamentosDetalhados {
  constructor({ agendamentoRepository }) {
    this.agendamentoRepository = agendamentoRepository;
  }

  async execute({ clienteId, banhistaId } = {}) {
    return this.agendamentoRepository.listarComDetalhes({ clienteId, banhistaId });
  }
}
