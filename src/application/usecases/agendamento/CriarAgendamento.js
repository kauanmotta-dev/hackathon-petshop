import { Agendamento } from '../../../domain/entities/Agendamento.js';
import { NotFoundError } from '../../../domain/errors/NotFoundError.js';
import { ValidationError } from '../../../domain/errors/ValidationError.js';
import { ForbiddenError } from '../../../domain/errors/ForbiddenError.js';
import { calcularDuracaoTotalMinutos } from './_conflito.js';

export class CriarAgendamento {
  constructor({ agendamentoRepository, animalRepository, servicoRepository }) {
    this.agendamentoRepository = agendamentoRepository;
    this.animalRepository = animalRepository;
    this.servicoRepository = servicoRepository;
  }

  async execute({ clienteId, animalId, data, hora, servicoIds = [] }) {
    if (!Array.isArray(servicoIds) || servicoIds.length === 0) {
      throw new ValidationError('Agendamento precisa de ao menos 1 serviço');
    }

    const animal = await this.animalRepository.buscarPorId(animalId);
    if (!animal) {
      throw new NotFoundError('Animal não encontrado');
    }
    if (!animal.pertenceA(clienteId)) {
      throw new ForbiddenError('O animal do agendamento deve pertencer ao cliente do agendamento');
    }

    const agendamento = new Agendamento({ clienteId, animalId, data, hora, servicoIds: [] });

    const dataHoraInicio = agendamento.dataHoraInicio;
    if (dataHoraInicio.getTime() <= Date.now()) {
      throw new ValidationError('Não é possível agendar em um horário no passado');
    }

    await calcularDuracaoTotalMinutos(this.servicoRepository, servicoIds);
    servicoIds.forEach((servicoId) => agendamento.adicionarServico(servicoId));
    agendamento.garantirAoMenosUmServico();

    return this.agendamentoRepository.salvar(agendamento);
  }
}
