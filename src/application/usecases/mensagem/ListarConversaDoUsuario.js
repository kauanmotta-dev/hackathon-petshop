export class ListarConversaDoUsuario {
  constructor({ mensagemRepository }) {
    this.mensagemRepository = mensagemRepository;
  }

  async execute({ usuarioId, outroUsuarioId }) {
    return this.mensagemRepository.listarConversa(usuarioId, outroUsuarioId);
  }
}
