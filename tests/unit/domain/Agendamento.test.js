import { describe, it, expect } from '@jest/globals';
import { Agendamento } from '../../../src/domain/entities/Agendamento.js';
import { StatusAgendamento } from '../../../src/domain/value-objects/StatusAgendamento.js';
import { BusinessRuleError } from '../../../src/domain/errors/BusinessRuleError.js';
import { ValidationError } from '../../../src/domain/errors/ValidationError.js';

function criarAgendamento(overrides = {}) {
  return new Agendamento({
    id: 1,
    clienteId: 1,
    animalId: 1,
    data: '2030-01-01',
    hora: '10:00',
    servicoIds: [1],
    ...overrides,
  });
}

describe('Agendamento', () => {
  it('não inicia sem banhista atribuído', () => {
    const agendamento = criarAgendamento();
    expect(() => agendamento.iniciar()).toThrow(BusinessRuleError);
  });

  it('inicia normalmente quando AGENDADO com banhista', () => {
    const agendamento = criarAgendamento({ banhistaId: 2 });
    agendamento.iniciar();
    expect(agendamento.status).toBe(StatusAgendamento.EM_ANDAMENTO);
  });

  it('não finaliza um agendamento que não está EM_ANDAMENTO', () => {
    const agendamento = criarAgendamento({ banhistaId: 2 });
    expect(() => agendamento.finalizar()).toThrow(BusinessRuleError);
  });

  it('segue a ordem AGENDADO -> EM_ANDAMENTO -> FINALIZADO', () => {
    const agendamento = criarAgendamento({ banhistaId: 2 });
    agendamento.iniciar();
    agendamento.finalizar();
    expect(agendamento.status).toBe(StatusAgendamento.FINALIZADO);
  });

  it('não cancela um agendamento que não está AGENDADO', () => {
    const agendamento = criarAgendamento({ banhistaId: 2 });
    agendamento.iniciar();
    expect(() => agendamento.cancelar()).toThrow(BusinessRuleError);
  });

  it('exige ao menos 1 serviço', () => {
    const agendamento = criarAgendamento({ servicoIds: [] });
    expect(() => agendamento.garantirAoMenosUmServico()).toThrow(ValidationError);
  });

  it('detecta sobreposição de horário', () => {
    const agendamento = criarAgendamento({ data: '2030-01-01', hora: '10:00' });
    const inicio = new Date('2030-01-01T10:30:00');
    const fim = new Date('2030-01-01T11:00:00');
    expect(agendamento.sobrepoe(60, inicio, fim)).toBe(true);
  });

  it('não detecta sobreposição quando horários não se cruzam', () => {
    const agendamento = criarAgendamento({ data: '2030-01-01', hora: '10:00' });
    const inicio = new Date('2030-01-01T12:00:00');
    const fim = new Date('2030-01-01T13:00:00');
    expect(agendamento.sobrepoe(60, inicio, fim)).toBe(false);
  });
});
