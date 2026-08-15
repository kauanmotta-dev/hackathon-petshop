import { describe, it, expect, beforeEach } from '@jest/globals';
import { CriarAgendamento } from '../../../src/application/usecases/agendamento/CriarAgendamento.js';
import { InMemoryAgendamentoRepository } from '../../fakes/InMemoryAgendamentoRepository.js';
import { InMemoryAnimalRepository } from '../../fakes/InMemoryAnimalRepository.js';
import { InMemoryServicoRepository } from '../../fakes/InMemoryServicoRepository.js';
import { ValidationError } from '../../../src/domain/errors/ValidationError.js';
import { ForbiddenError } from '../../../src/domain/errors/ForbiddenError.js';
import { StatusAgendamento } from '../../../src/domain/value-objects/StatusAgendamento.js';

describe('CriarAgendamento', () => {
  let agendamentoRepository;
  let animalRepository;
  let servicoRepository;
  let usecase;
  let animal;
  let servico;

  beforeEach(async () => {
    agendamentoRepository = new InMemoryAgendamentoRepository();
    animalRepository = new InMemoryAnimalRepository();
    servicoRepository = new InMemoryServicoRepository();
    usecase = new CriarAgendamento({ agendamentoRepository, animalRepository, servicoRepository });

    animal = await animalRepository.salvar({ usuarioId: 1, nome: 'Rex', especie: 'Cachorro' });
    servico = await servicoRepository.salvar({ nome: 'Banho', preco: 50, duracaoMinutos: 60, ativo: true });
  });

  it('cria um agendamento AGENDADO para uma data futura com ao menos 1 serviço', async () => {
    const agendamento = await usecase.execute({
      clienteId: 1,
      animalId: animal.id,
      data: '2030-01-01',
      hora: '10:00',
      servicoIds: [servico.id],
    });

    expect(agendamento.status).toBe(StatusAgendamento.AGENDADO);
    expect(agendamento.servicoIds).toEqual([servico.id]);
  });

  it('falha sem nenhum serviço associado', async () => {
    await expect(
      usecase.execute({ clienteId: 1, animalId: animal.id, data: '2030-01-01', hora: '10:00', servicoIds: [] }),
    ).rejects.toThrow(ValidationError);
  });

  it('falha ao agendar em um horário no passado', async () => {
    await expect(
      usecase.execute({
        clienteId: 1,
        animalId: animal.id,
        data: '2000-01-01',
        hora: '10:00',
        servicoIds: [servico.id],
      }),
    ).rejects.toThrow(ValidationError);
  });

  it('falha quando o animal não pertence ao cliente do agendamento', async () => {
    await expect(
      usecase.execute({
        clienteId: 999,
        animalId: animal.id,
        data: '2030-01-01',
        hora: '10:00',
        servicoIds: [servico.id],
      }),
    ).rejects.toThrow(ForbiddenError);
  });
});
