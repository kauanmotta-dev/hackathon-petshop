function serializarEstoque(estoque) {
  return { id: estoque.id, nome: estoque.nome };
}

function serializarMaterial(material) {
  return { id: material.id, nome: material.nome, tipo: material.tipo };
}

function serializarSaldo(saldo) {
  return { id: saldo.id, materialId: saldo.materialId, estoqueId: saldo.estoqueId, quantidade: saldo.quantidade };
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
      ...req.body,
    });
    res.status(200).json({ data: serializarSaldo(saldo) });
  };

  registrarSaida = async (req, res) => {
    const saldo = await this.usecases.registrarSaidaEstoque.execute({
      estoqueId: req.params.id,
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
}
