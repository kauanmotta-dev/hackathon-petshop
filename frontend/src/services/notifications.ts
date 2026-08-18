import { get } from './http';

export interface Notification {
  id: string;
  content: string;
  sentAt: string;
}

interface BackendNotificacao {
  id: number;
  conteudo: string;
  dataEnvio: string;
}

export async function listNotifications(): Promise<Notification[]> {
  const notificacoes = await get<BackendNotificacao[]>('/notificacoes');
  return notificacoes.map((n) => ({ id: String(n.id), content: n.conteudo, sentAt: n.dataEnvio }));
}
