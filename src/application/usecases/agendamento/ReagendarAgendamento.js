import { Agendamento } from '../../../domain/entities/Agendamento.js';
import { NotFoundError } from '../../../domain/errors/NotFoundError.js';
import { ValidationError } from '../../../domain/errors/ValidationError.js';
import { ForbiddenError } from '../../../domain/errors/ForbiddenError.js';
import { FuncaoNome } from '../../../domain/entities/Funcao.js';
import { calcularDuracaoTotalMinutos, garantirSemConflitoDeAgenda } from './_conflito.js';

export class ReagendarAgendamento {
  constructor({ agendamentoRepository, servicoRepository }) {
    this.agendamentoRepository = agendamentoRepository;
    this.servicoRepository = servicoRepository;
  }

  async execute({ agendamentoId, data, hora, requesterId, requesterFuncoes = [] }) {
    const agendamento = await this.agendamentoRepository.buscarPorId(agendamentoId);
    if (!agendamento) {
      throw new NotFoundError('Agendamento não encontrado');
    }

    const ehAdmin = requesterFuncoes.includes(FuncaoNome.ADMIN);
    if (!ehAdmin && agendamento.clienteId !== requesterId) {
      throw new ForbiddenError('Você não tem acesso a este agendamento');
    }

    agendamento.reagendar({ data, hora });

    const novaDataHoraInicio = Agendamento.combinarDataHora(data, hora);
    if (novaDataHoraInicio.getTime() <= Date.now()) {
      throw new ValidationError('Não é possível agendar em um horário no passado');
    }

    if (agendamento.banhistaId) {
      const duracaoTotalMinutos = await calcularDuracaoTotalMinutos(this.servicoRepository, agendamento.servicoIds);
      await garantirSemConflitoDeAgenda({
        agendamentoRepository: this.agendamentoRepository,
        servicoRepository: this.servicoRepository,
        banhistaId: agendamento.banhistaId,
        agendamentoAtual: agendamento,
        duracaoTotalMinutos,
      });
    }

    return this.agendamentoRepository.atualizar(agendamento);
  }
}
