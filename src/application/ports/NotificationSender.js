/**
 * Port para envio de notificações ao cliente. Implementação inicial persiste
 * a notificação como Mensagem (tipo NOTIFICACAO); pode ser trocada por
 * push/e-mail/SMS reais sem alterar os casos de uso que a consomem.
 * @interface
 */
export class NotificationSender {
  async enviar(_destinatarioId, _conteudo) {
    throw new Error('NotificationSender.enviar não implementado');
  }
}
