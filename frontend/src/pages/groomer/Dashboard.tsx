import { useEffect, useState } from 'react';
import type { Page, User, Appointment } from '../../types';
import { listGroomerAppointments, startAppointment, finishAppointment } from '../../services/appointments';
import { CalendarIcon, ClockIcon, CheckIcon, RefreshIcon } from '../../components/Icons';
import { Card, StatCard, StatusBadge, Tabs, EmptyState } from '../../components/UI';

interface Props { user: User; onNavigate: (page: Page) => void; onSelectAppointment: (id: string) => void }

const WEEK = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

export default function GroomerDashboard({ onSelectAppointment }: Props) {
  const today = todayStr();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('today');
  const [selectedDay, setSelectedDay] = useState(today);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const refresh = () => listGroomerAppointments().then(setAppointments).finally(() => setLoading(false));
  useEffect(() => { refresh(); }, []);

  const todayAppts = appointments.filter(a => a.date === today);
  const waiting = todayAppts.filter(a => a.status === 'AGENDADO').length;
  const ongoing = todayAppts.filter(a => a.status === 'EM_ANDAMENTO').length;
  const done = todayAppts.filter(a => a.status === 'CONCLUIDO').length;

  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    const str = d.toISOString().split('T')[0];
    const count = appointments.filter(a => a.date === str).length;
    return { day: WEEK[d.getDay()], date: d.getDate(), str, count };
  });

  const displayed = tab === 'today' ? todayAppts : appointments.filter(a => a.date === selectedDay);

  const updateStatus = async (id: string, action: 'start' | 'finish') => {
    setUpdatingId(id);
    try {
      await (action === 'start' ? startAppointment(id) : finishAppointment(id));
      await refresh();
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return <div className="max-w-4xl mx-auto py-16 text-center text-[#536273] text-sm">Carregando…</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#131B24]">Minha agenda</h1>
        <p className="text-[#536273] mt-1">{new Date(today + 'T12:00').toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Aguardando" value={waiting} icon={<ClockIcon size={22} />} />
        <StatCard label="Em andamento" value={ongoing} icon={<RefreshIcon size={22} />} accent="text-amber-700" />
        <StatCard label="Concluídos" value={done} icon={<CheckIcon size={22} />} accent="text-green-700" />
      </div>

      {/* Week view */}
      <Card className="p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#536273] mb-3">Esta semana</p>
        <div className="grid grid-cols-7 gap-1">
          {weekDays.map(d => (
            <button
              key={d.str}
              onClick={() => { setSelectedDay(d.str); setTab('week'); }}
              className={`flex flex-col items-center py-2 rounded-xl transition-all ${d.str === (tab === 'today' ? today : selectedDay) ? 'bg-[#223143] text-white' : 'hover:bg-[#DDD5CD] text-[#536273]'}`}
            >
              <span className="text-xs font-medium">{d.day}</span>
              <span className={`text-lg font-bold mt-0.5 ${d.str === today ? 'text-[#872B35]' : ''}`}>{d.date}</span>
              {d.count > 0 && (
                <span className={`w-1.5 h-1.5 rounded-full mt-1 ${d.str === (tab === 'today' ? today : selectedDay) ? 'bg-white' : 'bg-[#872B35]'}`} />
              )}
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <div className="px-4 pt-4">
          <Tabs
            tabs={[{ id: 'today', label: 'Hoje' }, { id: 'week', label: 'Dia selecionado' }]}
            active={tab}
            onChange={setTab}
          />
        </div>
        <div className="p-4 space-y-3">
          {displayed.length === 0 ? (
            <EmptyState icon={<CalendarIcon size={40} />} title="Nenhum atendimento" description="Sem agendamentos para este dia." />
          ) : (
            displayed.map(a => (
              <div
                key={a.id}
                className="flex items-start gap-4 p-4 rounded-xl border border-[#DDD5CD] hover:border-[#536273] transition-all cursor-pointer"
                onClick={() => onSelectAppointment(a.id)}
              >
                <div className="text-center flex-shrink-0">
                  <p className="text-xl font-bold text-[#872B35] font-display">{a.time}</p>
                  <p className="text-xs text-[#536273]">início</p>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap mb-1">
                    <h3 className="font-semibold text-[#131B24]">{a.petName}</h3>
                    <StatusBadge status={a.status} />
                  </div>
                  <p className="text-sm text-[#536273]">{a.serviceName}</p>
                  <p className="text-xs text-[#536273] mt-0.5">Tutor: {a.clientName.split(' ')[0]}</p>
                </div>
                <div className="flex flex-col gap-1 flex-shrink-0">
                  {a.status === 'AGENDADO' && (
                    <button
                      onClick={e => { e.stopPropagation(); updateStatus(a.id, 'start'); }}
                      disabled={updatingId === a.id}
                      className="text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200 px-3 py-1.5 rounded-lg hover:bg-amber-200 transition-colors disabled:opacity-50"
                    >
                      ▶ Iniciar
                    </button>
                  )}
                  {a.status === 'EM_ANDAMENTO' && (
                    <button
                      onClick={e => { e.stopPropagation(); updateStatus(a.id, 'finish'); }}
                      disabled={updatingId === a.id}
                      className="text-xs font-semibold bg-green-100 text-green-800 border border-green-200 px-3 py-1.5 rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50"
                    >
                      ✓ Finalizar
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
