import { describe, it, expect, beforeEach } from '@jest/globals';
import { IniciarBanho } from '../../../src/application/usecases/agendamento/IniciarBanho.js';
import { InMemoryAgendamentoRepository } from '../../fakes/InMemoryAgendamentoRepository.js';
import { FakeEventDispatcher } from '../../fakes/FakeEventDispatcher.js';
import { BusinessRuleError } from '../../../src/domain/errors/BusinessRuleError.js';
import { ForbiddenError } from '../../../src/domain/errors/ForbiddenError.js';
import { AgendamentoIniciadoEvent } from '../../../src/domain/events/AgendamentoIniciadoEvent.js';
import { FuncaoNome } from '../../../src/domain/entities/Funcao.js';

describe('IniciarBanho', () => {
  let agendamentoRepository;
  let eventDispatcher;
  let usecase;

  beforeEach(() => {
    agendamentoRepository = new InMemoryAgendamentoRepository();
    eventDispatcher = new FakeEventDispatcher();
    usecase = new IniciarBanho({ agendamentoRepository, eventDispatcher });
  });

  it('inicia o atendimento e emite AgendamentoIniciado quando o banhista responsável executa', async () => {
    const agendamento = await agendamentoRepository.salvar({
      clienteId: 1,
      animalId: 1,
      banhistaId: 2,
      data: '2030-01-01',
      hora: '10:00',
      servicoIds: [1],
    });

    const resultado = await usecase.execute({ agendamentoId: agendamento.id, requesterId: 2, requesterFuncoes: [FuncaoNome.BANHISTA] });

    expect(resultado.status).toBe('EM_ANDAMENTO');
    expect(eventDispatcher.publicados).toHaveLength(1);
    expect(eventDispatcher.publicados[0]).toBeInstanceOf(AgendamentoIniciadoEvent);
  });

  it('falha com regra de negócio quando não há banhista atribuído', async () => {
    const agendamento = await agendamentoRepository.salvar({
      clienteId: 1,
      animalId: 1,
      data: '2030-01-01',
      hora: '10:00',
      servicoIds: [1],
    });

    await expect(
      usecase.execute({ agendamentoId: agendamento.id, requesterId: 2, requesterFuncoes: [FuncaoNome.ADMIN] }),
    ).rejects.toThrow(BusinessRuleError);
  });

  it('falha com acesso proibido quando quem tenta iniciar não é o banhista nem ADMIN', async () => {
    const agendamento = await agendamentoRepository.salvar({
      clienteId: 1,
      animalId: 1,
      banhistaId: 2,
      data: '2030-01-01',
      hora: '10:00',
      servicoIds: [1],
    });

    await expect(
      usecase.execute({ agendamentoId: agendamento.id, requesterId: 999, requesterFuncoes: [FuncaoNome.BANHISTA] }),
    ).rejects.toThrow(ForbiddenError);
  });
});
