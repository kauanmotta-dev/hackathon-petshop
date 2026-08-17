import { NotificationSender } from '../../application/ports/NotificationSender.js';
import { Mensagem } from '../../domain/entities/Mensagem.js';

export class MensagemNotificationSender extends NotificationSender {
  constructor({ mensagemRepository }) {
    super();
    this.mensagemRepository = mensagemRepository;
  }

  async enviar(destinatarioId, conteudo) {
    const mensagem = Mensagem.criarNotificacaoSistema({ destinatarioId, conteudo });
    return this.mensagemRepository.salvar(mensagem);
  }
}
