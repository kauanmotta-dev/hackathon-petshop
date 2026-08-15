import { ForbiddenError } from '../../../domain/errors/ForbiddenError.js';
import { FuncaoNome } from '../../../domain/entities/Funcao.js';

export function garantirResponsavelPeloAtendimento(agendamento, { requesterId, requesterFuncoes = [] }) {
  const ehAdmin = requesterFuncoes.includes(FuncaoNome.ADMIN);
  const ehBanhistaResponsavel = agendamento.banhistaId === requesterId;
  if (!ehAdmin && !ehBanhistaResponsavel) {
    throw new ForbiddenError('Apenas o banhista responsável ou um ADMIN pode iniciar/finalizar este atendimento');
  }
}
