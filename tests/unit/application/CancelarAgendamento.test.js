import { describe, it, expect, beforeEach } from '@jest/globals';
import { CancelarAgendamento } from '../../../src/application/usecases/agendamento/CancelarAgendamento.js';
import { InMemoryAgendamentoRepository } from '../../fakes/InMemoryAgendamentoRepository.js';
import { ForbiddenError } from '../../../src/domain/errors/ForbiddenError.js';
import { BusinessRuleError } from '../../../src/domain/errors/BusinessRuleError.js';
import { FuncaoNome } from '../../../src/domain/entities/Funcao.js';
import { StatusAgendamento } from '../../../src/domain/value-objects/StatusAgendamento.js';

describe('CancelarAgendamento', () => {
  let agendamentoRepository;
  let usecase;

  beforeEach(() => {
    agendamentoRepository = new InMemoryAgendamentoRepository();
    usecase = new CancelarAgendamento({ agendamentoRepository });
  });

  it('permite que o cliente dono cancele um agendamento AGENDADO', async () => {
    const agendamento = await agendamentoRepository.salvar({
      clienteId: 1,
      animalId: 1,
      data: '2030-01-01',
      hora: '10:00',
      servicoIds: [1],
    });

    const cancelado = await usecase.execute({ agendamentoId: agendamento.id, requesterId: 1, requesterFuncoes: [FuncaoNome.CLIENTE] });
    expect(cancelado.status).toBe(StatusAgendamento.CANCELADO);
  });

  it('falha com acesso proibido quando quem cancela não é o dono nem ADMIN', async () => {
    const agendamento = await agendamentoRepository.salvar({
      clienteId: 1,
      animalId: 1,
      data: '2030-01-01',
      hora: '10:00',
      servicoIds: [1],
    });

    await expect(
      usecase.execute({ agendamentoId: agendamento.id, requesterId: 999, requesterFuncoes: [FuncaoNome.CLIENTE] }),
    ).rejects.toThrow(ForbiddenError);
  });

  it('falha ao tentar cancelar um agendamento que já não está AGENDADO', async () => {
    const agendamento = await agendamentoRepository.salvar({
      clienteId: 1,
      animalId: 1,
      banhistaId: 2,
      data: '2030-01-01',
      hora: '10:00',
      servicoIds: [1],
      status: StatusAgendamento.EM_ANDAMENTO,
    });

    await expect(
      usecase.execute({ agendamentoId: agendamento.id, requesterId: 1, requesterFuncoes: [FuncaoNome.CLIENTE] }),
    ).rejects.toThrow(BusinessRuleError);
  });
});
