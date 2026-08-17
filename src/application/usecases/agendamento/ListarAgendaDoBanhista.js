export class ListarAgendaDoBanhista {
  constructor({ agendamentoRepository }) {
    this.agendamentoRepository = agendamentoRepository;
  }

  async execute({ banhistaId }) {
    return this.agendamentoRepository.listarPorBanhista(banhistaId);
  }
}
