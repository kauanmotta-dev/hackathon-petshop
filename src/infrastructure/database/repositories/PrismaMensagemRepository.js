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
}
