export class AgendamentoFinalizadoEvent {
  static NOME = 'AgendamentoFinalizado';

  constructor({ agendamentoId, clienteId, animalId, banhistaId, ocorridoEm = new Date() }) {
    this.nome = AgendamentoFinalizadoEvent.NOME;
    this.agendamentoId = agendamentoId;
    this.clienteId = clienteId;
    this.animalId = animalId;
    this.banhistaId = banhistaId;
    this.ocorridoEm = ocorridoEm;
  }
}
