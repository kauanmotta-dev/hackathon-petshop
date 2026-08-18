import { NotFoundError } from '../../../domain/errors/NotFoundError.js';
import { AgendamentoFinalizadoEvent } from '../../../domain/events/AgendamentoFinalizadoEvent.js';
import { garantirResponsavelPeloAtendimento } from './_autorizacaoExecucao.js';

export class FinalizarBanho {
  constructor({ agendamentoRepository, eventDispatcher }) {
    this.agendamentoRepository = agendamentoRepository;
    this.eventDispatcher = eventDispatcher;
  }

  async execute({ agendamentoId, requesterId, requesterFuncoes = [] }) {
    const agendamento = await this.agendamentoRepository.buscarPorId(agendamentoId);
    if (!agendamento) {
      throw new NotFoundError('Agendamento não encontrado');
    }

    garantirResponsavelPeloAtendimento(agendamento, { requesterId, requesterFuncoes });

    agendamento.finalizar();

    const salvo = await this.agendamentoRepository.atualizar(agendamento);

    this.eventDispatcher.publish(
      new AgendamentoFinalizadoEvent({
        agendamentoId: agendamento.id,
        clienteId: agendamento.clienteId,
        animalId: agendamento.animalId,
        banhistaId: agendamento.banhistaId,
      }),
    );

    return salvo;
  }
}
