import { useEffect, useState } from 'react';
import type { Appointment } from '../../types';
import { listAllAppointments } from '../../services/appointments';
import { SearchIcon, CalendarIcon } from '../../components/Icons';
import { Card, Tabs, StatusBadge, EmptyState } from '../../components/UI';

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('all');

  useEffect(() => {
    listAllAppointments().then(setAppointments).finally(() => setLoading(false));
  }, []);

  const filtered = appointments.filter(a => {
    const matchSearch = !search || a.clientName.toLowerCase().includes(search.toLowerCase()) || a.petName.toLowerCase().includes(search.toLowerCase()) || a.serviceName.toLowerCase().includes(search.toLowerCase());
    const matchTab = tab === 'all' || a.status === tab;
    return matchSearch && matchTab;
  });

  const tabs = [
    { id: 'all', label: 'Todos', count: appointments.length },
    { id: 'AGENDADO', label: 'Agendados', count: appointments.filter(a => a.status === 'AGENDADO').length },
    { id: 'EM_ANDAMENTO', label: 'Em andamento', count: appointments.filter(a => a.status === 'EM_ANDAMENTO').length },
    { id: 'CONCLUIDO', label: 'Concluídos', count: appointments.filter(a => a.status === 'CONCLUIDO').length },
    { id: 'CANCELADO', label: 'Cancelados', count: appointments.filter(a => a.status === 'CANCELADO').length },
  ];

  if (loading) {
    return <div className="max-w-5xl mx-auto py-16 text-center text-[#536273] text-sm">Carregando…</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#131B24]">Agendamentos</h1>
        <p className="text-[#536273] mt-1">Visão geral de todos os agendamentos do pet shop</p>
      </div>

      <Card className="p-4">
        <div className="relative">
          <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#536273]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por cliente, pet ou serviço…"
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#cfc6bc] text-sm focus:outline-none focus:ring-2 focus:ring-[#872B35] bg-white"
          />
        </div>
      </Card>

      <Card>
        <div className="px-4 pt-4">
          <Tabs tabs={tabs} active={tab} onChange={setTab} />
        </div>
        {filtered.length === 0 ? (
          <EmptyState icon={<CalendarIcon size={40} />} title="Nenhum agendamento encontrado" />
        ) : (
          <>
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#DDD5CD]">
                    {['Data/Hora', 'Cliente', 'Pet', 'Serviço', 'Banhista', 'Valor', 'Status'].map(h => (
                      <th key={h} className="text-left text-xs font-semibold uppercase tracking-wide text-[#536273] px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(a => (
                    <tr key={a.id} className="border-b border-[#DDD5CD] last:border-0 hover:bg-[#DDD5CD]/20 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-[#131B24]">{new Date(a.date + 'T12:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</p>
                        <p className="text-xs text-[#536273]">{a.time}</p>
                      </td>
                      <td className="px-4 py-3 text-[#131B24]">{a.clientName.split(' ').slice(0, 2).join(' ')}</td>
                      <td className="px-4 py-3 text-[#131B24]">{a.petName}</td>
                      <td className="px-4 py-3 text-[#536273]">{a.serviceName}</td>
                      <td className="px-4 py-3 text-[#536273]">{a.groomerName.split(' ')[0]}</td>
                      <td className="px-4 py-3 font-medium text-[#131B24]">R$ {a.price}</td>
                      <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="sm:hidden p-4 space-y-3">
              {filtered.map(a => (
                <div key={a.id} className="border border-[#DDD5CD] rounded-xl p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-[#131B24]">{a.petName} — {a.serviceName}</p>
                      <p className="text-sm text-[#536273]">{a.clientName.split(' ')[0]}</p>
                    </div>
                    <StatusBadge status={a.status} />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#536273]">{new Date(a.date + 'T12:00').toLocaleDateString('pt-BR')} · {a.time}</span>
                    <span className="font-medium text-[#131B24]">R$ {a.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
