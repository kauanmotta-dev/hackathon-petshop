import { NotFoundError } from '../../../domain/errors/NotFoundError.js';
import { BusinessRuleError } from '../../../domain/errors/BusinessRuleError.js';
import { ForbiddenError } from '../../../domain/errors/ForbiddenError.js';
import { StatusAgendamento } from '../../../domain/value-objects/StatusAgendamento.js';
import { FuncaoNome } from '../../../domain/entities/Funcao.js';
import { calcularDuracaoTotalMinutos, garantirSemConflitoDeAgenda } from './_conflito.js';

export class AdicionarServicoAoAgendamento {
  constructor({ agendamentoRepository, servicoRepository }) {
    this.agendamentoRepository = agendamentoRepository;
    this.servicoRepository = servicoRepository;
  }

  async execute({ agendamentoId, servicoId, requesterId, requesterFuncoes = [] }) {
    const agendamento = await this.agendamentoRepository.buscarPorId(agendamentoId);
    if (!agendamento) {
      throw new NotFoundError('Agendamento não encontrado');
    }

    const ehAdmin = requesterFuncoes.includes(FuncaoNome.ADMIN);
    if (!ehAdmin && agendamento.clienteId !== requesterId) {
      throw new ForbiddenError('Você não tem acesso a este agendamento');
    }

    if (agendamento.status !== StatusAgendamento.AGENDADO) {
      throw new BusinessRuleError('Só é possível alterar serviços de um agendamento com status AGENDADO');
    }

    agendamento.adicionarServico(servicoId);

    const duracaoTotalMinutos = await calcularDuracaoTotalMinutos(this.servicoRepository, agendamento.servicoIds);

    if (!agendamento.banhistaId) {
      return this.agendamentoRepository.atualizar(agendamento);
    }

    const inicio = agendamento.dataHoraInicio;
    const fim = agendamento.dataHoraFim(duracaoTotalMinutos);

    return this.agendamentoRepository.comLockDeAgenda(
      agendamento.banhistaId,
      inicio,
      fim,
      async (agendamentoRepositoryTx) => {
        await garantirSemConflitoDeAgenda({
          agendamentoRepository: agendamentoRepositoryTx,
          servicoRepository: this.servicoRepository,
          banhistaId: agendamento.banhistaId,
          agendamentoAtual: agendamento,
          duracaoTotalMinutos,
        });

        return agendamentoRepositoryTx.atualizar(agendamento);
      },
    );
  }
}
