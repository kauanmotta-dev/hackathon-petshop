import { NotFoundError } from '../../../domain/errors/NotFoundError.js';
import { ForbiddenError } from '../../../domain/errors/ForbiddenError.js';
import { FuncaoNome } from '../../../domain/entities/Funcao.js';

export class CancelarAgendamento {
  constructor({ agendamentoRepository }) {
    this.agendamentoRepository = agendamentoRepository;
  }

  async execute({ agendamentoId, requesterId, requesterFuncoes = [] }) {
    const agendamento = await this.agendamentoRepository.buscarPorId(agendamentoId);
    if (!agendamento) {
      throw new NotFoundError('Agendamento não encontrado');
    }

    const ehAdmin = requesterFuncoes.includes(FuncaoNome.ADMIN);
    if (!ehAdmin && agendamento.clienteId !== requesterId) {
      throw new ForbiddenError('Você não tem acesso a este agendamento');
    }

    agendamento.cancelar();

    return this.agendamentoRepository.atualizar(agendamento);
  }
}
