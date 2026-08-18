import { MensagemRepository } from '../../src/domain/repositories/MensagemRepository.js';
import { Mensagem, TipoMensagem } from '../../src/domain/entities/Mensagem.js';

export class InMemoryMensagemRepository extends MensagemRepository {
  constructor() {
    super();
    this.mensagens = new Map();
    this.proximoId = 1;
  }

  async salvar(mensagem) {
    const id = this.proximoId++;
    const salvo = new Mensagem({ ...mensagem, id });
    this.mensagens.set(id, salvo);
    return salvo;
  }

  async listarNotificacoesDoUsuario(usuarioId) {
    return [...this.mensagens.values()]
      .filter((m) => m.destinatarioId === usuarioId && m.tipo === TipoMensagem.NOTIFICACAO)
      .sort((a, b) => b.dataEnvio - a.dataEnvio);
  }

  async listarConversa(usuarioIdA, usuarioIdB) {
    return [...this.mensagens.values()]
      .filter(
        (m) =>
          m.tipo === TipoMensagem.MANUAL &&
          ((m.remetenteId === usuarioIdA && m.destinatarioId === usuarioIdB) ||
            (m.remetenteId === usuarioIdB && m.destinatarioId === usuarioIdA)),
      )
      .sort((a, b) => a.dataEnvio - b.dataEnvio);
  }

  async marcarConversaComoLida(usuarioId, outroUsuarioId) {
    for (const mensagem of this.mensagens.values()) {
      if (
        mensagem.tipo === TipoMensagem.MANUAL &&
        mensagem.destinatarioId === usuarioId &&
        mensagem.remetenteId === outroUsuarioId
      ) {
        mensagem.lida = true;
      }
    }
  }

  async listarContatos(usuarioId) {
    const contatos = new Map();
    for (const mensagem of [...this.mensagens.values()].sort((a, b) => a.dataEnvio - b.dataEnvio)) {
      if (mensagem.tipo !== TipoMensagem.MANUAL) continue;
      const outroId =
        mensagem.remetenteId === usuarioId
          ? mensagem.destinatarioId
          : mensagem.destinatarioId === usuarioId
            ? mensagem.remetenteId
            : null;
      if (outroId === null) continue;
      contatos.set(outroId, { usuarioId: outroId, ultimaMensagem: mensagem.conteudo, ultimaMensagemEm: mensagem.dataEnvio });
    }
    return [...contatos.values()];
  }
}
