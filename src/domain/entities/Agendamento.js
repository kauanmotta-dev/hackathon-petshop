import { ValidationError } from '../errors/ValidationError.js';
import { BusinessRuleError } from '../errors/BusinessRuleError.js';
import { StatusAgendamento, validarTransicao } from '../value-objects/StatusAgendamento.js';

export class Agendamento {
  constructor({
    id,
    clienteId,
    animalId,
    banhistaId = null,
    data,
    hora,
    status = StatusAgendamento.AGENDADO,
    servicoIds = [],
  }) {
    if (!clienteId) throw new ValidationError('Agendamento precisa de um cliente');
    if (!animalId) throw new ValidationError('Agendamento precisa de um animal');
    if (!data || !hora) throw new ValidationError('Agendamento precisa de data e hora');

    this.id = id;
    this.clienteId = clienteId;
    this.animalId = animalId;
    this.banhistaId = banhistaId;
    this.data = data;
    this.hora = hora;
    this.status = status;
    this.servicoIds = [...servicoIds];
  }

  get dataHoraInicio() {
    return Agendamento.combinarDataHora(this.data, this.hora);
  }

  static combinarDataHora(data, hora) {
    const dataBase = data instanceof Date ? data.toISOString().slice(0, 10) : String(data).slice(0, 10);
    const horaBase = String(hora).length === 5 ? `${hora}:00` : String(hora);
    return new Date(`${dataBase}T${horaBase}`);
  }

  dataHoraFim(duracaoTotalMinutos) {
    return new Date(this.dataHoraInicio.getTime() + duracaoTotalMinutos * 60000);
  }

  sobrepoe(duracaoProprioMinutos, outraDataHoraInicio, outraDataHoraFim) {
    const inicio = this.dataHoraInicio;
    const fim = this.dataHoraFim(duracaoProprioMinutos);
    return inicio < outraDataHoraFim && outraDataHoraInicio < fim;
  }

  adicionarServico(servicoId) {
    if (this.servicoIds.includes(servicoId)) {
      throw new BusinessRuleError('Serviço já incluído neste agendamento');
    }
    this.servicoIds.push(servicoId);
  }

  garantirAoMenosUmServico() {
    if (this.servicoIds.length === 0) {
      throw new ValidationError('Agendamento precisa de ao menos 1 serviço');
    }
  }

  atribuirBanhista(banhistaId) {
    if (this.status !== StatusAgendamento.AGENDADO) {
      throw new BusinessRuleError('Só é possível atribuir banhista a um agendamento AGENDADO');
    }
    this.banhistaId = banhistaId;
  }

  cancelar() {
    if (this.status !== StatusAgendamento.AGENDADO) {
      throw new BusinessRuleError('Só é possível cancelar um agendamento com status AGENDADO');
    }
    this.status = StatusAgendamento.CANCELADO;
  }

  reagendar({ data, hora }) {
    if (this.status !== StatusAgendamento.AGENDADO) {
      throw new BusinessRuleError('Só é possível reagendar um agendamento com status AGENDADO');
    }
    if (!data || !hora) throw new ValidationError('Novo agendamento precisa de data e hora');
    this.data = data;
    this.hora = hora;
  }

  iniciar() {
    if (!this.banhistaId) {
      throw new BusinessRuleError('Agendamento precisa de um banhista atribuído para iniciar o atendimento');
    }
    if (!validarTransicao(this.status, StatusAgendamento.EM_ANDAMENTO)) {
      throw new BusinessRuleError(`Não é possível iniciar um atendimento a partir do status ${this.status}`);
    }
    this.status = StatusAgendamento.EM_ANDAMENTO;
  }

  finalizar() {
    if (!validarTransicao(this.status, StatusAgendamento.FINALIZADO)) {
      throw new BusinessRuleError(`Não é possível finalizar um atendimento a partir do status ${this.status}`);
    }
    this.status = StatusAgendamento.FINALIZADO;
  }
}
