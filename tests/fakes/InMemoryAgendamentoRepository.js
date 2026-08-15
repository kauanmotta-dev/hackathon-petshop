import { AgendamentoRepository } from '../../src/domain/repositories/AgendamentoRepository.js';
import { Agendamento } from '../../src/domain/entities/Agendamento.js';
import { StatusAgendamento } from '../../src/domain/value-objects/StatusAgendamento.js';

const STATUS_ATIVOS = [StatusAgendamento.AGENDADO, StatusAgendamento.EM_ANDAMENTO];

export class InMemoryAgendamentoRepository extends AgendamentoRepository {
  constructor() {
    super();
    this.agendamentos = new Map();
    this.proximoId = 1;
  }

  async salvar(agendamento) {
    const id = this.proximoId++;
    const salvo = new Agendamento({ ...agendamento, id, servicoIds: [...agendamento.servicoIds] });
    this.agendamentos.set(id, salvo);
    return salvo;
  }

  async buscarPorId(id) {
    return this.agendamentos.get(Number(id)) ?? null;
  }

  async listarPorCliente(clienteId) {
    return [...this.agendamentos.values()].filter((a) => a.clienteId === clienteId);
  }

  async listarPorBanhista(banhistaId) {
    return [...this.agendamentos.values()].filter((a) => a.banhistaId === banhistaId);
  }

  async listarAtivosPorBanhistaNoIntervalo(banhistaId) {
    return [...this.agendamentos.values()].filter(
      (a) => a.banhistaId === banhistaId && STATUS_ATIVOS.includes(a.status),
    );
  }

  async atualizar(agendamento) {
    this.agendamentos.set(agendamento.id, agendamento);
    return agendamento;
  }
}
