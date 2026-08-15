function serializarAnimal(animal) {
  return {
    id: animal.id,
    usuarioId: animal.usuarioId,
    nome: animal.nome,
    especie: animal.especie,
    raca: animal.raca,
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
    const animal = await this.usecases.cadastrarAnimal.execute({ usuarioId: req.user.id, ...req.body });
    res.status(201).json({ data: serializarAnimal(animal) });
  };

  atualizar = async (req, res) => {
    const animal = await this.usecases.atualizarAnimal.execute({
      animalId: req.params.id,
      requesterId: req.user.id,
      requesterFuncoes: req.user.funcoes,
      ...req.body,
    });
    res.status(200).json({ data: serializarAnimal(animal) });
  };

  listarDoCliente = async (req, res) => {
    const animais = await this.usecases.listarAnimaisDoCliente.execute({ usuarioId: req.user.id });
    res.status(200).json({ data: animais.map(serializarAnimal) });
  };

  registrarProntuario = async (req, res) => {
    const prontuario = await this.usecases.registrarProntuario.execute({
      animalId: req.params.id,
      ...req.body,
    });
    res.status(201).json({ data: serializarProntuario(prontuario) });
  };

  atualizarProntuario = async (req, res) => {
    const prontuario = await this.usecases.atualizarProntuario.execute({
      animalId: req.params.id,
      ...req.body,
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
