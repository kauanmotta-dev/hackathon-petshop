import { NotFoundError } from '../../../domain/errors/NotFoundError.js';
import { ForbiddenError } from '../../../domain/errors/ForbiddenError.js';
import { FuncaoNome } from '../../../domain/entities/Funcao.js';

export class BuscarAgendamentoDetalhado {
  constructor({ agendamentoRepository }) {
    this.agendamentoRepository = agendamentoRepository;
  }

  async execute({ agendamentoId, requesterId, requesterFuncoes = [] }) {
    const agendamento = await this.agendamentoRepository.buscarComDetalhesPorId(agendamentoId);
    if (!agendamento) {
      throw new NotFoundError('Agendamento não encontrado');
    }

    const ehAdmin = requesterFuncoes.includes(FuncaoNome.ADMIN);
    const ehDono = agendamento.clienteId === requesterId;
    const ehBanhistaAtribuido = agendamento.banhistaId === requesterId;

    if (!ehAdmin && !ehDono && !ehBanhistaAtribuido) {
      throw new ForbiddenError('Você não tem acesso a este agendamento');
    }

    return agendamento;
  }
}
