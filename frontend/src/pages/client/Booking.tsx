import { useEffect, useState } from 'react';
import type { Page, User, Pet, Service } from '../../types';
import { listMyPets } from '../../services/pets';
import { listServices } from '../../services/services';
import { createAppointment } from '../../services/appointments';
import { sendMessage } from '../../services/messages';
import { listTeam } from '../../services/users';
import { ApiError } from '../../services/http';
import { CheckIcon, PawIcon, CalendarIcon, ArrowRightIcon, ArrowLeftIcon } from '../../components/Icons';
import { Card, Button, TextArea, Alert } from '../../components/UI';

interface Props { user: User; onNavigate: (page: Page) => void }

type Step = 'pet' | 'service' | 'datetime' | 'notes' | 'review' | 'success';

export default function Booking({ user, onNavigate }: Props) {
  const [step, setStep] = useState<Step>('pet');
  const [petId, setPetId] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [pets, setPets] = useState<Pet[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [staffId, setStaffId] = useState('');

  useEffect(() => {
    Promise.all([listMyPets(), listServices(), listTeam()])
      .then(([myPets, allServices, team]) => {
        setPets(myPets);
        setServices(allServices.filter(s => s.active));
        const admin = team.find(t => t.roles.includes('ADMIN')) ?? team[0];
        if (admin) setStaffId(admin.id);
      })
      .finally(() => setDataLoading(false));
  }, []);

  const selectedPet = pets.find(p => p.id === petId);
  const selectedService = services.find(s => s.id === serviceId);

  const steps: { id: Step; label: string }[] = [
    { id: 'pet', label: 'Pet' },
    { id: 'service', label: 'Serviço' },
    { id: 'datetime', label: 'Data/Hora' },
    { id: 'notes', label: 'Observações' },
    { id: 'review', label: 'Revisão' },
  ];
  const stepIndex = steps.findIndex(s => s.id === step);

  const confirm = async () => {
    setLoading(true);
    setError('');
    try {
      await createAppointment({ petId, serviceIds: [serviceId], date, time });
      if (notes.trim() && staffId) {
        await sendMessage(staffId, `Observação sobre o agendamento de ${selectedPet?.name} (${date} às ${time}): ${notes.trim()}`).catch(() => {});
      }
      setStep('success');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível confirmar o agendamento.');
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) {
    return <div className="max-w-2xl mx-auto py-16 text-center text-[#536273] text-sm">Carregando…</div>;
  }

  if (step === 'success') {
    return (
      <div className="max-w-md mx-auto py-16 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckIcon size={36} className="text-green-700" />
        </div>
        <h2 className="font-display text-2xl font-bold text-[#131B24] mb-2">Agendado com sucesso!</h2>
        <p className="text-[#536273] mb-2">
          {selectedPet?.name} está confirmado para <strong>{selectedService?.name}</strong>
        </p>
        <p className="text-[#536273] mb-8">
          {date && new Date(date + 'T12:00').toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })} às {time}
        </p>
        <Alert type="info" title="Você receberá uma notificação" message="Avisaremos assim que o atendimento for iniciado e quando seu pet estiver pronto." />
        <div className="flex gap-3 mt-6">
          <Button variant="tertiary" onClick={() => onNavigate('client-appointments')} className="flex-1">Ver agendamentos</Button>
          <Button onClick={() => { setStep('pet'); setPetId(''); setServiceId(''); setDate(''); setTime(''); setNotes(''); }} className="flex-1">Novo agendamento</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#131B24]">Novo agendamento</h1>
        <p className="text-[#536273] mt-1">Siga os passos para agendar o serviço do seu pet.</p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-0">
        {steps.map((s, i) => (
          <div key={s.id} className="flex items-center flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors ${i < stepIndex ? 'bg-[#872B35] text-white' : i === stepIndex ? 'bg-[#223143] text-white' : 'bg-[#DDD5CD] text-[#536273]'}`}>
              {i < stepIndex ? <CheckIcon size={14} /> : i + 1}
            </div>
            <span className={`hidden sm:block text-xs ml-1.5 font-medium ${i === stepIndex ? 'text-[#223143]' : 'text-[#536273]'}`}>{s.label}</span>
            {i < steps.length - 1 && (
              <div className={`h-px flex-1 mx-2 ${i < stepIndex ? 'bg-[#872B35]' : 'bg-[#cfc6bc]'}`} />
            )}
          </div>
        ))}
      </div>

      <Card className="p-6">
        {error && <div className="mb-4"><Alert type="error" title="Não foi possível continuar" message={error} /></div>}

        {step === 'pet' && (
          <div className="space-y-4">
            <h2 className="font-semibold text-[#131B24] text-lg flex items-center gap-2"><PawIcon size={20} /> Selecione o pet</h2>
            {pets.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-[#536273] mb-4">Você não tem pets cadastrados.</p>
                <Button onClick={() => onNavigate('client-pets')} variant="secondary">Cadastrar pet</Button>
              </div>
            ) : (
              <div className="space-y-3">
                {pets.map(pet => (
                  <button
                    key={pet.id}
                    onClick={() => setPetId(pet.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${petId === pet.id ? 'border-[#872B35] bg-[#872B35]/5' : 'border-[#DDD5CD] hover:border-[#536273]'}`}
                  >
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0" style={{ backgroundColor: pet.color }}>
                      {pet.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-[#131B24]">{pet.name}</p>
                      <p className="text-sm text-[#536273]">{pet.species} · {pet.breed || 'Raça não informada'} · Porte {pet.size}</p>
                      {pet.conditions && <p className="text-xs text-amber-700 mt-0.5">⚠ {pet.conditions}</p>}
                    </div>
                    {petId === pet.id && <CheckIcon size={20} className="text-[#872B35] ml-auto" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 'service' && (
          <div className="space-y-4">
            <h2 className="font-semibold text-[#131B24] text-lg">Selecione o serviço</h2>
            <div className="space-y-3">
              {services.map(s => (
                <button
                  key={s.id}
                  onClick={() => setServiceId(s.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left ${serviceId === s.id ? 'border-[#872B35] bg-[#872B35]/5' : 'border-[#DDD5CD] hover:border-[#536273]'}`}
                >
                  <div>
                    <p className="font-semibold text-[#131B24]">{s.name}</p>
                    <p className="text-sm text-[#536273]">{s.description}</p>
                    <p className="text-xs text-[#536273] mt-1">⏱ {s.duration} min</p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <p className="font-bold text-[#872B35] text-lg">R$ {s.price}</p>
                    {serviceId === s.id && <CheckIcon size={18} className="text-[#872B35] ml-auto" />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'datetime' && (
          <div className="space-y-5">
            <h2 className="font-semibold text-[#131B24] text-lg flex items-center gap-2"><CalendarIcon size={20} /> Escolha a data e horário</h2>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-[#536273] block mb-2">Data</label>
              <input
                type="date"
                value={date}
                min={new Date().toISOString().split('T')[0]}
                onChange={e => { setDate(e.target.value); setTime(''); }}
                className="w-full rounded-xl border border-[#cfc6bc] bg-white text-[#131B24] text-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#872B35]"
              />
            </div>
            {date && (
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-[#536273] block mb-2">Horário</label>
                <input
                  type="time"
                  value={time}
                  onChange={e => setTime(e.target.value)}
                  className="w-full rounded-xl border border-[#cfc6bc] bg-white text-[#131B24] text-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#872B35]"
                />
                <p className="text-xs text-[#536273] mt-2">
                  Se o horário já estiver ocupado, você verá um aviso ao confirmar e poderá escolher outro.
                </p>
              </div>
            )}
          </div>
        )}

        {step === 'notes' && (
          <div className="space-y-4">
            <h2 className="font-semibold text-[#131B24] text-lg">Observações</h2>
            <TextArea
              label="Observações e preferências"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Ex: Preferência por shampoo neutro, cor de corte, temperamento..."
              rows={5}
            />
            <p className="text-xs text-[#536273]">Suas observações serão enviadas por mensagem para a equipe.</p>
            {selectedPet?.conditions && (
              <Alert type="warning" title="Condição especial registrada" message={selectedPet.conditions} />
            )}
          </div>
        )}

        {step === 'review' && (
          <div className="space-y-4">
            <h2 className="font-semibold text-[#131B24] text-lg">Revisão do agendamento</h2>
            <div className="space-y-3">
              {[
                { label: 'Pet', value: `${selectedPet?.name} — ${selectedPet?.species} · ${selectedPet?.breed || 'Raça não informada'}` },
                { label: 'Serviço', value: selectedService?.name || '' },
                { label: 'Data', value: date ? new Date(date + 'T12:00').toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }) : '' },
                { label: 'Horário', value: time },
                { label: 'Duração estimada', value: `${selectedService?.duration} minutos` },
                { label: 'Valor', value: `R$ ${selectedService?.price}` },
              ].map(r => (
                <div key={r.label} className="flex justify-between py-2.5 border-b border-[#DDD5CD] last:border-0">
                  <span className="text-sm text-[#536273]">{r.label}</span>
                  <span className="text-sm font-medium text-[#131B24] text-right ml-4">{r.value}</span>
                </div>
              ))}
              {notes && (
                <div className="py-2.5">
                  <p className="text-sm text-[#536273] mb-1">Observações</p>
                  <p className="text-sm text-[#131B24]">{notes}</p>
                </div>
              )}
            </div>
            <div className="bg-[#DDD5CD]/50 rounded-xl p-4 text-sm text-[#536273]">
              ℹ Você receberá uma notificação quando o atendimento iniciar e quando seu pet estiver pronto.
            </div>
          </div>
        )}

        <div className="flex gap-3 mt-6 pt-4 border-t border-[#DDD5CD]">
          {stepIndex > 0 && (
            <Button variant="tertiary" onClick={() => setStep(steps[stepIndex - 1].id)} className="flex-1" disabled={loading}>
              <ArrowLeftIcon size={16} /> Voltar
            </Button>
          )}
          <Button
            onClick={() => {
              if (step === 'review') { confirm(); return; }
              const valid = (step === 'pet' && petId) || (step === 'service' && serviceId) || (step === 'datetime' && date && time) || step === 'notes';
              if (valid) setStep(steps[stepIndex + 1].id);
            }}
            disabled={(step === 'pet' && !petId) || (step === 'service' && !serviceId) || (step === 'datetime' && (!date || !time)) || loading}
            className="flex-1"
          >
            {step === 'review' ? (loading ? 'Confirmando…' : 'Confirmar agendamento') : <><span>Continuar</span> <ArrowRightIcon size={16} /></>}
          </Button>
        </div>
      </Card>
    </div>
  );
}
