import { describe, it, expect, beforeEach } from '@jest/globals';
import { CriarAgendamento } from '../../../src/application/usecases/agendamento/CriarAgendamento.js';
import { AtribuirBanhistaAoAgendamento } from '../../../src/application/usecases/agendamento/AtribuirBanhistaAoAgendamento.js';
import { ReagendarAgendamento } from '../../../src/application/usecases/agendamento/ReagendarAgendamento.js';
import { InMemoryAgendamentoRepository } from '../../fakes/InMemoryAgendamentoRepository.js';
import { InMemoryAnimalRepository } from '../../fakes/InMemoryAnimalRepository.js';
import { InMemoryServicoRepository } from '../../fakes/InMemoryServicoRepository.js';
import { InMemoryUsuarioRepository } from '../../fakes/InMemoryUsuarioRepository.js';
import { FuncaoNome } from '../../../src/domain/entities/Funcao.js';
import { ValidationError } from '../../../src/domain/errors/ValidationError.js';
import { ForbiddenError } from '../../../src/domain/errors/ForbiddenError.js';
import { ConflictError } from '../../../src/domain/errors/ConflictError.js';

describe('ReagendarAgendamento', () => {
  let agendamentoRepository;
  let reagendarAgendamento;
  let criarAgendamento;
  let atribuirBanhista;
  let animal;
  let servico;
  let banhista;

  beforeEach(async () => {
    agendamentoRepository = new InMemoryAgendamentoRepository();
    const animalRepository = new InMemoryAnimalRepository();
    const servicoRepository = new InMemoryServicoRepository();
    const usuarioRepository = new InMemoryUsuarioRepository();

    criarAgendamento = new CriarAgendamento({ agendamentoRepository, animalRepository, servicoRepository });
    atribuirBanhista = new AtribuirBanhistaAoAgendamento({ agendamentoRepository, usuarioRepository, servicoRepository });
    reagendarAgendamento = new ReagendarAgendamento({ agendamentoRepository, servicoRepository });

    animal = await animalRepository.salvar({ usuarioId: 1, nome: 'Rex', especie: 'Cachorro' });
    servico = await servicoRepository.salvar({ nome: 'Banho', preco: 50, duracaoMinutos: 60, ativo: true });
    banhista = await usuarioRepository.salvar({
      nome: 'Beto Banhista',
      email: 'beto@example.com',
      senhaHash: 'x',
      funcoes: [FuncaoNome.CLIENTE, FuncaoNome.BANHISTA],
    });
  });

  it('reagenda quando o cliente dono é quem executa e a nova data é válida', async () => {
    const agendamento = await criarAgendamento.execute({
      clienteId: 1,
      animalId: animal.id,
      data: '2030-01-01',
      hora: '10:00',
      servicoIds: [servico.id],
    });

    const atualizado = await reagendarAgendamento.execute({
      agendamentoId: agendamento.id,
      data: '2030-02-01',
      hora: '11:00',
      requesterId: 1,
      requesterFuncoes: [FuncaoNome.CLIENTE],
    });

    expect(atualizado.data).toBe('2030-02-01');
    expect(atualizado.hora).toBe('11:00');
  });

  it('rejeita reagendar para o passado e não deixa a entidade mutada', async () => {
    const agendamento = await criarAgendamento.execute({
      clienteId: 1,
      animalId: animal.id,
      data: '2030-01-01',
      hora: '10:00',
      servicoIds: [servico.id],
    });

    await expect(
      reagendarAgendamento.execute({
        agendamentoId: agendamento.id,
        data: '2000-01-01',
        hora: '10:00',
        requesterId: 1,
        requesterFuncoes: [FuncaoNome.CLIENTE],
      }),
    ).rejects.toThrow(ValidationError);

    const inalterado = await agendamentoRepository.buscarPorId(agendamento.id);
    expect(inalterado.data).toBe('2030-01-01');
    expect(inalterado.hora).toBe('10:00');
  });

  it('nega acesso quando quem tenta reagendar não é o cliente dono nem ADMIN', async () => {
    const agendamento = await criarAgendamento.execute({
      clienteId: 1,
      animalId: animal.id,
      data: '2030-01-01',
      hora: '10:00',
      servicoIds: [servico.id],
    });

    await expect(
      reagendarAgendamento.execute({
        agendamentoId: agendamento.id,
        data: '2030-02-01',
        hora: '11:00',
        requesterId: 999,
        requesterFuncoes: [FuncaoNome.CLIENTE],
      }),
    ).rejects.toThrow(ForbiddenError);
  });

  it('falha com conflito ao reagendar para um horário já ocupado pelo mesmo banhista', async () => {
    const primeiro = await criarAgendamento.execute({
      clienteId: 1,
      animalId: animal.id,
      data: '2030-01-01',
      hora: '10:00',
      servicoIds: [servico.id],
    });
    await atribuirBanhista.execute({ agendamentoId: primeiro.id, banhistaId: banhista.id });

    const segundo = await criarAgendamento.execute({
      clienteId: 1,
      animalId: animal.id,
      data: '2030-03-01',
      hora: '09:00',
      servicoIds: [servico.id],
    });
    await atribuirBanhista.execute({ agendamentoId: segundo.id, banhistaId: banhista.id });

    await expect(
      reagendarAgendamento.execute({
        agendamentoId: segundo.id,
        data: '2030-01-01',
        hora: '10:30',
        requesterId: 1,
        requesterFuncoes: [FuncaoNome.CLIENTE],
      }),
    ).rejects.toThrow(ConflictError);
  });
});
