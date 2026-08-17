import { describe, it, expect, beforeEach } from '@jest/globals';
import { FinalizarBanho } from '../../../src/application/usecases/agendamento/FinalizarBanho.js';
import { InMemoryAgendamentoRepository } from '../../fakes/InMemoryAgendamentoRepository.js';
import { FakeEventDispatcher } from '../../fakes/FakeEventDispatcher.js';
import { BusinessRuleError } from '../../../src/domain/errors/BusinessRuleError.js';
import { ForbiddenError } from '../../../src/domain/errors/ForbiddenError.js';
import { NotFoundError } from '../../../src/domain/errors/NotFoundError.js';
import { AgendamentoFinalizadoEvent } from '../../../src/domain/events/AgendamentoFinalizadoEvent.js';
import { FuncaoNome } from '../../../src/domain/entities/Funcao.js';

describe('FinalizarBanho', () => {
  let agendamentoRepository;
  let eventDispatcher;
  let usecase;

  beforeEach(() => {
    agendamentoRepository = new InMemoryAgendamentoRepository();
    eventDispatcher = new FakeEventDispatcher();
    usecase = new FinalizarBanho({ agendamentoRepository, eventDispatcher });
  });

  async function criarAgendamentoEmAndamento() {
    const agendamento = await agendamentoRepository.salvar({
      clienteId: 1,
      animalId: 1,
      banhistaId: 2,
      data: '2030-01-01',
      hora: '10:00',
      servicoIds: [1],
    });
    agendamento.iniciar();
    return agendamentoRepository.atualizar(agendamento);
  }

  it('finaliza o atendimento e emite AgendamentoFinalizado quando o banhista responsável executa', async () => {
    const agendamento = await criarAgendamentoEmAndamento();

    const resultado = await usecase.execute({
      agendamentoId: agendamento.id,
      requesterId: 2,
      requesterFuncoes: [FuncaoNome.BANHISTA],
    });

    expect(resultado.status).toBe('FINALIZADO');
    expect(eventDispatcher.publicados).toHaveLength(1);
    expect(eventDispatcher.publicados[0]).toBeInstanceOf(AgendamentoFinalizadoEvent);
    expect(eventDispatcher.publicados[0].agendamentoId).toBe(agendamento.id);
  });

  it('permite que um ADMIN finalize o atendimento mesmo não sendo o banhista responsável', async () => {
    const agendamento = await criarAgendamentoEmAndamento();

    const resultado = await usecase.execute({
      agendamentoId: agendamento.id,
      requesterId: 999,
      requesterFuncoes: [FuncaoNome.ADMIN],
    });

    expect(resultado.status).toBe('FINALIZADO');
  });

  it('falha com regra de negócio ao finalizar um agendamento que ainda não está EM_ANDAMENTO', async () => {
    const agendamento = await agendamentoRepository.salvar({
      clienteId: 1,
      animalId: 1,
      banhistaId: 2,
      data: '2030-01-01',
      hora: '10:00',
      servicoIds: [1],
    });

    await expect(
      usecase.execute({ agendamentoId: agendamento.id, requesterId: 2, requesterFuncoes: [FuncaoNome.BANHISTA] }),
    ).rejects.toThrow(BusinessRuleError);
    expect(eventDispatcher.publicados).toHaveLength(0);
  });

  it('falha com acesso proibido quando quem tenta finalizar não é o banhista responsável nem ADMIN', async () => {
    const agendamento = await criarAgendamentoEmAndamento();

    await expect(
      usecase.execute({ agendamentoId: agendamento.id, requesterId: 999, requesterFuncoes: [FuncaoNome.BANHISTA] }),
    ).rejects.toThrow(ForbiddenError);
    expect(eventDispatcher.publicados).toHaveLength(0);
  });

  it('lança NotFoundError quando o agendamento não existe', async () => {
    await expect(
      usecase.execute({ agendamentoId: 999, requesterId: 2, requesterFuncoes: [FuncaoNome.BANHISTA] }),
    ).rejects.toThrow(NotFoundError);
  });
});
