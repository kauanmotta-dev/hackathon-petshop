function serializarAnimal(animal) {
  return {
    id: animal.id,
    usuarioId: animal.usuarioId,
    nome: animal.nome,
    especie: animal.especie,
    raca: animal.raca,
    porte: animal.porte,
    dataNascimento: animal.dataNascimento,
    cor: animal.cor,
    observacoes: animal.observacoes,
    condicoes: animal.condicoes,
    prontuario: animal.prontuario ? serializarProntuario(animal.prontuario) : null,
  };
}

function serializarProntuario(prontuario) {
  return {
    id: prontuario.id,
    animalId: prontuario.animalId,
    historico: prontuario.historico,
    vacinas: prontuario.vacinas,
  };
}

export class AnimalController {
  constructor({ animal: usecases }) {
    this.usecases = usecases;
  }

  cadastrar = async (req, res) => {
    const animal = await this.usecases.cadastrarAnimal.execute({ ...req.body, usuarioId: req.user.id });
    res.status(201).json({ data: serializarAnimal(animal) });
  };

  atualizar = async (req, res) => {
    const animal = await this.usecases.atualizarAnimal.execute({
      ...req.body,
      animalId: req.params.id,
      requesterId: req.user.id,
      requesterFuncoes: req.user.funcoes,
    });
    res.status(200).json({ data: serializarAnimal(animal) });
  };

  listarDoCliente = async (req, res) => {
    const animais = await this.usecases.listarAnimaisDoCliente.execute({ usuarioId: req.user.id });
    res.status(200).json({ data: animais.map(serializarAnimal) });
  };

  registrarProntuario = async (req, res) => {
    const prontuario = await this.usecases.registrarProntuario.execute({
      ...req.body,
      animalId: req.params.id,
    });
    res.status(201).json({ data: serializarProntuario(prontuario) });
  };

  atualizarProntuario = async (req, res) => {
    const prontuario = await this.usecases.atualizarProntuario.execute({
      ...req.body,
      animalId: req.params.id,
      requesterId: req.user.id,
      requesterFuncoes: req.user.funcoes,
    });
    res.status(200).json({ data: serializarProntuario(prontuario) });
  };

  consultarProntuario = async (req, res) => {
    const prontuario = await this.usecases.consultarProntuario.execute({
      animalId: req.params.id,
      requesterId: req.user.id,
      requesterFuncoes: req.user.funcoes,
    });
    res.status(200).json({ data: serializarProntuario(prontuario) });
  };
}
