import { ValidationError } from '../errors/ValidationError.js';

export const StatusAgendamento = Object.freeze({
  AGENDADO: 'AGENDADO',
  EM_ANDAMENTO: 'EM_ANDAMENTO',
  FINALIZADO: 'FINALIZADO',
  CANCELADO: 'CANCELADO',
});

const VALORES = Object.values(StatusAgendamento);

const TRANSICOES_VALIDAS = {
  [StatusAgendamento.AGENDADO]: [StatusAgendamento.EM_ANDAMENTO, StatusAgendamento.CANCELADO],
  [StatusAgendamento.EM_ANDAMENTO]: [StatusAgendamento.FINALIZADO],
  [StatusAgendamento.FINALIZADO]: [],
  [StatusAgendamento.CANCELADO]: [],
};

export function isStatusValido(status) {
  return VALORES.includes(status);
}

export function validarTransicao(statusAtual, statusDestino) {
  if (!isStatusValido(statusAtual) || !isStatusValido(statusDestino)) {
    throw new ValidationError('Status de agendamento inválido');
  }
  const permitidos = TRANSICOES_VALIDAS[statusAtual] ?? [];
  return permitidos.includes(statusDestino);
}
