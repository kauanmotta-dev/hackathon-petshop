import { get, post } from './http';
import type { Message } from '../types';

interface BackendMensagem {
  id: number;
  remetenteId: number | null;
  destinatarioId: number;
  conteudo: string;
  tipo: 'MANUAL' | 'NOTIFICACAO';
  lida: boolean;
  dataEnvio: string;
}

export interface Contact {
  userId: string;
  name: string;
  lastMessage: string;
  lastMessageAt: string;
  unread: number;
}

function toMessage(m: BackendMensagem, myId: string, myName: string, otherId: string, otherName: string): Message {
  const isMe = String(m.remetenteId) === myId;
  return {
    id: String(m.id),
    fromId: isMe ? myId : otherId,
    fromName: isMe ? myName : otherName,
    toId: isMe ? otherId : myId,
    toName: isMe ? otherName : myName,
    content: m.conteudo,
    timestamp: m.dataEnvio,
    read: m.lida,
  };
}

export async function listContacts(): Promise<Contact[]> {
  const contatos = await get<{ usuarioId: number; usuarioNome: string; ultimaMensagem: string; ultimaMensagemEm: string; naoLidas: number }[]>(
    '/mensagens',
  );
  return contatos.map((c) => ({
    userId: String(c.usuarioId),
    name: c.usuarioNome,
    lastMessage: c.ultimaMensagem,
    lastMessageAt: c.ultimaMensagemEm,
    unread: c.naoLidas,
  }));
}

export async function listConversation(
  myId: string,
  myName: string,
  otherId: string,
  otherName: string,
): Promise<Message[]> {
  const mensagens = await get<BackendMensagem[]>(`/mensagens/${otherId}`);
  return mensagens.map((m) => toMessage(m, myId, myName, otherId, otherName));
}

export async function sendMessage(toId: string, content: string): Promise<void> {
  await post('/mensagens', { destinatarioId: Number(toId), conteudo: content });
}

export async function markConversationRead(otherId: string): Promise<void> {
  await post(`/mensagens/${otherId}/lida`);
}
