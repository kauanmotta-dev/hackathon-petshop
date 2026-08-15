import { AgendamentoRepository } from '../../../domain/repositories/AgendamentoRepository.js';
import { Agendamento } from '../../../domain/entities/Agendamento.js';
import { StatusAgendamento } from '../../../domain/value-objects/StatusAgendamento.js';

const STATUS_ATIVOS = [StatusAgendamento.AGENDADO, StatusAgendamento.EM_ANDAMENTO];

function toDomain(registro) {
  if (!registro) return null;
  return new Agendamento({
    id: registro.id,
    clienteId: registro.clienteId,
    banhistaId: registro.banhistaId,
    animalId: registro.animalId,
    data: registro.data,
    hora: registro.hora,
    status: registro.status,
    servicoIds: (registro.servicos ?? []).map((item) => item.servicoId),
  });
}

const INCLUDE_SERVICOS = { servicos: true };

export class PrismaAgendamentoRepository extends AgendamentoRepository {
  constructor(prisma) {
    super();
    this.prisma = prisma;
  }

  async salvar(agendamento) {
    const criado = await this.prisma.agendamento.create({
      data: {
        clienteId: agendamento.clienteId,
        banhistaId: agendamento.banhistaId,
        animalId: agendamento.animalId,
        data: agendamento.data,
        hora: agendamento.hora,
        status: agendamento.status,
        servicos: {
          create: agendamento.servicoIds.map((servicoId) => ({ servico: { connect: { id: servicoId } } })),
        },
      },
      include: INCLUDE_SERVICOS,
    });
    return toDomain(criado);
  }

  async buscarPorId(id) {
    const registro = await this.prisma.agendamento.findUnique({
      where: { id: Number(id) },
      include: INCLUDE_SERVICOS,
    });
    return toDomain(registro);
  }

  async listarPorCliente(clienteId) {
    const registros = await this.prisma.agendamento.findMany({
      where: { clienteId: Number(clienteId) },
      include: INCLUDE_SERVICOS,
      orderBy: [{ data: 'desc' }, { hora: 'desc' }],
    });
    return registros.map(toDomain);
  }

  async listarPorBanhista(banhistaId) {
    const registros = await this.prisma.agendamento.findMany({
      where: { banhistaId: Number(banhistaId) },
      include: INCLUDE_SERVICOS,
      orderBy: [{ data: 'desc' }, { hora: 'desc' }],
    });
    return registros.map(toDomain);
  }

  async listarAtivosPorBanhistaNoIntervalo(banhistaId, inicio, fim) {
    const dataInicial = new Date(inicio);
    dataInicial.setHours(0, 0, 0, 0);
    const dataFinal = new Date(fim);
    dataFinal.setHours(23, 59, 59, 999);

    const registros = await this.prisma.agendamento.findMany({
      where: {
        banhistaId: Number(banhistaId),
        status: { in: STATUS_ATIVOS },
        data: { gte: dataInicial, lte: dataFinal },
      },
      include: INCLUDE_SERVICOS,
    });
    return registros.map(toDomain);
  }

  async atualizar(agendamento) {
    const servicosAtuais = await this.prisma.agendamentoServico.findMany({
      where: { agendamentoId: agendamento.id },
    });
    const idsAtuais = servicosAtuais.map((item) => item.servicoId);
    const idsNovos = agendamento.servicoIds.filter((id) => !idsAtuais.includes(id));

    const atualizado = await this.prisma.agendamento.update({
      where: { id: agendamento.id },
      data: {
        banhistaId: agendamento.banhistaId,
        data: agendamento.data,
        hora: agendamento.hora,
        status: agendamento.status,
        servicos: {
          create: idsNovos.map((servicoId) => ({ servico: { connect: { id: servicoId } } })),
        },
      },
      include: INCLUDE_SERVICOS,
    });
    return toDomain(atualizado);
  }
}
