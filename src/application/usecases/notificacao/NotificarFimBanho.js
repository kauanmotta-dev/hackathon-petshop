export class NotificarFimBanho {
  constructor({ notificationSender, logger = console }) {
    this.notificationSender = notificationSender;
    this.logger = logger;
  }

  async execute({ clienteId, agendamentoId }) {
    const conteudo = `O banho do seu pet (agendamento #${agendamentoId}) foi finalizado.`;
    try {
      await this.notificationSender.enviar(clienteId, conteudo);
    } catch (erro) {
      this.logger.error?.({ erro, agendamentoId }, 'Falha ao enviar notificação de fim de banho');
    }
  }
}
