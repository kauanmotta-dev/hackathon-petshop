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
}
