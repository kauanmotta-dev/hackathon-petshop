function serializarNotificacao(mensagem) {
  return {
    id: mensagem.id,
    conteudo: mensagem.conteudo,
    dataEnvio: mensagem.dataEnvio,
  };
}

export class NotificacaoController {
  constructor({ notificacao: usecases }) {
    this.usecases = usecases;
  }

  listarDoUsuario = async (req, res) => {
    const notificacoes = await this.usecases.listarNotificacoesDoUsuario.execute({ usuarioId: req.user.id });
    res.status(200).json({ data: notificacoes.map(serializarNotificacao) });
  };
}
