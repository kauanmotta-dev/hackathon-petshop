import { useEffect, useState } from 'react';
import type { Page, User, Appointment } from '../../types';
import { listMyAppointments, cancelAppointment } from '../../services/appointments';
import { ApiError } from '../../services/http';
import { CalendarIcon, ClockIcon, XIcon, RefreshIcon } from '../../components/Icons';
import { Card, Tabs, StatusBadge, Button, Modal, Alert, EmptyState } from '../../components/UI';

interface Props { user: User; onNavigate: (page: Page) => void }

export default function Appointments({ onNavigate }: Props) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('upcoming');
  const [cancelModal, setCancelModal] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [cancelDone, setCancelDone] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    listMyAppointments().then(setAppointments).finally(() => setLoading(false));
  }, []);

  const upcoming = appointments.filter(a => a.status === 'AGENDADO');
  const ongoing = appointments.filter(a => a.status === 'EM_ANDAMENTO');
  const done = appointments.filter(a => a.status === 'CONCLUIDO');
  const cancelled = appointments.filter(a => a.status === 'CANCELADO');

  const tabs = [
    { id: 'upcoming', label: 'Próximos', count: upcoming.length },
    { id: 'ongoing', label: 'Em andamento', count: ongoing.length },
    { id: 'done', label: 'Concluídos', count: done.length },
    { id: 'cancelled', label: 'Cancelados', count: cancelled.length },
  ];

  const current = tab === 'upcoming' ? upcoming : tab === 'ongoing' ? ongoing : tab === 'done' ? done : cancelled;

  const doCancel = async () => {
    if (!cancelModal) return;
    setCancelling(true);
    setError('');
    try {
      await cancelAppointment(cancelModal);
      setAppointments(a => a.map(x => x.id === cancelModal ? { ...x, status: 'CANCELADO' as const } : x));
      setCancelModal(null);
      setCancelDone(true);
      setTimeout(() => setCancelDone(false), 3000);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível cancelar o agendamento.');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return <div className="max-w-3xl mx-auto py-16 text-center text-[#536273] text-sm">Carregando…</div>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#131B24]">Meus agendamentos</h1>
          <p className="text-[#536273] mt-1">{appointments.length} agendamentos no total</p>
        </div>
        <Button onClick={() => onNavigate('client-booking')} size="sm">
          <CalendarIcon size={16} /> Novo
        </Button>
      </div>

      {cancelDone && <Alert type="success" title="Agendamento cancelado" message="Seu agendamento foi cancelado com sucesso." />}

      <Card>
        <div className="px-4 pt-4">
          <Tabs tabs={tabs} active={tab} onChange={setTab} />
        </div>
        <div className="p-4 space-y-3">
          {current.length === 0 ? (
            <EmptyState
              icon={<CalendarIcon size={40} />}
              title="Nenhum agendamento aqui"
              description={tab === 'upcoming' ? 'Sem agendamentos próximos. Que tal marcar um novo?' : undefined}
              action={tab === 'upcoming' ? <Button onClick={() => onNavigate('client-booking')} size="sm">Agendar agora</Button> : undefined}
            />
          ) : (
            current.map(a => (
              <div key={a.id} className="border border-[#DDD5CD] rounded-xl p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between gap-2 mb-3 flex-wrap">
                  <div>
                    <h3 className="font-semibold text-[#131B24]">{a.serviceName}</h3>
                    <p className="text-sm text-[#536273]">{a.petName}</p>
                  </div>
                  <StatusBadge status={a.status} />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm mb-3">
                  <div className="flex items-center gap-1.5 text-[#536273]">
                    <CalendarIcon size={13} />
                    <span>{new Date(a.date + 'T12:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#536273]">
                    <ClockIcon size={13} />
                    <span>{a.time}</span>
                  </div>
                  <div className="text-[#536273]">
                    <span className="font-medium text-[#131B24]">R$ {a.price}</span>
                  </div>
                </div>
                <p className="text-xs text-[#536273]">Banhista: {a.groomerName.split(' ')[0]}</p>
                {a.status === 'AGENDADO' && (
                  <div className="flex gap-2 mt-3 pt-3 border-t border-[#DDD5CD]">
                    <button
                      onClick={() => setCancelModal(a.id)}
                      className="flex items-center gap-1.5 text-xs font-medium text-[#872B35] hover:bg-[#872B35]/10 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <XIcon size={12} /> Cancelar
                    </button>
                  </div>
                )}
                {a.status === 'EM_ANDAMENTO' && (
                  <div className="mt-3 pt-3 border-t border-[#DDD5CD]">
                    <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                      <RefreshIcon size={12} />
                      Atendimento em progresso — aguarde a notificação de conclusão
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </Card>

      <Modal open={!!cancelModal} onClose={() => setCancelModal(null)} title="Cancelar agendamento" size="sm">
        <div className="space-y-4">
          {error && <Alert type="error" title="Não foi possível cancelar" message={error} />}
          <Alert type="warning" title="Confirmar cancelamento" message="Esta ação não pode ser desfeita. O horário ficará disponível para outros clientes." />
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => setCancelModal(null)} className="flex-1" disabled={cancelling}>Manter</Button>
            <Button variant="destructive" onClick={doCancel} className="flex-1" disabled={cancelling}>{cancelling ? 'Cancelando…' : 'Cancelar agendamento'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
