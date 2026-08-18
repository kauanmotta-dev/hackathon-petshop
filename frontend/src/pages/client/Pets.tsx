import { useEffect, useState } from 'react';
import type { Page, User, Pet } from '../../types';
import { listMyPets, createPet, updatePet, getProntuario, type Prontuario } from '../../services/pets';
import { ApiError } from '../../services/http';
import { PawIcon, PlusIcon, EditIcon, FileTextIcon } from '../../components/Icons';
import { Card, Button, Input, Select, TextArea, Modal, EmptyState, Alert } from '../../components/UI';

interface Props { user: User; onNavigate: (page: Page) => void }

const PET_COLORS = ['#C8860A', '#888888', '#F0D080', '#D4A870', '#872B35', '#536273', '#223143'];

export default function Pets({ user }: Props) {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [showRecords, setShowRecords] = useState<Pet | null>(null);
  const [prontuario, setProntuario] = useState<Prontuario | null | undefined>(undefined);
  const [editPet, setEditPet] = useState<Pet | null>(null);
  const [form, setForm] = useState<Partial<Pet>>({});

  useEffect(() => {
    listMyPets().then(setPets).finally(() => setLoading(false));
  }, []);

  const openAdd = () => { setForm({ ownerId: user.id, color: PET_COLORS[0] }); setEditPet(null); setError(''); setShowAdd(true); };
  const openEdit = (pet: Pet) => { setForm(pet); setEditPet(pet); setError(''); setShowAdd(true); };

  const openRecords = (pet: Pet) => {
    setShowRecords(pet);
    setProntuario(undefined);
    getProntuario(pet.id).then(setProntuario);
  };

  const handleSave = async () => {
    if (!form.name || !form.species || !form.size) return;
    setSaving(true);
    setError('');
    try {
      if (editPet) {
        const updated = await updatePet(editPet.id, {
          name: form.name, species: form.species, breed: form.breed, size: form.size,
          birthDate: form.birthDate, notes: form.notes, conditions: form.conditions, color: form.color,
        });
        setPets(p => p.map(x => x.id === updated.id ? updated : x));
      } else {
        const created = await createPet({
          name: form.name, species: form.species, breed: form.breed, size: form.size,
          birthDate: form.birthDate, notes: form.notes, conditions: form.conditions, color: form.color || PET_COLORS[0],
        });
        setPets(p => [...p, created]);
      }
      setShowAdd(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível salvar o pet.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="max-w-3xl mx-auto py-16 text-center text-[#536273] text-sm">Carregando…</div>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#131B24]">Meus pets</h1>
          <p className="text-[#536273] mt-1">{pets.length} {pets.length === 1 ? 'pet cadastrado' : 'pets cadastrados'}</p>
        </div>
        <Button onClick={openAdd} size="sm">
          <PlusIcon size={16} /> Adicionar pet
        </Button>
      </div>

      {pets.length === 0 ? (
        <EmptyState
          icon={<PawIcon size={48} />}
          title="Nenhum pet cadastrado"
          description="Adicione seus pets para começar a agendar serviços."
          action={<Button onClick={openAdd}><PlusIcon size={16} /> Adicionar primeiro pet</Button>}
        />
      ) : (
        <div className="space-y-4">
          {pets.map(pet => (
            <Card key={pet.id} className="p-5">
              <div className="flex items-start gap-4">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-sm"
                  style={{ backgroundColor: pet.color }}
                >
                  {pet.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <h3 className="font-bold text-[#131B24] text-lg">{pet.name}</h3>
                      <p className="text-[#536273] text-sm">{pet.species} · {pet.breed || 'Raça não informada'} · Porte {pet.size}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openRecords(pet)}
                        className="flex items-center gap-1.5 text-xs font-medium text-[#536273] hover:text-[#223143] bg-[#DDD5CD] px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <FileTextIcon size={13} /> Prontuário
                      </button>
                      <button
                        onClick={() => openEdit(pet)}
                        className="flex items-center gap-1.5 text-xs font-medium text-[#536273] hover:text-[#223143] bg-[#DDD5CD] px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <EditIcon size={13} /> Editar
                      </button>
                    </div>
                  </div>
                  {pet.birthDate && (
                    <p className="text-xs text-[#536273] mt-2">
                      Nascimento: {new Date(pet.birthDate + 'T12:00').toLocaleDateString('pt-BR')}
                    </p>
                  )}
                  {pet.notes && (
                    <p className="text-xs text-[#536273] mt-1 bg-[#DDD5CD]/50 rounded-lg px-3 py-2 mt-2">
                      📝 {pet.notes}
                    </p>
                  )}
                  {pet.conditions && (
                    <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mt-2">
                      ⚠ Condição especial: {pet.conditions}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Pet Modal */}
      <Modal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        title={editPet ? `Editar ${editPet.name}` : 'Adicionar pet'}
      >
        <div className="space-y-4">
          {error && <Alert type="error" title="Não foi possível salvar" message={error} />}
          <Input label="Nome do pet" value={form.name || ''} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Ex: Thor" required />
          <div className="grid grid-cols-2 gap-4">
            <Select label="Espécie" value={form.species || ''} onChange={e => setForm(f => ({ ...f, species: e.target.value as Pet['species'] }))} required>
              <option value="">Selecione</option>
              <option>Cão</option>
              <option>Gato</option>
              <option>Outro</option>
            </Select>
            <Select label="Porte" value={form.size || ''} onChange={e => setForm(f => ({ ...f, size: e.target.value as Pet['size'] }))} required>
              <option value="">Selecione</option>
              <option>Pequeno</option>
              <option>Médio</option>
              <option>Grande</option>
              <option>Gigante</option>
            </Select>
          </div>
          <Input label="Raça" value={form.breed || ''} onChange={e => setForm(f => ({ ...f, breed: e.target.value }))} placeholder="Ex: Golden Retriever" />
          <Input label="Data de nascimento" type="date" value={form.birthDate || ''} onChange={e => setForm(f => ({ ...f, birthDate: e.target.value }))} />
          <TextArea label="Observações" value={form.notes || ''} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Comportamento, preferências…" />
          <TextArea label="Condições especiais" value={form.conditions || ''} onChange={e => setForm(f => ({ ...f, conditions: e.target.value }))} placeholder="Alergias, restrições, cuidados específicos…" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#536273] mb-2">Cor do avatar</p>
            <div className="flex gap-2 flex-wrap">
              {PET_COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => setForm(f => ({ ...f, color: c }))}
                  className={`w-8 h-8 rounded-full transition-all ${form.color === c ? 'ring-2 ring-offset-2 ring-[#131B24] scale-110' : ''}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="tertiary" onClick={() => setShowAdd(false)} className="flex-1" disabled={saving}>Cancelar</Button>
            <Button onClick={handleSave} className="flex-1" disabled={saving}>{saving ? 'Salvando…' : 'Salvar pet'}</Button>
          </div>
        </div>
      </Modal>

      {/* Medical Records Modal */}
      <Modal open={!!showRecords} onClose={() => setShowRecords(null)} title={`Prontuário — ${showRecords?.name}`} size="lg">
        {prontuario === undefined ? (
          <p className="text-sm text-[#536273] text-center py-8">Carregando…</p>
        ) : prontuario === null ? (
          <EmptyState icon={<FileTextIcon size={36} />} title="Sem registros ainda" description="O prontuário será preenchido pela equipe após o primeiro atendimento." />
        ) : (
          <div className="space-y-4">
            <div className="border border-[#DDD5CD] rounded-xl p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#536273] mb-1.5">Histórico</p>
              <p className="text-sm text-[#131B24] leading-relaxed whitespace-pre-wrap">{prontuario.historico || 'Nenhum registro ainda.'}</p>
            </div>
            <div className="border border-[#DDD5CD] rounded-xl p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#536273] mb-1.5">Vacinas</p>
              <p className="text-sm text-[#131B24] leading-relaxed whitespace-pre-wrap">{prontuario.vacinas || 'Nenhum registro ainda.'}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
