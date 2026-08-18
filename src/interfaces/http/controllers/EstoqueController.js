function serializarEstoque(estoque) {
  return {
    id: estoque.id,
    nome: estoque.nome,
    descricao: estoque.descricao,
    materiais: estoque.materiais,
  };
}

function serializarMaterial(material) {
  return {
    id: material.id,
    nome: material.nome,
    tipo: material.tipo,
    unidade: material.unidade,
    categoria: material.categoria,
    quantidadeCritica: material.quantidadeCritica,
  };
}

function serializarSaldo(saldo) {
  return { id: saldo.id, materialId: saldo.materialId, estoqueId: saldo.estoqueId, quantidade: saldo.quantidade };
}

function serializarMovimentacao(movimentacao) {
  return {
    id: movimentacao.id,
    materialId: movimentacao.materialId,
    materialNome: movimentacao.materialNome,
    unidade: movimentacao.unidade,
    estoqueId: movimentacao.estoqueId,
    tipo: movimentacao.tipo,
    quantidade: movimentacao.quantidade,
    observacoes: movimentacao.observacoes,
    usuarioId: movimentacao.usuarioId,
    usuarioNome: movimentacao.usuarioNome,
    criadoEm: movimentacao.criadoEm,
  };
}

export class EstoqueController {
  constructor({ estoque: usecases }) {
    this.usecases = usecases;
  }

  criarEstoque = async (req, res) => {
    const estoque = await this.usecases.criarEstoque.execute(req.body);
    res.status(201).json({ data: serializarEstoque(estoque) });
  };

  criarMaterial = async (req, res) => {
    const material = await this.usecases.criarMaterial.execute(req.body);
    res.status(201).json({ data: serializarMaterial(material) });
  };

  registrarEntrada = async (req, res) => {
    const saldo = await this.usecases.registrarEntradaEstoque.execute({
      estoqueId: req.params.id,
      usuarioId: req.user.id,
      ...req.body,
    });
    res.status(200).json({ data: serializarSaldo(saldo) });
  };

  registrarSaida = async (req, res) => {
    const saldo = await this.usecases.registrarSaidaEstoque.execute({
      estoqueId: req.params.id,
      usuarioId: req.user.id,
      ...req.body,
    });
    res.status(200).json({ data: serializarSaldo(saldo) });
  };

  atribuirUsuario = async (req, res) => {
    await this.usecases.atribuirUsuarioAoEstoque.execute({
      estoqueId: req.params.id,
      usuarioId: req.body.usuarioId,
    });
    res.status(204).send();
  };

  consultarSaldo = async (req, res) => {
    const saldo = await this.usecases.consultarSaldoEstoque.execute({
      estoqueId: req.params.id,
      requesterId: req.user.id,
      requesterFuncoes: req.user.funcoes,
    });
    res.status(200).json({ data: saldo });
  };

  listarEstoques = async (req, res) => {
    const estoques = await this.usecases.listarEstoques.execute();
    res.status(200).json({ data: estoques.map(serializarEstoque) });
  };

  listarMateriais = async (req, res) => {
    const materiais = await this.usecases.listarMateriais.execute();
    res.status(200).json({ data: materiais.map(serializarMaterial) });
  };

  listarMovimentacoes = async (req, res) => {
    const movimentacoes = await this.usecases.listarMovimentacoesEstoque.execute({
      estoqueId: req.params.id,
      requesterId: req.user.id,
      requesterFuncoes: req.user.funcoes,
    });
    res.status(200).json({ data: movimentacoes.map(serializarMovimentacao) });
  };
}
