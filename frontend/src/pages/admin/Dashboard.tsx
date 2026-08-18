import { useEffect, useState } from 'react';
import type { Page, User, Appointment, StockItem } from '../../types';
import { getStockStatus } from '../../data/mock';
import { listAllAppointments } from '../../services/appointments';
import { listItems } from '../../services/stock';
import { listUsers } from '../../services/users';
import { CalendarIcon, PackageIcon, UsersIcon, AlertIcon, ArrowRightIcon, CheckIcon, RefreshIcon } from '../../components/Icons';
import { Card, StatCard, StatusBadge } from '../../components/UI';

interface Props { user: User; onNavigate: (page: Page) => void }

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

export default function AdminDashboard({ onNavigate }: Props) {
  const today = todayStr();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [activeUserCount, setActiveUserCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([listAllAppointments(), listItems(), listUsers()])
      .then(([allAppointments, items, users]) => {
        setAppointments(allAppointments);
        setStockItems(items);
        setActiveUserCount(users.filter(u => u.active).length);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="max-w-5xl mx-auto py-16 text-center text-[#536273] text-sm">Carregando…</div>;
  }

  const todayAppts = appointments.filter(a => a.date === today);
  const criticalItems = stockItems.filter(i => {
    const s = getStockStatus(i);
    return s === 'critico' || s === 'sem_estoque';
  });

  const upcoming = todayAppts.filter(a => a.status === 'AGENDADO').length;
  const ongoing = todayAppts.filter(a => a.status === 'EM_ANDAMENTO').length;
  const done = todayAppts.filter(a => a.status === 'CONCLUIDO').length;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#131B24]">Dashboard</h1>
        <p className="text-[#536273] mt-1">
          {new Date(today + 'T12:00').toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Critical alert */}
      {criticalItems.length > 0 && (
        <button
          onClick={() => onNavigate('admin-stock')}
          className="w-full flex items-center justify-between gap-3 bg-[#872B35] text-white px-5 py-4 rounded-xl hover:bg-[#6e2029] transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <AlertIcon size={22} />
            <div>
              <p className="font-semibold">Alerta de estoque crítico</p>
              <p className="text-sm text-white/80">{criticalItems.length} {criticalItems.length === 1 ? 'item requer' : 'itens requerem'} atenção imediata</p>
            </div>
          </div>
          <ArrowRightIcon size={20} />
        </button>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Atendimentos hoje" value={todayAppts.length} icon={<CalendarIcon size={22} />} sub={`${upcoming} aguardando`} />
        <StatCard label="Em andamento" value={ongoing} icon={<RefreshIcon size={22} />} accent="text-amber-700" />
        <StatCard label="Concluídos hoje" value={done} icon={<CheckIcon size={22} />} accent="text-green-700" />
        <StatCard label="Itens críticos" value={criticalItems.length} icon={<AlertIcon size={22} />} accent={criticalItems.length > 0 ? 'text-[#872B35]' : 'text-[#131B24]'} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Today's appointments */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[#131B24]">Agenda de hoje</h3>
            <button onClick={() => onNavigate('admin-appointments')} className="text-sm text-[#872B35] hover:underline">Ver tudo</button>
          </div>
          {todayAppts.length === 0 ? (
            <p className="text-sm text-[#536273] text-center py-6">Sem agendamentos hoje.</p>
          ) : (
            <div className="space-y-2">
              {todayAppts.map(a => (
                <div key={a.id} className="flex items-center justify-between py-2.5 border-b border-[#DDD5CD] last:border-0">
                  <div>
                    <p className="font-medium text-[#131B24] text-sm">{a.time} — {a.petName}</p>
                    <p className="text-xs text-[#536273]">{a.serviceName} · {a.groomerName.split(' ')[0]}</p>
                  </div>
                  <StatusBadge status={a.status} />
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Stock alerts */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[#131B24]">Estoque crítico</h3>
            <button onClick={() => onNavigate('admin-stock')} className="text-sm text-[#872B35] hover:underline">Gerenciar</button>
          </div>
          {criticalItems.length === 0 ? (
            <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
              <CheckIcon size={18} className="text-green-700" />
              <p className="text-sm text-green-800">Todos os itens com estoque adequado</p>
            </div>
          ) : (
            <div className="space-y-2">
              {criticalItems.map(i => {
                const s = getStockStatus(i);
                return (
                  <div key={i.id} className="flex items-center justify-between py-2.5 border-b border-[#DDD5CD] last:border-0">
                    <div>
                      <p className="font-medium text-[#131B24] text-sm">{i.name}</p>
                      <p className="text-xs text-[#536273]">{i.locationName}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${s === 'sem_estoque' ? 'text-[#536273]' : 'text-[#872B35]'}`}>
                        {i.quantity} {i.unit}
                      </p>
                      <StatusBadge status={s} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      {/* Quick access */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { icon: <PackageIcon size={24} />, label: 'Gerenciar estoque', sub: `${stockItems.length} itens`, page: 'admin-stock' as Page, color: 'bg-[#223143]' },
          { icon: <UsersIcon size={24} />, label: 'Usuários', sub: `${activeUserCount} ativos`, page: 'admin-users' as Page, color: 'bg-[#536273]' },
          { icon: <CalendarIcon size={24} />, label: 'Catálogo de serviços', sub: 'CRUD completo', page: 'admin-services' as Page, color: 'bg-[#872B35]' },
        ].map(q => (
          <Card key={q.label} onClick={() => onNavigate(q.page)} className="p-5 flex items-center gap-4 group">
            <div className={`w-12 h-12 ${q.color} rounded-xl flex items-center justify-center text-white flex-shrink-0`}>
              {q.icon}
            </div>
            <div>
              <p className="font-semibold text-[#131B24] text-sm">{q.label}</p>
              <p className="text-xs text-[#536273]">{q.sub}</p>
            </div>
            <ArrowRightIcon size={18} className="text-[#536273] ml-auto" />
          </Card>
        ))}
      </div>
    </div>
  );
}
