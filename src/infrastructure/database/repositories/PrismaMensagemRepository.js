import { MensagemRepository } from '../../../domain/repositories/MensagemRepository.js';
import { Mensagem, TipoMensagem } from '../../../domain/entities/Mensagem.js';

function toDomain(registro) {
  if (!registro) return null;
  return new Mensagem({
    id: registro.id,
    remetenteId: registro.remetenteId,
    destinatarioId: registro.destinatarioId,
    conteudo: registro.conteudo,
    tipo: registro.tipo,
    lida: registro.lida,
    dataEnvio: registro.dataEnvio,
  });
}

export class PrismaMensagemRepository extends MensagemRepository {
  constructor(prisma) {
    super();
    this.prisma = prisma;
  }

  async salvar(mensagem) {
    const criado = await this.prisma.mensagem.create({
      data: {
        remetenteId: mensagem.remetenteId,
        destinatarioId: mensagem.destinatarioId,
        conteudo: mensagem.conteudo,
        tipo: mensagem.tipo,
        lida: mensagem.lida,
        dataEnvio: mensagem.dataEnvio,
      },
    });
    return toDomain(criado);
  }

  async listarNotificacoesDoUsuario(usuarioId) {
    const registros = await this.prisma.mensagem.findMany({
      where: { destinatarioId: Number(usuarioId), tipo: TipoMensagem.NOTIFICACAO },
      orderBy: { dataEnvio: 'desc' },
    });
    return registros.map(toDomain);
  }

  async listarConversa(usuarioIdA, usuarioIdB) {
    const registros = await this.prisma.mensagem.findMany({
      where: {
        tipo: TipoMensagem.MANUAL,
        OR: [
          { remetenteId: Number(usuarioIdA), destinatarioId: Number(usuarioIdB) },
          { remetenteId: Number(usuarioIdB), destinatarioId: Number(usuarioIdA) },
        ],
      },
      orderBy: { dataEnvio: 'asc' },
    });
    return registros.map(toDomain);
  }

  async marcarConversaComoLida(usuarioId, outroUsuarioId) {
    await this.prisma.mensagem.updateMany({
      where: {
        tipo: TipoMensagem.MANUAL,
        destinatarioId: Number(usuarioId),
        remetenteId: Number(outroUsuarioId),
        lida: false,
      },
      data: { lida: true },
    });
  }

  async listarContatos(usuarioId) {
    const id = Number(usuarioId);
    const registros = await this.prisma.mensagem.findMany({
      where: {
        tipo: TipoMensagem.MANUAL,
        OR: [{ remetenteId: id }, { destinatarioId: id }],
      },
      include: {
        remetente: { select: { id: true, nome: true } },
        destinatario: { select: { id: true, nome: true } },
      },
      orderBy: { dataEnvio: 'desc' },
    });

    const contatos = new Map();
    for (const registro of registros) {
      const outro = registro.remetenteId === id ? registro.destinatario : registro.remetente;
      if (!outro || contatos.has(outro.id)) continue;
      contatos.set(outro.id, {
        usuarioId: outro.id,
        usuarioNome: outro.nome,
        ultimaMensagem: registro.conteudo,
        ultimaMensagemEm: registro.dataEnvio,
      });
    }

    const naoLidas = await this.prisma.mensagem.groupBy({
      by: ['remetenteId'],
      where: { tipo: TipoMensagem.MANUAL, destinatarioId: id, lida: false },
      _count: { _all: true },
    });
    const naoLidasPorRemetente = new Map(naoLidas.map((item) => [item.remetenteId, item._count._all]));

    return [...contatos.values()].map((contato) => ({
      ...contato,
      naoLidas: naoLidasPorRemetente.get(contato.usuarioId) ?? 0,
    }));
  }
}
