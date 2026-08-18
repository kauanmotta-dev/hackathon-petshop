import { useEffect, useState } from 'react';
import { getStockStatus } from '../../data/mock';
import type { StockItem, StockLocation, StockMovement } from '../../types';
import {
  listLocations, listItems, createLocation, createMaterial, registerEntry, registerExit,
  listAllMovements, parseItemId,
} from '../../services/stock';
import { ApiError } from '../../services/http';
import { PlusIcon, SearchIcon, AlertIcon, CheckIcon, PackageIcon } from '../../components/Icons';
import { Card, StatusBadge, Button, Modal, Input, Select, Alert, StatCard, EmptyState } from '../../components/UI';

export default function Stock() {
  const [items, setItems] = useState<StockItem[]>([]);
  const [locations, setLocations] = useState<StockLocation[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [movementModal, setMovementModal] = useState<StockItem | null>(null);
  const [addModal, setAddModal] = useState(false);
  const [locationModal, setLocationModal] = useState(false);
  const [movType, setMovType] = useState<'ENTRADA' | 'SAIDA'>('ENTRADA');
  const [movQty, setMovQty] = useState('');
  const [movNotes, setMovNotes] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const [newItem, setNewItem] = useState<{ name: string; tipo: string; locationId: string; unit: string; category: string; quantity: string; criticalQty: string }>(
    { name: '', tipo: '', locationId: '', unit: '', category: '', quantity: '', criticalQty: '' },
  );
  const [newLocation, setNewLocation] = useState({ name: '', description: '' });

  const refresh = () => Promise.all([listLocations(), listItems(), listAllMovements()]).then(([locs, its, movs]) => {
    setLocations(locs);
    setItems(its);
    setMovements(movs);
  });

  useEffect(() => { refresh().finally(() => setLoading(false)); }, []);

  const critical = items.filter(i => { const s = getStockStatus(i); return s === 'critico' || s === 'sem_estoque'; });

  const filtered = items.filter(i => {
    const matchSearch = !search || i.name.toLowerCase().includes(search.toLowerCase());
    const matchLoc = !locationFilter || i.locationId === locationFilter;
    const matchSt = !statusFilter || getStockStatus(i) === statusFilter;
    return matchSearch && matchLoc && matchSt;
  });

  const applyMovement = async () => {
    if (!movementModal || !movQty) return;
    const { locationId, materialId } = parseItemId(movementModal.id);
    setSaving(true);
    setError('');
    try {
      const qty = parseFloat(movQty);
      if (movType === 'ENTRADA') await registerEntry(locationId, materialId, qty, movNotes || undefined);
      else await registerExit(locationId, materialId, qty, movNotes || undefined);
      await refresh();
      setMovementModal(null);
      setMovQty('');
      setMovNotes('');
      setSuccess(`${movType === 'ENTRADA' ? 'Entrada' : 'Saída'} registrada com sucesso!`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível registrar a movimentação.');
    } finally {
      setSaving(false);
    }
  };

  const addItem = async () => {
    if (!newItem.name || !newItem.tipo || !newItem.locationId || !newItem.unit) return;
    setSaving(true);
    setError('');
    try {
      const material = await createMaterial({
        nome: newItem.name, tipo: newItem.tipo, unidade: newItem.unit,
        categoria: newItem.category || undefined, quantidadeCritica: newItem.criticalQty ? parseFloat(newItem.criticalQty) : undefined,
      });
      const quantity = parseFloat(newItem.quantity || '0');
      if (quantity > 0) {
        await registerEntry(newItem.locationId, String(material.id), quantity, 'Cadastro inicial');
      }
      await refresh();
      setAddModal(false);
      setNewItem({ name: '', tipo: '', locationId: '', unit: '', category: '', quantity: '', criticalQty: '' });
      setSuccess('Material cadastrado com sucesso!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível cadastrar o material.');
    } finally {
      setSaving(false);
    }
  };

  const addLocation = async () => {
    if (!newLocation.name) return;
    setSaving(true);
    setError('');
    try {
      await createLocation(newLocation.name, newLocation.description || undefined);
      await refresh();
      setLocationModal(false);
      setNewLocation({ name: '', description: '' });
      setSuccess('Local de estoque criado!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível criar o local.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="max-w-5xl mx-auto py-16 text-center text-[#536273] text-sm">Carregando…</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#131B24]">Controle de estoque</h1>
          <p className="text-[#536273] mt-1">{items.length} materiais cadastrados</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setLocationModal(true)} size="sm" variant="tertiary">
            <PlusIcon size={16} /> Local
          </Button>
          <Button onClick={() => setAddModal(true)} size="sm" disabled={locations.length === 0}>
            <PlusIcon size={16} /> Novo material
          </Button>
        </div>
      </div>

      {success && <Alert type="success" title={success} />}
      {locations.length === 0 && (
        <Alert type="info" title="Nenhum local de estoque cadastrado" message="Crie um local (ex: Estoque Principal) antes de cadastrar materiais." />
      )}

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
        <StatCard label="Total" value={items.length} icon={<PackageIcon size={20} />} />
        <StatCard label="Crítico" value={critical.length} icon={<AlertIcon size={20} />} accent={critical.length > 0 ? 'text-[#872B35]' : ''} />
        <StatCard label="Normal" value={items.filter(i => getStockStatus(i) === 'normal').length} icon={<CheckIcon size={20} />} accent="text-green-700" />
        <StatCard label="Locais" value={locations.length} icon={<PackageIcon size={20} />} />
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#536273]" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar material…"
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#cfc6bc] text-sm focus:outline-none focus:ring-2 focus:ring-[#872B35] bg-white"
            />
          </div>
          <select
            value={locationFilter}
            onChange={e => setLocationFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-[#cfc6bc] text-sm focus:outline-none focus:ring-2 focus:ring-[#872B35] bg-white text-[#131B24]"
          >
            <option value="">Todos os locais</option>
            {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
          </select>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-[#cfc6bc] text-sm focus:outline-none focus:ring-2 focus:ring-[#872B35] bg-white text-[#131B24]"
          >
            <option value="">Todos os status</option>
            <option value="normal">Normal</option>
            <option value="baixo">Baixo</option>
            <option value="critico">Crítico</option>
            <option value="sem_estoque">Sem estoque</option>
          </select>
        </div>
      </Card>

      {/* Table / Cards */}
      <Card>
        {filtered.length === 0 ? (
          <EmptyState icon={<PackageIcon size={40} />} title="Nenhum item encontrado" description="Tente ajustar os filtros de busca." />
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#DDD5CD]">
                    {['Material', 'Local', 'Categoria', 'Quantidade', 'Qt. Crítica', 'Status', 'Ações'].map(h => (
                      <th key={h} className="text-left text-xs font-semibold uppercase tracking-wide text-[#536273] px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(item => {
                    const st = getStockStatus(item);
                    return (
                      <tr key={item.id} className={`border-b border-[#DDD5CD] last:border-0 hover:bg-[#DDD5CD]/20 ${st === 'sem_estoque' ? 'bg-[#DDD5CD]/30' : ''}`}>
                        <td className="px-4 py-3 font-medium text-[#131B24]">{item.name}</td>
                        <td className="px-4 py-3 text-[#536273]">{item.locationName}</td>
                        <td className="px-4 py-3 text-[#536273]">{item.category}</td>
                        <td className="px-4 py-3 font-bold text-[#131B24]">{item.quantity} {item.unit}</td>
                        <td className="px-4 py-3 text-[#536273]">{item.criticalQty} {item.unit}</td>
                        <td className="px-4 py-3"><StatusBadge status={st} /></td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => { setMovementModal(item); setError(''); }}
                            className="text-xs font-medium text-[#872B35] hover:underline"
                          >
                            + / − Qtd
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="sm:hidden p-4 space-y-3">
              {filtered.map(item => {
                const st = getStockStatus(item);
                return (
                  <div key={item.id} className="border border-[#DDD5CD] rounded-xl p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-[#131B24]">{item.name}</p>
                        <p className="text-xs text-[#536273]">{item.locationName} · {item.category}</p>
                      </div>
                      <StatusBadge status={st} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-[#131B24]">{item.quantity}</span>
                        <span className="text-sm text-[#536273] ml-1">{item.unit}</span>
                        <span className="text-xs text-[#536273] ml-2">(mín: {item.criticalQty})</span>
                      </div>
                      <button
                        onClick={() => { setMovementModal(item); setError(''); }}
                        className="text-xs font-semibold bg-[#DDD5CD] text-[#223143] px-3 py-1.5 rounded-lg"
                      >
                        Ajustar qtd
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </Card>

      {/* Recent movements */}
      <Card className="p-5">
        <h3 className="font-semibold text-[#131B24] mb-4">Movimentações recentes</h3>
        {movements.length === 0 ? (
          <p className="text-sm text-[#536273] text-center py-4">Nenhuma movimentação registrada ainda.</p>
        ) : (
          <div className="space-y-2">
            {movements.slice(0, 10).map(m => (
              <div key={m.id} className="flex items-center justify-between py-2 border-b border-[#DDD5CD] last:border-0 text-sm">
                <div>
                  <p className="font-medium text-[#131B24]">{m.itemName}</p>
                  <p className="text-xs text-[#536273]">{new Date(m.date + 'T12:00').toLocaleDateString('pt-BR')} · {m.userName}{m.notes ? ` · ${m.notes}` : ''}</p>
                </div>
                <span className={`font-semibold ${m.type === 'ENTRADA' ? 'text-green-700' : 'text-[#872B35]'}`}>
                  {m.type === 'ENTRADA' ? '+' : '−'}{m.quantity}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Movement Modal */}
      <Modal open={!!movementModal} onClose={() => setMovementModal(null)} title={`Movimentação — ${movementModal?.name}`}>
        <div className="space-y-4">
          {error && <Alert type="error" title="Não foi possível registrar" message={error} />}
          <div className="flex rounded-xl bg-[#DDD5CD]/50 p-1">
            {(['ENTRADA', 'SAIDA'] as const).map(t => (
              <button
                key={t}
                onClick={() => setMovType(t)}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${movType === t ? 'bg-white shadow text-[#131B24]' : 'text-[#536273]'}`}
              >
                {t === 'ENTRADA' ? '+ Entrada' : '− Saída'}
              </button>
            ))}
          </div>
          {movementModal && (
            <div className="bg-[#DDD5CD]/40 rounded-xl p-3 text-sm">
              <p className="text-[#536273]">Estoque atual: <strong className="text-[#131B24]">{movementModal.quantity} {movementModal.unit}</strong></p>
            </div>
          )}
          <Input
            label="Quantidade"
            type="number"
            value={movQty}
            onChange={e => setMovQty(e.target.value)}
            placeholder="0"
            required
          />
          <Input
            label="Motivo / observação"
            value={movNotes}
            onChange={e => setMovNotes(e.target.value)}
            placeholder="Ex: Reposição semanal"
          />
          <div className="flex gap-3">
            <Button variant="tertiary" onClick={() => setMovementModal(null)} className="flex-1" disabled={saving}>Cancelar</Button>
            <Button onClick={applyMovement} disabled={!movQty || saving} className="flex-1">{saving ? 'Registrando…' : 'Registrar'}</Button>
          </div>
        </div>
      </Modal>

      {/* Add Item Modal */}
      <Modal open={addModal} onClose={() => setAddModal(false)} title="Cadastrar novo material">
        <div className="space-y-4">
          {error && <Alert type="error" title="Não foi possível cadastrar" message={error} />}
          <Input label="Nome do material" value={newItem.name} onChange={e => setNewItem(n => ({ ...n, name: e.target.value }))} placeholder="Ex: Shampoo Neutro" required />
          <Input label="Tipo" value={newItem.tipo} onChange={e => setNewItem(n => ({ ...n, tipo: e.target.value }))} placeholder="Ex: Higiene" required />
          <Select label="Local de estoque" value={newItem.locationId} onChange={e => setNewItem(n => ({ ...n, locationId: e.target.value }))} required>
            <option value="">Selecione o local</option>
            {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
          </Select>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Unidade" value={newItem.unit} onChange={e => setNewItem(n => ({ ...n, unit: e.target.value }))} placeholder="Ex: litros, unidades" required />
            <Input label="Categoria" value={newItem.category} onChange={e => setNewItem(n => ({ ...n, category: e.target.value }))} placeholder="Ex: Higiene" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Quantidade inicial" type="number" value={newItem.quantity} onChange={e => setNewItem(n => ({ ...n, quantity: e.target.value }))} placeholder="0" />
            <Input label="Quantidade crítica" type="number" value={newItem.criticalQty} onChange={e => setNewItem(n => ({ ...n, criticalQty: e.target.value }))} placeholder="0" />
          </div>
          <div className="flex gap-3">
            <Button variant="tertiary" onClick={() => setAddModal(false)} className="flex-1" disabled={saving}>Cancelar</Button>
            <Button onClick={addItem} className="flex-1" disabled={saving}>{saving ? 'Cadastrando…' : 'Cadastrar material'}</Button>
          </div>
        </div>
      </Modal>

      {/* Add Location Modal */}
      <Modal open={locationModal} onClose={() => setLocationModal(false)} title="Novo local de estoque" size="sm">
        <div className="space-y-4">
          {error && <Alert type="error" title="Não foi possível criar" message={error} />}
          <Input label="Nome do local" value={newLocation.name} onChange={e => setNewLocation(n => ({ ...n, name: e.target.value }))} placeholder="Ex: Estoque Principal" required />
          <Input label="Descrição" value={newLocation.description} onChange={e => setNewLocation(n => ({ ...n, description: e.target.value }))} placeholder="Ex: Almoxarifado geral" />
          <div className="flex gap-3">
            <Button variant="tertiary" onClick={() => setLocationModal(false)} className="flex-1" disabled={saving}>Cancelar</Button>
            <Button onClick={addLocation} className="flex-1" disabled={saving}>{saving ? 'Criando…' : 'Criar local'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
