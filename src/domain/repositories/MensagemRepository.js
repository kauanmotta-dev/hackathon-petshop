/**
 * Port do repositório de Mensagem (mensagens manuais e notificações).
 * @interface
 */
export class MensagemRepository {
  async salvar(_mensagem) {
    throw new Error('MensagemRepository.salvar não implementado');
  }

  async listarNotificacoesDoUsuario(_usuarioId) {
    throw new Error('MensagemRepository.listarNotificacoesDoUsuario não implementado');
  }

  async listarConversa(_usuarioIdA, _usuarioIdB) {
    throw new Error('MensagemRepository.listarConversa não implementado');
  }

  async listarContatos(_usuarioId) {
    throw new Error('MensagemRepository.listarContatos não implementado');
  }

  async marcarConversaComoLida(_usuarioId, _outroUsuarioId) {
    throw new Error('MensagemRepository.marcarConversaComoLida não implementado');
  }
}
