import { useEffect, useState } from 'react';
import { listUsers, createUser, setUserActive, setUserRole } from '../../services/users';
import { updateProfile } from '../../services/auth';
import { ApiError } from '../../services/http';
import type { User, UserRole } from '../../types';
import { PlusIcon, SearchIcon, UsersIcon, EditIcon } from '../../components/Icons';
import { Card, Button, Modal, Input, Select, Alert, StatusBadge, EmptyState } from '../../components/UI';

const ROLE_LABELS: Record<UserRole, string> = { CLIENTE: 'Cliente', BANHISTA: 'Banhista', ADMIN: 'Administrador' };

interface FormState { name: string; email: string; phone: string; role: UserRole; password: string }

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [editUser, setEditUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<FormState>({ name: '', email: '', phone: '', role: 'CLIENTE', password: '' });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [deactivateConfirm, setDeactivateConfirm] = useState<string | null>(null);
  const [success, setSuccess] = useState('');

  const refresh = () => listUsers().then(setUsers).finally(() => setLoading(false));
  useEffect(() => { refresh(); }, []);

  const filtered = users.filter(u => {
    const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = !roleFilter || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const openEdit = (u: User) => { setForm({ name: u.name, email: u.email, phone: u.phone, role: u.role, password: '' }); setEditUser(u); setFormError(''); setShowModal(true); };
  const openNew = () => { setForm({ name: '', email: '', phone: '', role: 'CLIENTE', password: '' }); setEditUser(null); setFormError(''); setShowModal(true); };

  const save = async () => {
    if (!form.name || !form.email) { setFormError('Preencha nome e e-mail.'); return; }
    if (!editUser && form.password.length < 8) { setFormError('A senha temporária deve ter ao menos 8 caracteres.'); return; }
    setSaving(true);
    setFormError('');
    try {
      if (editUser) {
        await updateProfile(editUser.id, { nome: form.name, email: form.email });
        if (form.role !== editUser.role) await setUserRole(editUser.id, form.role);
      } else {
        await createUser({ name: form.name, email: form.email, phone: form.phone || undefined, role: form.role, password: form.password });
      }
      await refresh();
      setShowModal(false);
      setSuccess('Usuário salvo com sucesso!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : 'Não foi possível salvar o usuário.');
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (id: string, active: boolean) => {
    await setUserActive(id, active);
    await refresh();
    setDeactivateConfirm(null);
    setSuccess('Status do usuário atualizado.');
    setTimeout(() => setSuccess(''), 3000);
  };

  const roleBadgeColor = (role: UserRole) => {
    if (role === 'ADMIN') return 'bg-[#872B35]/10 text-[#872B35] border border-[#872B35]/20';
    if (role === 'BANHISTA') return 'bg-[#536273]/10 text-[#536273] border border-[#536273]/20';
    return 'bg-[#DDD5CD] text-[#223143] border border-[#cfc6bc]';
  };

  if (loading) {
    return <div className="max-w-5xl mx-auto py-16 text-center text-[#536273] text-sm">Carregando…</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#131B24]">Usuários</h1>
          <p className="text-[#536273] mt-1">{users.length} usuários · {users.filter(u => u.active).length} ativos</p>
        </div>
        <Button onClick={openNew} size="sm"><PlusIcon size={16} /> Novo usuário</Button>
      </div>

      {success && <Alert type="success" title={success} />}

      {/* Filters */}
      <Card className="p-4">
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#536273]" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por nome ou e-mail…"
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#cfc6bc] text-sm focus:outline-none focus:ring-2 focus:ring-[#872B35] bg-white"
            />
          </div>
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-[#cfc6bc] text-sm focus:outline-none focus:ring-2 focus:ring-[#872B35] bg-white text-[#131B24]"
          >
            <option value="">Todos os perfis</option>
            <option value="CLIENTE">Cliente</option>
            <option value="BANHISTA">Banhista</option>
            <option value="ADMIN">Administrador</option>
          </select>
        </div>
      </Card>

      {/* Desktop table */}
      <Card>
        {filtered.length === 0 ? (
          <EmptyState icon={<UsersIcon size={40} />} title="Nenhum usuário encontrado" />
        ) : (
          <>
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#DDD5CD]">
                    {['Usuário', 'E-mail', 'Telefone', 'Perfil', 'Status', 'Ações'].map(h => (
                      <th key={h} className="text-left text-xs font-semibold uppercase tracking-wide text-[#536273] px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(u => (
                    <tr key={u.id} className={`border-b border-[#DDD5CD] last:border-0 hover:bg-[#DDD5CD]/20 transition-colors ${!u.active ? 'opacity-50' : ''}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${u.role === 'ADMIN' ? 'bg-[#872B35]' : u.role === 'BANHISTA' ? 'bg-[#536273]' : 'bg-[#223143]'}`}>
                            {u.name.charAt(0)}
                          </div>
                          <span className="font-medium text-[#131B24]">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[#536273]">{u.email}</td>
                      <td className="px-4 py-3 text-[#536273]">{u.phone || '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${roleBadgeColor(u.role)}`}>{ROLE_LABELS[u.role]}</span>
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={u.active ? 'ATIVO' : 'INATIVO'} /></td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button onClick={() => openEdit(u)} className="text-xs text-[#536273] hover:text-[#223143] bg-[#DDD5CD] px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1">
                            <EditIcon size={12} /> Editar
                          </button>
                          <button
                            onClick={() => u.active ? setDeactivateConfirm(u.id) : toggleActive(u.id, true)}
                            className={`text-xs px-2.5 py-1.5 rounded-lg transition-colors ${u.active ? 'text-[#872B35] hover:bg-[#872B35]/10' : 'text-green-700 hover:bg-green-50'}`}
                          >
                            {u.active ? 'Inativar' : 'Reativar'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="sm:hidden p-4 space-y-3">
              {filtered.map(u => (
                <div key={u.id} className={`border border-[#DDD5CD] rounded-xl p-4 ${!u.active ? 'opacity-60' : ''}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 ${u.role === 'ADMIN' ? 'bg-[#872B35]' : u.role === 'BANHISTA' ? 'bg-[#536273]' : 'bg-[#223143]'}`}>
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-[#131B24] text-sm">{u.name}</p>
                        <p className="text-xs text-[#536273]">{u.email}</p>
                      </div>
                    </div>
                    <StatusBadge status={u.active ? 'ATIVO' : 'INATIVO'} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${roleBadgeColor(u.role)}`}>{ROLE_LABELS[u.role]}</span>
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(u)} className="text-xs text-[#536273] bg-[#DDD5CD] px-2.5 py-1.5 rounded-lg">Editar</button>
                      <button onClick={() => u.active ? setDeactivateConfirm(u.id) : toggleActive(u.id, true)} className={`text-xs px-2.5 py-1.5 rounded-lg ${u.active ? 'text-[#872B35]' : 'text-green-700'}`}>
                        {u.active ? 'Inativar' : 'Reativar'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </Card>

      {/* Edit/Create Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title={editUser ? 'Editar usuário' : 'Novo usuário'}>
        <div className="space-y-4">
          {formError && <Alert type="error" title="Não foi possível salvar" message={formError} />}
          <Input label="Nome completo" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
          <Input label="E-mail" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required disabled={!!editUser} />
          <Input label="Telefone" type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
          <Select label="Perfil" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value as UserRole }))} required>
            <option value="CLIENTE">Cliente</option>
            <option value="BANHISTA">Banhista</option>
            <option value="ADMIN">Administrador</option>
          </Select>
          {!editUser && (
            <Input label="Senha temporária" type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Mínimo 8 caracteres" hint="O usuário poderá alterá-la depois em Meu perfil." required />
          )}
          <div className="flex gap-3 pt-2">
            <Button variant="tertiary" onClick={() => setShowModal(false)} className="flex-1" disabled={saving}>Cancelar</Button>
            <Button onClick={save} className="flex-1" disabled={saving}>{saving ? 'Salvando…' : editUser ? 'Salvar' : 'Criar usuário'}</Button>
          </div>
        </div>
      </Modal>

      {/* Deactivate Confirm */}
      <Modal open={!!deactivateConfirm} onClose={() => setDeactivateConfirm(null)} title="Inativar usuário" size="sm">
        <div className="space-y-4">
          <Alert type="warning" title="Confirmar inativação" message="O usuário perderá acesso ao sistema. Esta ação pode ser revertida posteriormente." />
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => setDeactivateConfirm(null)} className="flex-1">Cancelar</Button>
            <Button variant="destructive" onClick={() => deactivateConfirm && toggleActive(deactivateConfirm, false)} className="flex-1">Inativar usuário</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
