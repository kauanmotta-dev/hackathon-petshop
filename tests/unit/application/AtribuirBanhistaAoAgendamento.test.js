import { describe, it, expect, beforeEach } from '@jest/globals';
import { CriarAgendamento } from '../../../src/application/usecases/agendamento/CriarAgendamento.js';
import { AtribuirBanhistaAoAgendamento } from '../../../src/application/usecases/agendamento/AtribuirBanhistaAoAgendamento.js';
import { InMemoryAgendamentoRepository } from '../../fakes/InMemoryAgendamentoRepository.js';
import { InMemoryAnimalRepository } from '../../fakes/InMemoryAnimalRepository.js';
import { InMemoryServicoRepository } from '../../fakes/InMemoryServicoRepository.js';
import { InMemoryUsuarioRepository } from '../../fakes/InMemoryUsuarioRepository.js';
import { FuncaoNome } from '../../../src/domain/entities/Funcao.js';
import { ConflictError } from '../../../src/domain/errors/ConflictError.js';

describe('AtribuirBanhistaAoAgendamento', () => {
  let agendamentoRepository;
  let usuarioRepository;
  let atribuirBanhista;
  let criarAgendamento;
  let banhista;
  let animal;
  let servico;

  beforeEach(async () => {
    agendamentoRepository = new InMemoryAgendamentoRepository();
    const animalRepository = new InMemoryAnimalRepository();
    const servicoRepository = new InMemoryServicoRepository();
    usuarioRepository = new InMemoryUsuarioRepository();

    criarAgendamento = new CriarAgendamento({ agendamentoRepository, animalRepository, servicoRepository });
    atribuirBanhista = new AtribuirBanhistaAoAgendamento({ agendamentoRepository, usuarioRepository, servicoRepository });

    animal = await animalRepository.salvar({ usuarioId: 1, nome: 'Rex', especie: 'Cachorro' });
    servico = await servicoRepository.salvar({ nome: 'Banho', preco: 50, duracaoMinutos: 60, ativo: true });
    banhista = await usuarioRepository.salvar({
      nome: 'Beto Banhista',
      email: 'beto@example.com',
      senhaHash: 'x',
      funcoes: [FuncaoNome.CLIENTE, FuncaoNome.BANHISTA],
    });
  });

  it('atribui um banhista disponível a um agendamento', async () => {
    const agendamento = await criarAgendamento.execute({
      clienteId: 1,
      animalId: animal.id,
      data: '2030-01-01',
      hora: '10:00',
      servicoIds: [servico.id],
    });

    const atualizado = await atribuirBanhista.execute({ agendamentoId: agendamento.id, banhistaId: banhista.id });
    expect(atualizado.banhistaId).toBe(banhista.id);
  });

  it('falha com conflito quando o banhista já tem agendamento em horário sobreposto', async () => {
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
      data: '2030-01-01',
      hora: '10:30',
      servicoIds: [servico.id],
    });

    await expect(
      atribuirBanhista.execute({ agendamentoId: segundo.id, banhistaId: banhista.id }),
    ).rejects.toThrow(ConflictError);
  });
});
