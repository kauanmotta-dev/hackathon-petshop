import { useEffect, useRef, useState } from 'react';
import type { User, Message } from '../../types';
import { listContacts, listConversation, sendMessage, markConversationRead, type Contact } from '../../services/messages';
import { listTeam } from '../../services/users';
import { SendIcon } from '../../components/Icons';

interface Props { user: User }

export default function Messages({ user }: Props) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [activeContact, setActiveContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const isStaff = user.role === 'ADMIN' || user.role === 'BANHISTA';
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      const existingContacts = await listContacts();
      let list = existingContacts;
      if (!isStaff) {
        // Clients always talk to the shop's staff — surface a contact even
        // before any message has been exchanged yet.
        const team = await listTeam();
        const primary = team.find(t => t.roles.includes('ADMIN')) ?? team[0];
        if (primary && !list.some(c => c.userId === primary.id)) {
          list = [{ userId: primary.id, name: primary.name, lastMessage: '', lastMessageAt: '', unread: 0 }, ...list];
        }
      }
      setContacts(list);
      setActiveContact(list[0] ?? null);
      setLoading(false);
    })();
  }, [isStaff]);

  useEffect(() => {
    if (!activeContact) { setMessages([]); return; }
    listConversation(user.id, user.name, activeContact.userId, activeContact.name).then(setMessages);
    if (activeContact.unread > 0) {
      markConversationRead(activeContact.userId).then(() => {
        setContacts(cs => cs.map(c => c.userId === activeContact.userId ? { ...c, unread: 0 } : c));
      });
    }
  }, [activeContact, user.id, user.name]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || !activeContact) return;
    const content = input.trim();
    setInput('');
    await sendMessage(activeContact.userId, content);
    const refreshed = await listConversation(user.id, user.name, activeContact.userId, activeContact.name);
    setMessages(refreshed);
  };

  if (loading) {
    return <div className="max-w-2xl mx-auto py-16 text-center text-[#536273] text-sm">Carregando…</div>;
  }

  return (
    <div className={`${isStaff ? 'max-w-5xl' : 'max-w-2xl'} mx-auto h-[calc(100vh-8rem)] flex flex-col`}>
      <div className="mb-4">
        <h1 className="font-display text-2xl font-bold text-[#131B24]">Mensagens</h1>
        <p className="text-[#536273] text-sm mt-0.5">{isStaff ? 'Converse com clientes e colegas de equipe' : 'Converse diretamente com a equipe Vitallis'}</p>
      </div>

      <div className="flex-1 bg-white rounded-xl border border-[#DDD5CD] flex overflow-hidden">
        {isStaff && (
          <div className="w-56 border-r border-[#DDD5CD] overflow-y-auto flex-shrink-0 hidden sm:block">
            {contacts.length === 0 ? (
              <p className="text-xs text-[#536273] p-4">Nenhuma conversa ainda.</p>
            ) : contacts.map(c => (
              <button
                key={c.userId}
                onClick={() => setActiveContact(c)}
                className={`w-full text-left px-4 py-3 border-b border-[#DDD5CD] transition-colors ${activeContact?.userId === c.userId ? 'bg-[#DDD5CD]/50' : 'hover:bg-[#DDD5CD]/20'}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-[#131B24] text-sm truncate">{c.name}</p>
                  {c.unread > 0 && <span className="w-2 h-2 rounded-full bg-[#872B35] flex-shrink-0" />}
                </div>
                <p className="text-xs text-[#536273] truncate mt-0.5">{c.lastMessage || 'Sem mensagens'}</p>
              </button>
            ))}
          </div>
        )}

        <div className="flex-1 flex flex-col min-w-0">
          {!activeContact ? (
            <div className="flex-1 flex items-center justify-center text-sm text-[#536273]">Nenhuma conversa disponível</div>
          ) : (
            <>
              <div className="flex items-center gap-3 p-4 border-b border-[#DDD5CD]">
                <div className="w-9 h-9 rounded-full bg-[#223143] flex items-center justify-center">
                  <span className="text-white text-sm font-bold">{activeContact.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-semibold text-[#131B24] text-sm">{activeContact.name}</p>
                </div>
              </div>

              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
                {messages.length === 0 && (
                  <p className="text-center text-xs text-[#536273] mt-8">Envie a primeira mensagem.</p>
                )}
                {messages.map(m => {
                  const isMe = m.fromId === user.id;
                  return (
                    <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs sm:max-w-sm rounded-2xl px-4 py-2.5 ${isMe ? 'bg-[#223143] text-white rounded-br-md' : 'bg-[#DDD5CD] text-[#131B24] rounded-bl-md'}`}>
                        <p className="text-sm leading-relaxed">{m.content}</p>
                        <p className={`text-xs mt-1 ${isMe ? 'text-white/50' : 'text-[#536273]'}`}>
                          {new Date(m.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-3 border-t border-[#DDD5CD]">
                <div className="flex gap-2 items-end">
                  <textarea
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
                    placeholder="Escreva uma mensagem…"
                    rows={1}
                    className="flex-1 resize-none rounded-xl border border-[#cfc6bc] px-3 py-2.5 text-sm text-[#131B24] placeholder:text-[#cfc6bc] focus:outline-none focus:ring-2 focus:ring-[#872B35] max-h-24"
                  />
                  <button
                    onClick={send}
                    disabled={!input.trim()}
                    className="w-10 h-10 bg-[#872B35] text-white rounded-xl flex items-center justify-center hover:bg-[#6e2029] transition-colors disabled:opacity-40 flex-shrink-0"
                  >
                    <SendIcon size={17} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
