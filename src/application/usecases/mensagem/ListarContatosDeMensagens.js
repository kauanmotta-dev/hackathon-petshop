export class ListarContatosDeMensagens {
  constructor({ mensagemRepository }) {
    this.mensagemRepository = mensagemRepository;
  }

  async execute({ usuarioId }) {
    return this.mensagemRepository.listarContatos(usuarioId);
  }
}
