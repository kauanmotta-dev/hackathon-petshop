function serializarMensagem(mensagem) {
  return {
    id: mensagem.id,
    remetenteId: mensagem.remetenteId,
    destinatarioId: mensagem.destinatarioId,
    conteudo: mensagem.conteudo,
    tipo: mensagem.tipo,
    lida: mensagem.lida,
    dataEnvio: mensagem.dataEnvio,
  };
}

export class MensagemController {
  constructor({ mensagem: usecases }) {
    this.usecases = usecases;
  }

  enviar = async (req, res) => {
    const mensagem = await this.usecases.enviarMensagem.execute({
      ...req.body,
      remetenteId: req.user.id,
    });
    res.status(201).json({ data: serializarMensagem(mensagem) });
  };

  listarConversa = async (req, res) => {
    const mensagens = await this.usecases.listarConversaDoUsuario.execute({
      usuarioId: req.user.id,
      outroUsuarioId: req.params.usuarioId,
    });
    res.status(200).json({ data: mensagens.map(serializarMensagem) });
  };

  marcarComoLida = async (req, res) => {
    await this.usecases.marcarConversaComoLida.execute({
      usuarioId: req.user.id,
      outroUsuarioId: req.params.usuarioId,
    });
    res.status(204).send();
  };

  listarContatos = async (req, res) => {
    const contatos = await this.usecases.listarContatosDeMensagens.execute({ usuarioId: req.user.id });
    res.status(200).json({ data: contatos });
  };
}
