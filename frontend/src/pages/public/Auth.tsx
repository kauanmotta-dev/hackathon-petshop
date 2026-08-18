import { useState } from 'react';
import type { Page, User } from '../../types';
import { login as loginRequest, register as registerRequest } from '../../services/auth';
import { ApiError } from '../../services/http';
import { PawIcon, EyeIcon } from '../../components/Icons';
import { Input, Button, Alert } from '../../components/UI';

interface Props {
  mode: 'login' | 'cadastro';
  onNavigate: (page: Page) => void;
  onLogin: (user: User) => void;
}

export default function Auth({ mode, onNavigate, onLogin }: Props) {
  const [tab, setTab] = useState<'login' | 'cadastro'>(mode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) { setError('Preencha e-mail e senha.'); return; }
    setLoading(true);
    setError('');
    try {
      const user = await loginRequest(email, password);
      onLogin(user);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível entrar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!name || !email || !password || !phone) { setError('Preencha todos os campos obrigatórios.'); return; }
    if (password.length < 8) { setError('A senha deve ter no mínimo 8 caracteres.'); return; }
    setLoading(true);
    setError('');
    try {
      const user = await registerRequest(name, email, password, phone);
      onLogin(user);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível criar sua conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#DDD5CD] flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-[#223143] p-12">
        <button onClick={() => onNavigate('home')} className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-[#872B35] rounded-xl flex items-center justify-center">
            <PawIcon size={20} className="text-white" />
          </div>
          <span className="font-display text-white text-xl font-semibold">Vitallis Pet Shop</span>
        </button>

        <div>
          <blockquote className="font-display text-3xl font-light text-white italic leading-snug mb-6">
            "O cuidado que o seu melhor amigo merece, na palma da sua mão."
          </blockquote>
          <div className="grid grid-cols-3 gap-4 mt-8">
            {[
              { n: '500+', l: 'Pets atendidos' },
              { n: '4.9★', l: 'Avaliação média' },
              { n: '3 anos', l: 'De experiência' },
            ].map(s => (
              <div key={s.l} className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                <p className="font-display font-bold text-white text-xl">{s.n}</p>
                <p className="text-[#DDD5CD]/50 text-xs mt-1">{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl overflow-hidden h-48">
          <img
            src="https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?w=500&h=250&fit=crop&auto=format"
            alt="Happy dog groomed"
            className="w-full h-full object-cover opacity-80"
          />
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-10">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 flex justify-center">
            <button onClick={() => onNavigate('home')} className="flex items-center gap-2">
              <div className="w-9 h-9 bg-[#872B35] rounded-xl flex items-center justify-center">
                <PawIcon size={20} className="text-white" />
              </div>
              <span className="font-display text-[#223143] text-xl font-semibold">Vitallis Pet Shop</span>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex rounded-xl bg-[#cfc6bc]/50 p-1 mb-8">
            {(['login', 'cadastro'] as const).map(t => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(''); }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${tab === t ? 'bg-white text-[#131B24] shadow-sm' : 'text-[#536273] hover:text-[#131B24]'}`}
              >
                {t === 'login' ? 'Entrar' : 'Criar conta'}
              </button>
            ))}
          </div>

          {tab === 'login' ? (
            <div className="space-y-5">
              <div>
                <h2 className="font-display text-2xl font-bold text-[#131B24]">Bem-vindo de volta</h2>
                <p className="text-[#536273] text-sm mt-1">Acesse sua conta para gerenciar seus pets</p>
              </div>

              {error && <Alert type="error" title="Falha no acesso" message={error} />}

              <div className="space-y-4">
                <Input
                  label="E-mail"
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                />
                <div className="relative">
                  <Input
                    label="Senha"
                    id="password"
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-8 text-[#536273] hover:text-[#131B24]"
                  >
                    <EyeIcon size={16} />
                  </button>
                </div>
              </div>

              <button className="text-sm text-[#872B35] hover:underline">Esqueci minha senha</button>

              <Button
                onClick={handleLogin}
                disabled={loading}
                size="lg"
                className="w-full"
              >
                {loading ? 'Entrando…' : 'Entrar'}
              </Button>

              <p className="text-center text-sm text-[#536273]">
                Não tem conta?{' '}
                <button onClick={() => setTab('cadastro')} className="text-[#872B35] font-semibold hover:underline">
                  Criar agora
                </button>
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <h2 className="font-display text-2xl font-bold text-[#131B24]">Criar sua conta</h2>
                <p className="text-[#536273] text-sm mt-1">É grátis e rápido. Agende em segundos!</p>
              </div>

              {error && <Alert type="error" title="Erro no cadastro" message={error} />}

              <div className="space-y-4">
                <Input label="Nome completo" id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Ana Beatriz Costa" required />
                <Input label="E-mail" id="reg-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" required />
                <Input label="Telefone" id="phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="(11) 99999-9999" required />
                <Input label="Senha" id="reg-password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Mínimo 8 caracteres" required />
              </div>

              <Button onClick={handleRegister} disabled={loading} size="lg" className="w-full">
                {loading ? 'Criando conta…' : 'Criar conta gratuita'}
              </Button>

              <p className="text-xs text-[#536273] text-center">
                Ao criar uma conta, você concorda com nossos <span className="text-[#872B35]">Termos de Uso</span> e <span className="text-[#872B35]">Política de Privacidade</span>.
              </p>

              <p className="text-center text-sm text-[#536273]">
                Já tem conta?{' '}
                <button onClick={() => setTab('login')} className="text-[#872B35] font-semibold hover:underline">
                  Entrar
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
