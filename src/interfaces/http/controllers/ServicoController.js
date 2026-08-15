function serializarServico(servico) {
  return {
    id: servico.id,
    nome: servico.nome,
    preco: servico.preco,
    duracaoMinutos: servico.duracaoMinutos,
    ativo: servico.ativo,
  };
}

export class ServicoController {
  constructor({ servico: usecases }) {
    this.usecases = usecases;
  }

  criar = async (req, res) => {
    const servico = await this.usecases.criarServico.execute(req.body);
    res.status(201).json({ data: serializarServico(servico) });
  };

  atualizar = async (req, res) => {
    const servico = await this.usecases.atualizarServico.execute({ servicoId: req.params.id, ...req.body });
    res.status(200).json({ data: serializarServico(servico) });
  };

  inativar = async (req, res) => {
    const servico = await this.usecases.inativarServico.execute({ servicoId: req.params.id });
    res.status(200).json({ data: serializarServico(servico) });
  };

  listar = async (req, res) => {
    const servicos = await this.usecases.listarServicos.execute();
    res.status(200).json({ data: servicos.map(serializarServico) });
  };
}
