import { ValidationError } from '../errors/ValidationError.js';

export const TipoMensagem = Object.freeze({
  MANUAL: 'MANUAL',
  NOTIFICACAO: 'NOTIFICACAO',
});

export class Mensagem {
  constructor({
    id,
    remetenteId = null,
    destinatarioId,
    conteudo,
    tipo = TipoMensagem.MANUAL,
    lida = false,
    dataEnvio = new Date(),
  }) {
    if (!destinatarioId) {
      throw new ValidationError('Mensagem precisa de um destinatário');
    }
    if (!conteudo || conteudo.trim().length < 1) {
      throw new ValidationError('Conteúdo da mensagem é obrigatório');
    }
    if (!Object.values(TipoMensagem).includes(tipo)) {
      throw new ValidationError(`Tipo de mensagem inválido: ${tipo}`);
    }
    if (tipo === TipoMensagem.MANUAL && !remetenteId) {
      throw new ValidationError('Mensagem manual precisa de um remetente humano');
    }

    this.id = id;
    this.remetenteId = remetenteId;
    this.destinatarioId = destinatarioId;
    this.conteudo = conteudo.trim();
    this.tipo = tipo;
    this.lida = lida;
    this.dataEnvio = dataEnvio;
  }

  marcarComoLida() {
    this.lida = true;
  }

  static criarNotificacaoSistema({ id, destinatarioId, conteudo, dataEnvio = new Date() }) {
    return new Mensagem({
      id,
      remetenteId: null,
      destinatarioId,
      conteudo,
      tipo: TipoMensagem.NOTIFICACAO,
      dataEnvio,
    });
  }
}
