import { NotFoundError } from '../../../domain/errors/NotFoundError.js';
import { ValidationError } from '../../../domain/errors/ValidationError.js';
import { FuncaoNome } from '../../../domain/entities/Funcao.js';
import { calcularDuracaoTotalMinutos, garantirSemConflitoDeAgenda } from './_conflito.js';

export class AtribuirBanhistaAoAgendamento {
  constructor({ agendamentoRepository, usuarioRepository, servicoRepository }) {
    this.agendamentoRepository = agendamentoRepository;
    this.usuarioRepository = usuarioRepository;
    this.servicoRepository = servicoRepository;
  }

  async execute({ agendamentoId, banhistaId }) {
    const agendamento = await this.agendamentoRepository.buscarPorId(agendamentoId);
    if (!agendamento) {
      throw new NotFoundError('Agendamento não encontrado');
    }

    const banhista = await this.usuarioRepository.buscarPorId(banhistaId);
    if (!banhista) {
      throw new NotFoundError('Banhista não encontrado');
    }
    if (!banhista.temFuncao(FuncaoNome.BANHISTA)) {
      throw new ValidationError('Usuário informado não possui o papel BANHISTA');
    }

    const duracaoTotalMinutos = await calcularDuracaoTotalMinutos(this.servicoRepository, agendamento.servicoIds);
    const inicio = agendamento.dataHoraInicio;
    const fim = agendamento.dataHoraFim(duracaoTotalMinutos);

    return this.agendamentoRepository.comLockDeAgenda(banhistaId, inicio, fim, async (agendamentoRepositoryTx) => {
      await garantirSemConflitoDeAgenda({
        agendamentoRepository: agendamentoRepositoryTx,
        servicoRepository: this.servicoRepository,
        banhistaId,
        agendamentoAtual: agendamento,
        duracaoTotalMinutos,
      });

      agendamento.atribuirBanhista(banhistaId);

      return agendamentoRepositoryTx.atualizar(agendamento);
    });
  }
}
