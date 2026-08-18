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

const INCLUDE_DETALHES = {
  cliente: { select: { id: true, nome: true } },
  banhista: { select: { id: true, nome: true } },
  animal: { select: { id: true, nome: true } },
  servicos: { include: { servico: true } },
};

function toDetalhado(registro) {
  if (!registro) return null;
  const servicos = registro.servicos.map((item) => ({
    id: item.servico.id,
    nome: item.servico.nome,
    preco: Number(item.servico.preco),
    duracaoMinutos: item.servico.duracaoMinutos,
  }));
  return {
    id: registro.id,
    clienteId: registro.clienteId,
    clienteNome: registro.cliente.nome,
    banhistaId: registro.banhistaId,
    banhistaNome: registro.banhista ? registro.banhista.nome : null,
    animalId: registro.animalId,
    animalNome: registro.animal.nome,
    data: registro.data,
    hora: registro.hora,
    status: registro.status,
    servicos,
    precoTotal: servicos.reduce((soma, servico) => soma + servico.preco, 0),
  };
}

function formatarDiaLocal(data) {
  return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}-${String(data.getDate()).padStart(2, '0')}`;
}

function diasLocais(inicio, fim) {
  const cursor = new Date(inicio);
  cursor.setHours(0, 0, 0, 0);
  const fimDia = new Date(fim);
  fimDia.setHours(0, 0, 0, 0);

  const dias = [];
  while (cursor <= fimDia) {
    dias.push(formatarDiaLocal(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return dias;
}

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

  async listarComDetalhes({ clienteId, banhistaId } = {}) {
    const where = {};
    if (clienteId) where.clienteId = Number(clienteId);
    if (banhistaId) where.banhistaId = Number(banhistaId);

    const registros = await this.prisma.agendamento.findMany({
      where,
      include: INCLUDE_DETALHES,
      orderBy: [{ data: 'desc' }, { hora: 'desc' }],
    });
    return registros.map(toDetalhado);
  }

  async buscarComDetalhesPorId(id) {
    const registro = await this.prisma.agendamento.findUnique({
      where: { id: Number(id) },
      include: INCLUDE_DETALHES,
    });
    return toDetalhado(registro);
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

  async comLockDeAgenda(banhistaId, inicio, fim, fn) {
    // Trava um advisory lock por dia local para cada dia que o intervalo
    // [inicio, fim] toca — os mesmos limites de "dia" usados por
    // listarAtivosPorBanhistaNoIntervalo. Um agendamento que atravessa a
    // meia-noite (ex.: 23:30 + 90min) precisa travar os dois dias, senão duas
    // atribuições concorrentes em dias-calendário diferentes, mas com
    // horários sobrepostos, tomam locks diferentes e nenhuma serializa a
    // outra — reabrindo a race de double-booking que este lock existe para
    // fechar. As chaves são ordenadas para evitar deadlock entre transações
    // que travam os mesmos dois dias em ordens diferentes.
    const chaves = diasLocais(inicio, fim)
      .map((dia) => `agenda-banhista:${banhistaId}:${dia}`)
      .sort();

    return this.prisma.$transaction(async (tx) => {
      for (const chave of chaves) {
        await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${chave}))`;
      }
      return fn(new PrismaAgendamentoRepository(tx));
    });
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
