import { useEffect, useState } from 'react';
import type { Service } from '../../types';
import { listServices, createService, updateService, inactivateService, reactivateService } from '../../services/services';
import { ApiError } from '../../services/http';
import { PlusIcon, EditIcon, ScissorsIcon } from '../../components/Icons';
import { Card, Button, Modal, Input, TextArea, Alert, StatusBadge, EmptyState } from '../../components/UI';

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editService, setEditService] = useState<Service | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Partial<Service>>({});
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState('');
  const [deactivateConfirm, setDeactivateConfirm] = useState<string | null>(null);

  useEffect(() => {
    listServices().then(setServices).finally(() => setLoading(false));
  }, []);

  const openNew = () => { setForm({ active: true, species: ['Cão'], sizes: ['Pequeno', 'Médio', 'Grande'] }); setEditService(null); setFormError(''); setShowModal(true); };
  const openEdit = (s: Service) => { setForm(s); setEditService(s); setFormError(''); setShowModal(true); };

  const save = async () => {
    if (!form.name || form.price === undefined || !form.duration) { setFormError('Preencha nome, preço e duração.'); return; }
    setSaving(true);
    setFormError('');
    try {
      if (editService) {
        const updated = await updateService(editService.id, {
          name: form.name, description: form.description, price: form.price, duration: form.duration,
          sizes: form.sizes, species: form.species,
        });
        setServices(prev => prev.map(s => s.id === updated.id ? updated : s));
        setSuccess('Serviço atualizado!');
      } else {
        const created = await createService({
          name: form.name, description: form.description, price: form.price, duration: form.duration,
          sizes: form.sizes, species: form.species,
        });
        setServices(prev => [...prev, created]);
        setSuccess('Serviço criado com sucesso!');
      }
      setShowModal(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : 'Não foi possível salvar o serviço.');
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (id: string, active: boolean) => {
    const updated = active ? await reactivateService(id) : await inactivateService(id);
    setServices(prev => prev.map(s => s.id === id ? updated : s));
    setDeactivateConfirm(null);
    setSuccess('Status do serviço atualizado.');
    setTimeout(() => setSuccess(''), 3000);
  };

  if (loading) {
    return <div className="max-w-4xl mx-auto py-16 text-center text-[#536273] text-sm">Carregando…</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#131B24]">Catálogo de serviços</h1>
          <p className="text-[#536273] mt-1">{services.length} serviços cadastrados</p>
        </div>
        <Button onClick={openNew} size="sm"><PlusIcon size={16} /> Novo serviço</Button>
      </div>

      {success && <Alert type="success" title={success} />}

      <div className="space-y-3">
        {services.map(s => (
          <Card key={s.id} className={`p-5 ${!s.active ? 'opacity-60' : ''}`}>
            <div className="flex items-start gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-semibold text-[#131B24] text-lg">{s.name}</h3>
                  <StatusBadge status={s.active ? 'ATIVO' : 'INATIVO'} />
                </div>
                <p className="text-[#536273] text-sm mb-3">{s.description}</p>
                <div className="flex flex-wrap gap-3 text-sm">
                  <span className="bg-[#DDD5CD] text-[#536273] px-2.5 py-1 rounded-full text-xs font-medium">⏱ {s.duration} min</span>
                  <span className="bg-[#DDD5CD] text-[#536273] px-2.5 py-1 rounded-full text-xs font-medium">R$ {s.price}</span>
                  {s.species.length > 0 && <span className="bg-[#DDD5CD] text-[#536273] px-2.5 py-1 rounded-full text-xs font-medium">{s.species.join(' · ')}</span>}
                  {s.sizes.length > 0 && <span className="bg-[#DDD5CD] text-[#536273] px-2.5 py-1 rounded-full text-xs font-medium">{s.sizes.join(', ')}</span>}
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => openEdit(s)}
                  className="flex items-center gap-1.5 text-xs font-medium text-[#536273] hover:text-[#223143] bg-[#DDD5CD] px-3 py-1.5 rounded-lg transition-colors"
                >
                  <EditIcon size={13} /> Editar
                </button>
                <button
                  onClick={() => s.active ? setDeactivateConfirm(s.id) : toggleActive(s.id, true)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${s.active ? 'text-[#872B35] hover:bg-[#872B35]/10' : 'text-green-700 hover:bg-green-50'}`}
                >
                  {s.active ? 'Inativar' : 'Reativar'}
                </button>
              </div>
            </div>
          </Card>
        ))}
        {services.length === 0 && (
          <EmptyState icon={<ScissorsIcon size={40} />} title="Nenhum serviço cadastrado" action={<Button onClick={openNew}><PlusIcon size={16} /> Criar serviço</Button>} />
        )}
      </div>

      {/* Edit/Create Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title={editService ? 'Editar serviço' : 'Novo serviço'} size="lg">
        <div className="space-y-4">
          {formError && <Alert type="error" title="Não foi possível salvar" message={formError} />}
          <Input label="Nome do serviço" value={form.name || ''} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
          <TextArea label="Descrição" value={form.description || ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Preço (R$)" type="number" value={String(form.price ?? '')} onChange={e => setForm(f => ({ ...f, price: parseFloat(e.target.value) }))} required />
            <Input label="Duração (min)" type="number" value={String(form.duration ?? '')} onChange={e => setForm(f => ({ ...f, duration: parseInt(e.target.value) }))} required />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#536273] mb-2">Espécies</p>
            <div className="flex gap-2">
              {['Cão', 'Gato', 'Outro'].map(sp => (
                <button
                  key={sp}
                  onClick={() => {
                    const curr = form.species || [];
                    setForm(f => ({ ...f, species: curr.includes(sp) ? curr.filter(x => x !== sp) : [...curr, sp] }));
                  }}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border-2 transition-all ${(form.species || []).includes(sp) ? 'border-[#872B35] bg-[#872B35]/10 text-[#872B35]' : 'border-[#DDD5CD] text-[#536273]'}`}
                >
                  {sp}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#536273] mb-2">Portes atendidos</p>
            <div className="flex gap-2 flex-wrap">
              {['Pequeno', 'Médio', 'Grande', 'Gigante'].map(sz => (
                <button
                  key={sz}
                  onClick={() => {
                    const curr = form.sizes || [];
                    setForm(f => ({ ...f, sizes: curr.includes(sz) ? curr.filter(x => x !== sz) : [...curr, sz] }));
                  }}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border-2 transition-all ${(form.sizes || []).includes(sz) ? 'border-[#872B35] bg-[#872B35]/10 text-[#872B35]' : 'border-[#DDD5CD] text-[#536273]'}`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="tertiary" onClick={() => setShowModal(false)} className="flex-1" disabled={saving}>Cancelar</Button>
            <Button onClick={save} className="flex-1" disabled={saving}>{saving ? 'Salvando…' : editService ? 'Salvar alterações' : 'Criar serviço'}</Button>
          </div>
        </div>
      </Modal>

      {/* Deactivate Confirm */}
      <Modal open={!!deactivateConfirm} onClose={() => setDeactivateConfirm(null)} title="Inativar serviço" size="sm">
        <div className="space-y-4">
          <Alert type="warning" title="Confirmar inativação" message="O serviço deixará de aparecer no catálogo público. Agendamentos já existentes não serão afetados." />
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => setDeactivateConfirm(null)} className="flex-1">Cancelar</Button>
            <Button variant="destructive" onClick={() => deactivateConfirm && toggleActive(deactivateConfirm, false)} className="flex-1">Inativar</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
