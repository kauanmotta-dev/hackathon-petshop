function serializarAgendamento(agendamento) {
  return {
    id: agendamento.id,
    clienteId: agendamento.clienteId,
    banhistaId: agendamento.banhistaId,
    animalId: agendamento.animalId,
    data: agendamento.data,
    hora: agendamento.hora,
    status: agendamento.status,
    servicoIds: agendamento.servicoIds,
  };
}

export class AgendamentoController {
  constructor({ agendamento: usecases }) {
    this.usecases = usecases;
  }

  criar = async (req, res) => {
    const agendamento = await this.usecases.criarAgendamento.execute({
      ...req.body,
      clienteId: req.user.id,
    });
    res.status(201).json({ data: serializarAgendamento(agendamento) });
  };

  adicionarServico = async (req, res) => {
    const agendamento = await this.usecases.adicionarServicoAoAgendamento.execute({
      agendamentoId: req.params.id,
      servicoId: req.body.servicoId,
      requesterId: req.user.id,
      requesterFuncoes: req.user.funcoes,
    });
    res.status(200).json({ data: serializarAgendamento(agendamento) });
  };

  atribuirBanhista = async (req, res) => {
    const agendamento = await this.usecases.atribuirBanhistaAoAgendamento.execute({
      agendamentoId: req.params.id,
      banhistaId: req.body.banhistaId,
    });
    res.status(200).json({ data: serializarAgendamento(agendamento) });
  };

  reagendar = async (req, res) => {
    const agendamento = await this.usecases.reagendarAgendamento.execute({
      ...req.body,
      agendamentoId: req.params.id,
      requesterId: req.user.id,
      requesterFuncoes: req.user.funcoes,
    });
    res.status(200).json({ data: serializarAgendamento(agendamento) });
  };

  cancelar = async (req, res) => {
    const agendamento = await this.usecases.cancelarAgendamento.execute({
      agendamentoId: req.params.id,
      requesterId: req.user.id,
      requesterFuncoes: req.user.funcoes,
    });
    res.status(200).json({ data: serializarAgendamento(agendamento) });
  };

  listarDoCliente = async (req, res) => {
    const agendamentos = await this.usecases.listarAgendamentosDetalhados.execute({ clienteId: req.user.id });
    res.status(200).json({ data: agendamentos });
  };

  listarDoBanhista = async (req, res) => {
    const agendamentos = await this.usecases.listarAgendamentosDetalhados.execute({ banhistaId: req.user.id });
    res.status(200).json({ data: agendamentos });
  };

  listarTodos = async (req, res) => {
    const agendamentos = await this.usecases.listarAgendamentosDetalhados.execute({});
    res.status(200).json({ data: agendamentos });
  };

  buscarPorId = async (req, res) => {
    const agendamento = await this.usecases.buscarAgendamentoDetalhado.execute({
      agendamentoId: req.params.id,
      requesterId: req.user.id,
      requesterFuncoes: req.user.funcoes,
    });
    res.status(200).json({ data: agendamento });
  };

  iniciar = async (req, res) => {
    const agendamento = await this.usecases.iniciarBanho.execute({
      agendamentoId: req.params.id,
      requesterId: req.user.id,
      requesterFuncoes: req.user.funcoes,
    });
    res.status(200).json({ data: serializarAgendamento(agendamento) });
  };

  finalizar = async (req, res) => {
    const agendamento = await this.usecases.finalizarBanho.execute({
      agendamentoId: req.params.id,
      requesterId: req.user.id,
      requesterFuncoes: req.user.funcoes,
    });
    res.status(200).json({ data: serializarAgendamento(agendamento) });
  };
}
