import { useState } from 'react';
import type { User } from '../../types';
import { updateProfile, addPhone, changePassword } from '../../services/auth';
import { ApiError } from '../../services/http';
import { Input, Button, Alert, Card } from '../../components/UI';

interface Props { user: User }

const ROLE_LABELS: Record<User['role'], string> = { CLIENTE: 'Cliente', BANHISTA: 'Banhista', ADMIN: 'Administrador' };

export default function Profile({ user }: Props) {
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [saved, setSaved] = useState(false);

  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [savingPass, setSavingPass] = useState(false);
  const [passError, setPassError] = useState('');
  const [passSaved, setPassSaved] = useState(false);

  const saveProfile = async () => {
    setSavingProfile(true);
    setProfileError('');
    try {
      if (name !== user.name) {
        await updateProfile(user.id, { nome: name });
      }
      if (phone && phone !== user.phone) {
        await addPhone(user.id, phone);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setProfileError(err instanceof ApiError ? err.message : 'Não foi possível salvar o perfil.');
    } finally {
      setSavingProfile(false);
    }
  };

  const savePassword = async () => {
    if (!currentPass || !newPass) { setPassError('Preencha a senha atual e a nova senha.'); return; }
    setSavingPass(true);
    setPassError('');
    try {
      await changePassword(currentPass, newPass);
      setCurrentPass('');
      setNewPass('');
      setPassSaved(true);
      setTimeout(() => setPassSaved(false), 3000);
    } catch (err) {
      setPassError(err instanceof ApiError ? err.message : 'Não foi possível alterar a senha.');
    } finally {
      setSavingPass(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#131B24]">Meu perfil</h1>
        <p className="text-[#536273] mt-1">Gerencie suas informações pessoais</p>
      </div>

      {saved && <Alert type="success" title="Perfil atualizado com sucesso!" />}

      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-[#223143] flex items-center justify-center text-white font-bold text-2xl">
            {user.name.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-[#131B24]">{user.name}</p>
            <p className="text-sm text-[#536273]">{user.email}</p>
            <span className="text-xs bg-[#DDD5CD] text-[#536273] px-2 py-0.5 rounded-full mt-1 inline-block">{ROLE_LABELS[user.role]}</span>
          </div>
        </div>

        {profileError && <div className="mb-4"><Alert type="error" title="Não foi possível salvar" message={profileError} /></div>}

        <div className="space-y-4">
          <Input label="Nome completo" value={name} onChange={e => setName(e.target.value)} />
          <Input label="E-mail" type="email" value={user.email} disabled />
          <Input label="Telefone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} />
        </div>

        <Button onClick={saveProfile} disabled={savingProfile} className="mt-5 w-full">{savingProfile ? 'Salvando…' : 'Salvar alterações'}</Button>
      </Card>

      <Card className="p-6">
        <h2 className="font-semibold text-[#131B24] mb-4">Alterar senha</h2>
        {passSaved && <div className="mb-4"><Alert type="success" title="Senha alterada com sucesso!" /></div>}
        {passError && <div className="mb-4"><Alert type="error" title="Não foi possível alterar a senha" message={passError} /></div>}
        <div className="space-y-4">
          <Input label="Senha atual" type="password" value={currentPass} onChange={e => setCurrentPass(e.target.value)} placeholder="••••••••" />
          <Input label="Nova senha" type="password" value={newPass} onChange={e => setNewPass(e.target.value)} placeholder="Mínimo 8 caracteres" />
        </div>
        <Button variant="secondary" onClick={savePassword} disabled={savingPass} className="mt-5 w-full">{savingPass ? 'Alterando…' : 'Alterar senha'}</Button>
      </Card>
    </div>
  );
}
