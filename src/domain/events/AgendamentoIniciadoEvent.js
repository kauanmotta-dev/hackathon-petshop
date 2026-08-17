export class AgendamentoIniciadoEvent {
  static NOME = 'AgendamentoIniciado';

  constructor({ agendamentoId, clienteId, animalId, banhistaId, ocorridoEm = new Date() }) {
    this.nome = AgendamentoIniciadoEvent.NOME;
    this.agendamentoId = agendamentoId;
    this.clienteId = clienteId;
    this.animalId = animalId;
    this.banhistaId = banhistaId;
    this.ocorridoEm = ocorridoEm;
  }
}
