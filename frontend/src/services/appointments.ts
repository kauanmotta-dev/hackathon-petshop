import { get, post, patch } from './http';
import type { Appointment, AppointmentStatus } from '../types';

interface BackendServicoResumo {
  id: number;
  nome: string;
  preco: number;
  duracaoMinutos: number;
}

interface BackendAgendamentoDetalhado {
  id: number;
  clienteId: number;
  clienteNome: string;
  banhistaId: number | null;
  banhistaNome: string | null;
  animalId: number;
  animalNome: string;
  data: string;
  hora: string;
  status: 'AGENDADO' | 'EM_ANDAMENTO' | 'FINALIZADO' | 'CANCELADO';
  servicos: BackendServicoResumo[];
  precoTotal: number;
}

const STATUS_TO_FRONTEND: Record<BackendAgendamentoDetalhado['status'], AppointmentStatus> = {
  AGENDADO: 'AGENDADO',
  EM_ANDAMENTO: 'EM_ANDAMENTO',
  FINALIZADO: 'CONCLUIDO',
  CANCELADO: 'CANCELADO',
};

function toDateOnly(value: string): string {
  return value.slice(0, 10);
}

function toAppointment(a: BackendAgendamentoDetalhado): Appointment {
  const servico = a.servicos[0];
  return {
    id: String(a.id),
    clientId: String(a.clienteId),
    clientName: a.clienteNome,
    petId: String(a.animalId),
    petName: a.animalNome,
    serviceId: servico ? String(servico.id) : '',
    serviceName: a.servicos.map((s) => s.nome).join(' + ') || '',
    groomerId: a.banhistaId ? String(a.banhistaId) : '',
    groomerName: a.banhistaNome ?? 'A definir',
    date: toDateOnly(a.data),
    time: a.hora.slice(0, 5),
    status: STATUS_TO_FRONTEND[a.status],
    notes: '',
    price: a.precoTotal,
  };
}

export async function listMyAppointments(): Promise<Appointment[]> {
  const agendamentos = await get<BackendAgendamentoDetalhado[]>('/agendamentos/cliente');
  return agendamentos.map(toAppointment);
}

export async function listGroomerAppointments(): Promise<Appointment[]> {
  const agendamentos = await get<BackendAgendamentoDetalhado[]>('/agendamentos/banhista');
  return agendamentos.map(toAppointment);
}

export async function listAllAppointments(): Promise<Appointment[]> {
  const agendamentos = await get<BackendAgendamentoDetalhado[]>('/agendamentos');
  return agendamentos.map(toAppointment);
}

export async function getAppointment(id: string): Promise<Appointment> {
  const agendamento = await get<BackendAgendamentoDetalhado>(`/agendamentos/${id}`);
  return toAppointment(agendamento);
}

export async function createAppointment(input: {
  petId: string;
  serviceIds: string[];
  date: string;
  time: string;
}): Promise<Appointment> {
  const agendamento = await post<{ id: number }>('/agendamentos', {
    animalId: Number(input.petId),
    data: input.date,
    hora: input.time,
    servicoIds: input.serviceIds.map(Number),
  });
  return getAppointment(String(agendamento.id));
}

export async function cancelAppointment(id: string): Promise<void> {
  await post(`/agendamentos/${id}/cancelar`);
}

export async function rescheduleAppointment(id: string, date: string, time: string): Promise<Appointment> {
  await patch(`/agendamentos/${id}`, { data: date, hora: time });
  return getAppointment(id);
}

export async function assignGroomer(id: string, groomerId: string): Promise<Appointment> {
  await post(`/agendamentos/${id}/banhista`, { banhistaId: Number(groomerId) });
  return getAppointment(id);
}

export async function startAppointment(id: string): Promise<Appointment> {
  await post(`/agendamentos/${id}/iniciar`);
  return getAppointment(id);
}

export async function finishAppointment(id: string): Promise<Appointment> {
  await post(`/agendamentos/${id}/finalizar`);
  return getAppointment(id);
}
