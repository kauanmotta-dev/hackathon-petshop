import { describe, it, expect } from '@jest/globals';
import { StatusAgendamento, validarTransicao } from '../../../src/domain/value-objects/StatusAgendamento.js';

describe('StatusAgendamento', () => {
  it('permite AGENDADO -> EM_ANDAMENTO', () => {
    expect(validarTransicao(StatusAgendamento.AGENDADO, StatusAgendamento.EM_ANDAMENTO)).toBe(true);
  });

  it('permite AGENDADO -> CANCELADO', () => {
    expect(validarTransicao(StatusAgendamento.AGENDADO, StatusAgendamento.CANCELADO)).toBe(true);
  });

  it('permite EM_ANDAMENTO -> FINALIZADO', () => {
    expect(validarTransicao(StatusAgendamento.EM_ANDAMENTO, StatusAgendamento.FINALIZADO)).toBe(true);
  });

  it('não permite EM_ANDAMENTO -> CANCELADO', () => {
    expect(validarTransicao(StatusAgendamento.EM_ANDAMENTO, StatusAgendamento.CANCELADO)).toBe(false);
  });

  it('não permite transições a partir de FINALIZADO', () => {
    expect(validarTransicao(StatusAgendamento.FINALIZADO, StatusAgendamento.EM_ANDAMENTO)).toBe(false);
  });

  it('não permite transições a partir de CANCELADO', () => {
    expect(validarTransicao(StatusAgendamento.CANCELADO, StatusAgendamento.AGENDADO)).toBe(false);
  });
});
