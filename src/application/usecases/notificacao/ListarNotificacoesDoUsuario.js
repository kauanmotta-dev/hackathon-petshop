export class ListarNotificacoesDoUsuario {
  constructor({ mensagemRepository }) {
    this.mensagemRepository = mensagemRepository;
  }

  async execute({ usuarioId }) {
    return this.mensagemRepository.listarNotificacoesDoUsuario(usuarioId);
  }
}
