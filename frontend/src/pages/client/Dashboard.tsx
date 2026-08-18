import { useEffect, useState } from 'react';
import type { Page, User, Pet, Appointment } from '../../types';
import { listMyPets } from '../../services/pets';
import { listMyAppointments } from '../../services/appointments';
import { CalendarIcon, PawIcon, ArrowRightIcon, ClockIcon } from '../../components/Icons';
import { Card, StatCard, StatusBadge } from '../../components/UI';

interface Props { user: User; onNavigate: (page: Page) => void }

export default function ClientDashboard({ user, onNavigate }: Props) {
  const [pets, setPets] = useState<Pet[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([listMyPets(), listMyAppointments()])
      .then(([myPets, myAppointments]) => { setPets(myPets); setAppointments(myAppointments); })
      .finally(() => setLoading(false));
  }, []);

  const upcoming = appointments.filter(a => a.status === 'AGENDADO' || a.status === 'EM_ANDAMENTO');
  const next = upcoming[0];

  if (loading) {
    return <div className="max-w-4xl mx-auto py-16 text-center text-[#536273] text-sm">Carregando…</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#131B24]">
          Olá, {user.name.split(' ')[0]}! 👋
        </h1>
        <p className="text-[#536273] mt-1">Acompanhe seus pets e agendamentos em um só lugar.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <StatCard label="Meus pets" value={pets.length} icon={<PawIcon size={22} />} />
        <StatCard label="Próximos" value={upcoming.length} icon={<CalendarIcon size={22} />} />
        <StatCard label="Total agendamentos" value={appointments.length} icon={<ClockIcon size={22} />} />
      </div>

      {/* Next appointment */}
      {next ? (
        <Card className="p-6 border-l-4 border-[#872B35]">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#536273]">Próximo agendamento</p>
              <h2 className="font-display text-xl font-bold text-[#131B24] mt-0.5">{next.serviceName}</h2>
            </div>
            <StatusBadge status={next.status} />
          </div>
          <div className="grid sm:grid-cols-3 gap-3 text-sm">
            <div>
              <p className="text-xs text-[#536273]">Pet</p>
              <p className="font-medium text-[#131B24]">{next.petName}</p>
            </div>
            <div>
              <p className="text-xs text-[#536273]">Data e hora</p>
              <p className="font-medium text-[#131B24]">
                {new Date(next.date + 'T12:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} às {next.time}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#536273]">Banhista</p>
              <p className="font-medium text-[#131B24]">{next.groomerName.split(' ')[0]}</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('client-appointments')}
            className="mt-4 text-sm text-[#872B35] font-medium flex items-center gap-1 hover:gap-2 transition-all"
          >
            Ver detalhes <ArrowRightIcon size={15} />
          </button>
        </Card>
      ) : (
        <Card className="p-8 text-center">
          <CalendarIcon size={36} className="text-[#cfc6bc] mx-auto mb-3" />
          <p className="font-semibold text-[#223143]">Nenhum agendamento próximo</p>
          <p className="text-[#536273] text-sm mt-1 mb-4">Que tal agendar um banho para o seu pet?</p>
          <button
            onClick={() => onNavigate('client-booking')}
            className="bg-[#872B35] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#6e2029] transition-colors"
          >
            Agendar agora
          </button>
        </Card>
      )}

      {/* Quick actions */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Card onClick={() => onNavigate('client-pets')} className="p-5 flex items-center gap-4 group">
          <div className="w-12 h-12 bg-[#DDD5CD] rounded-xl flex items-center justify-center group-hover:bg-[#872B35] transition-colors flex-shrink-0">
            <PawIcon size={24} className="text-[#536273] group-hover:text-white transition-colors" />
          </div>
          <div>
            <p className="font-semibold text-[#131B24]">Meus pets</p>
            <p className="text-sm text-[#536273]">{pets.length} {pets.length === 1 ? 'cadastrado' : 'cadastrados'}</p>
          </div>
          <ArrowRightIcon size={18} className="text-[#536273] ml-auto" />
        </Card>
        <Card onClick={() => onNavigate('client-booking')} className="p-5 flex items-center gap-4 group bg-[#872B35] border-[#872B35]">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <CalendarIcon size={24} className="text-white" />
          </div>
          <div>
            <p className="font-semibold text-white">Novo agendamento</p>
            <p className="text-sm text-white/70">Agende um serviço</p>
          </div>
          <ArrowRightIcon size={18} className="text-white ml-auto" />
        </Card>
      </div>

      {/* Pets list */}
      {pets.length > 0 && (
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[#131B24]">Seus pets</h3>
            <button onClick={() => onNavigate('client-pets')} className="text-sm text-[#872B35] hover:underline">Ver todos</button>
          </div>
          <div className="space-y-3">
            {pets.map(pet => (
              <div key={pet.id} className="flex items-center gap-3 py-2 border-b border-[#DDD5CD] last:border-0">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                  style={{ backgroundColor: pet.color }}
                >
                  {pet.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#131B24] text-sm">{pet.name}</p>
                  <p className="text-xs text-[#536273]">{pet.species} · {pet.breed} · Porte {pet.size}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
