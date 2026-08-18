import { useEffect, useState } from 'react';
import type { Page, Appointment } from '../../types';
import { getAppointment, startAppointment, finishAppointment } from '../../services/appointments';
import { getProntuario, updateProntuario, registerProntuario, type Prontuario } from '../../services/pets';
import { ApiError } from '../../services/http';
import { ArrowLeftIcon, CheckIcon, RefreshIcon, FileTextIcon } from '../../components/Icons';
import { Card, StatusBadge, Button, TextArea, Alert } from '../../components/UI';

interface Props { appointmentId: string; onNavigate: (page: Page) => void }

export default function AppointmentDetail({ appointmentId, onNavigate }: Props) {
  const [apt, setApt] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [prontuario, setProntuario] = useState<Prontuario | null>(null);
  const [historico, setHistorico] = useState('');
  const [finished, setFinished] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getAppointment(appointmentId)
      .then(a => { setApt(a); return getProntuario(a.petId); })
      .then(p => { setProntuario(p); setHistorico(p?.historico ?? ''); })
      .finally(() => setLoading(false));
  }, [appointmentId]);

  if (loading) {
    return <div className="max-w-2xl mx-auto py-16 text-center text-[#536273] text-sm">Carregando…</div>;
  }

  if (!apt) return (
    <div className="max-w-2xl mx-auto text-center py-20">
      <p className="text-[#536273]">Agendamento não encontrado.</p>
      <Button onClick={() => onNavigate('groomer-dashboard')} variant="tertiary" className="mt-4">Voltar</Button>
    </div>
  );

  const start = async () => {
    setBusy(true);
    setError('');
    try {
      const updated = await startAppointment(apt.id);
      setApt(updated);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível iniciar o atendimento.');
    } finally {
      setBusy(false);
    }
  };

  const finish = async () => {
    setBusy(true);
    setError('');
    try {
      const saved = prontuario
        ? await updateProntuario(apt.petId, { historico })
        : await registerProntuario(apt.petId, { historico });
      setProntuario(saved);
      const updated = await finishAppointment(apt.id);
      setApt(updated);
      setFinished(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível finalizar o atendimento.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={() => onNavigate('groomer-dashboard')} className="p-2 rounded-xl hover:bg-[#DDD5CD] text-[#536273] transition-colors">
          <ArrowLeftIcon size={20} />
        </button>
        <div>
          <h1 className="font-display text-xl font-bold text-[#131B24]">Detalhe do atendimento</h1>
          <p className="text-[#536273] text-sm">#{apt.id}</p>
        </div>
      </div>

      {error && <Alert type="error" title="Algo deu errado" message={error} />}
      {finished && (
        <Alert type="success" title="Atendimento finalizado!" message={`Notificação enviada para ${apt.clientName.split(' ')[0]}. O pet está pronto!`} />
      )}

      {/* Pet info */}
      <Card className="p-5">
        <div className="flex items-center gap-4 mb-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl flex-shrink-0 shadow"
            style={{ backgroundColor: '#536273' }}
          >
            {apt.petName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h2 className="font-bold text-[#131B24] text-xl">{apt.petName}</h2>
              <StatusBadge status={apt.status} />
            </div>
            <p className="text-xs text-[#536273] mt-0.5">Tutor: {apt.clientName}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
          {[
            { l: 'Serviço', v: apt.serviceName },
            { l: 'Data', v: new Date(apt.date + 'T12:00').toLocaleDateString('pt-BR') },
            { l: 'Horário', v: apt.time },
          ].map(r => (
            <div key={r.l}>
              <p className="text-xs text-[#536273]">{r.l}</p>
              <p className="font-medium text-[#131B24]">{r.v}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Actions */}
      <Card className="p-5">
        <h3 className="font-semibold text-[#131B24] mb-4">Status do atendimento</h3>
        <div className="flex items-center gap-3 mb-5">
          {['AGENDADO', 'EM_ANDAMENTO', 'CONCLUIDO'].map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${apt.status === s || (i === 0 && apt.status !== 'AGENDADO') || (i === 1 && apt.status === 'CONCLUIDO') ? 'bg-[#872B35] text-white' : apt.status === s ? 'bg-[#223143] text-white' : 'bg-[#DDD5CD] text-[#536273]'}`}>
                {(i === 0 && apt.status !== 'AGENDADO') || (i === 1 && apt.status === 'CONCLUIDO') ? <CheckIcon size={14} /> : i + 1}
              </div>
              {i < 2 && <div className={`h-px flex-1 ${apt.status !== 'AGENDADO' && i === 0 ? 'bg-[#872B35]' : apt.status === 'CONCLUIDO' && i === 1 ? 'bg-[#872B35]' : 'bg-[#DDD5CD]'}`} />}
            </div>
          ))}
        </div>

        {apt.status === 'AGENDADO' && (
          <Button onClick={start} size="lg" className="w-full" disabled={busy}>
            <RefreshIcon size={18} /> {busy ? 'Iniciando…' : 'Iniciar atendimento'}
          </Button>
        )}
        {apt.status === 'EM_ANDAMENTO' && (
          <div className="space-y-3">
            <TextArea
              label="Anotações do atendimento (prontuário)"
              value={historico}
              onChange={e => setHistorico(e.target.value)}
              placeholder="Observações sobre o pet, comportamento, condições do pelo..."
              rows={3}
            />
            <Button onClick={finish} size="lg" className="w-full bg-green-700 hover:bg-green-800" disabled={busy}>
              <CheckIcon size={18} /> {busy ? 'Finalizando…' : 'Finalizar e notificar tutor'}
            </Button>
          </div>
        )}
        {apt.status === 'CONCLUIDO' && (
          <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
            <CheckIcon size={20} className="text-green-700" />
            <div>
              <p className="font-semibold text-green-800 text-sm">Atendimento finalizado</p>
              <p className="text-xs text-green-700">Notificação enviada ao tutor</p>
            </div>
          </div>
        )}
      </Card>

      {/* Medical record */}
      {prontuario && (
        <Card className="p-5">
          <h3 className="font-semibold text-[#131B24] mb-3 flex items-center gap-2">
            <FileTextIcon size={18} className="text-[#536273]" /> Prontuário de {apt.petName}
          </h3>
          <div className="border border-[#DDD5CD] rounded-xl p-3 space-y-2">
            <div>
              <p className="text-xs text-[#536273] mb-1">Histórico</p>
              <p className="text-sm text-[#131B24] whitespace-pre-wrap">{prontuario.historico || 'Sem registros.'}</p>
            </div>
            <div>
              <p className="text-xs text-[#536273] mb-1">Vacinas</p>
              <p className="text-sm text-[#131B24] whitespace-pre-wrap">{prontuario.vacinas || 'Sem registros.'}</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
