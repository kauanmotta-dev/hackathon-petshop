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

  /**
   * Executa `fn` com exclusividade sobre a agenda de `banhistaId` em todo o
   * intervalo [`inicio`, `fim`] (que pode tocar mais de um dia-calendário),
   * repassando a `fn` um repositório (potencialmente escopado a uma transação) a
   * ser usado para a checagem de conflito e a escrita subsequentes. Evita que
   * duas atribuições concorrentes ao mesmo banhista/horário passem ambas na
   * validação de conflito antes de qualquer uma delas persistir.
   */
  async comLockDeAgenda(_banhistaId, _inicio, _fim, _fn) {
    throw new Error('AgendamentoRepository.comLockDeAgenda não implementado');
  }
}
