export class MarcarConversaComoLida {
  constructor({ mensagemRepository }) {
    this.mensagemRepository = mensagemRepository;
  }

  async execute({ usuarioId, outroUsuarioId }) {
    return this.mensagemRepository.marcarConversaComoLida(usuarioId, outroUsuarioId);
  }
}
