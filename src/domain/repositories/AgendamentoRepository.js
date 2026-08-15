/**
 * Port do repositório de Agendamento.
 * @interface
 */
export class AgendamentoRepository {
  async salvar(_agendamento) {
    throw new Error('AgendamentoRepository.salvar não implementado');
  }

  async buscarPorId(_id) {
    throw new Error('AgendamentoRepository.buscarPorId não implementado');
  }

  async listarPorCliente(_clienteId) {
    throw new Error('AgendamentoRepository.listarPorCliente não implementado');
  }

  async listarPorBanhista(_banhistaId) {
    throw new Error('AgendamentoRepository.listarPorBanhista não implementado');
  }

  async listarAtivosPorBanhistaNoIntervalo(_banhistaId, _inicio, _fim) {
    throw new Error('AgendamentoRepository.listarAtivosPorBanhistaNoIntervalo não implementado');
  }

  async atualizar(_agendamento) {
    throw new Error('AgendamentoRepository.atualizar não implementado');
  }
}
