import { ConflictError } from '../../../domain/errors/ConflictError.js';
import { ValidationError } from '../../../domain/errors/ValidationError.js';

export async function calcularDuracaoTotalMinutos(servicoRepository, servicoIds) {
  const servicos = await servicoRepository.listarPorIds(servicoIds);
  if (servicos.length !== servicoIds.length) {
    throw new ValidationError('Um ou mais serviços informados não existem');
  }
  const inativos = servicos.filter((servico) => !servico.ativo);
  if (inativos.length > 0) {
    throw new ValidationError('Um ou mais serviços informados estão inativos');
  }
  return servicos.reduce((total, servico) => total + servico.duracaoMinutos, 0);
}

export async function garantirSemConflitoDeAgenda({
  agendamentoRepository,
  servicoRepository,
  banhistaId,
  agendamentoAtual,
  duracaoTotalMinutos,
}) {
  const inicio = agendamentoAtual.dataHoraInicio;
  const fim = agendamentoAtual.dataHoraFim(duracaoTotalMinutos);

  const conflitantes = await agendamentoRepository.listarAtivosPorBanhistaNoIntervalo(banhistaId, inicio, fim);

  for (const outro of conflitantes) {
    if (outro.id === agendamentoAtual.id) continue;
    const duracaoOutro = await calcularDuracaoTotalMinutos(servicoRepository, outro.servicoIds);
    if (outro.sobrepoe(duracaoOutro, inicio, fim)) {
      throw new ConflictError('Banhista já possui um agendamento em horário sobreposto');
    }
  }
}
