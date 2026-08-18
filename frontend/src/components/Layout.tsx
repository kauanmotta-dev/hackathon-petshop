import { useState } from 'react';
import type { ReactNode } from 'react';
import type { Page, User } from '../types';
import {
  HomeIcon, PawIcon, CalendarIcon, ScissorsIcon, PackageIcon,
  UsersIcon, MessageIcon, LogOutIcon, MenuIcon, XIcon, UserIcon,
  BellIcon, BarChartIcon, SettingsIcon
} from './Icons';

interface NavItem {
  id: Page;
  label: string;
  icon: ReactNode;
}

interface LayoutProps {
  children: ReactNode;
  currentPage: Page;
  onNavigate: (page: Page) => void;
  user: User;
  onLogout: () => void;
  unreadCount?: number;
}

const clientNav: NavItem[] = [
  { id: 'client-dashboard', label: 'Início', icon: <HomeIcon /> },
  { id: 'client-pets', label: 'Meus Pets', icon: <PawIcon /> },
  { id: 'client-booking', label: 'Agendar', icon: <CalendarIcon /> },
  { id: 'client-appointments', label: 'Agendamentos', icon: <ScissorsIcon /> },
  { id: 'client-messages', label: 'Mensagens', icon: <MessageIcon /> },
];

const groomerNav: NavItem[] = [
  { id: 'groomer-dashboard', label: 'Minha Agenda', icon: <CalendarIcon /> },
  { id: 'groomer-messages', label: 'Mensagens', icon: <MessageIcon /> },
];

const adminNav: NavItem[] = [
  { id: 'admin-dashboard', label: 'Dashboard', icon: <BarChartIcon /> },
  { id: 'admin-appointments', label: 'Agendamentos', icon: <CalendarIcon /> },
  { id: 'admin-stock', label: 'Estoque', icon: <PackageIcon /> },
  { id: 'admin-services', label: 'Serviços', icon: <ScissorsIcon /> },
  { id: 'admin-users', label: 'Usuários', icon: <UsersIcon /> },
  { id: 'admin-messages', label: 'Mensagens', icon: <MessageIcon /> },
];

function getNav(role: string): NavItem[] {
  if (role === 'BANHISTA') return groomerNav;
  if (role === 'ADMIN') return adminNav;
  return clientNav;
}

function getRoleLabel(role: string): string {
  if (role === 'BANHISTA') return 'Banhista';
  if (role === 'ADMIN') return 'Administrador';
  return 'Cliente';
}

function getRoleBg(role: string): string {
  if (role === 'BANHISTA') return 'bg-[#536273]';
  if (role === 'ADMIN') return 'bg-[#872B35]';
  return 'bg-[#223143]';
}

export function AuthLayout({ children, currentPage, onNavigate, user, onLogout, unreadCount = 0 }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const nav = getNav(user.role);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="px-5 py-5 border-b border-white/10">
        <button onClick={() => onNavigate('home')} className="block">
          <span className="font-display text-xl font-semibold text-white tracking-tight">Vitallis</span>
          <span className="block text-xs text-[#DDD5CD]/60 mt-0.5">Pet Shop</span>
        </button>
      </div>

      <div className="px-4 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-full ${getRoleBg(user.role)} flex items-center justify-center text-white font-semibold text-sm flex-shrink-0`}>
            {user.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">{user.name.split(' ')[0]}</p>
            <p className="text-xs text-[#DDD5CD]/60">{getRoleLabel(user.role)}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto scrollbar-hide">
        {nav.map(item => {
          const isActive = currentPage === item.id;
          const hasUnread = item.id.includes('messages') && unreadCount > 0;
          return (
            <button
              key={item.id}
              onClick={() => { onNavigate(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive ? 'bg-[#872B35] text-white' : 'text-[#DDD5CD]/70 hover:bg-white/10 hover:text-white'}`}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              <span className="flex-1 text-left">{item.label}</span>
              {hasUnread && (
                <span className="bg-[#872B35] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {unreadCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-white/10 space-y-0.5">
        <button
          onClick={() => { onNavigate('client-profile'); setSidebarOpen(false); }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#DDD5CD]/70 hover:bg-white/10 hover:text-white transition-all"
        >
          <UserIcon />
          <span>Meu perfil</span>
        </button>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#DDD5CD]/70 hover:bg-white/10 hover:text-white transition-all"
        >
          <LogOutIcon />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#DDD5CD] overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-[#223143] flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setSidebarOpen(false)}>
          <div className="absolute inset-0 bg-[#131B24]/60" />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-[#223143] z-50">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile topbar */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-[#223143] text-white flex-shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="p-1.5 rounded-lg hover:bg-white/10">
            <MenuIcon size={22} />
          </button>
          <span className="font-display font-semibold text-lg">Vitallis</span>
          <button className="p-1.5 rounded-lg hover:bg-white/10 relative">
            <BellIcon size={20} />
            {unreadCount > 0 && <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-[#872B35] rounded-full" />}
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

interface PublicHeaderProps {
  onNavigate: (page: Page) => void;
  currentPage: Page;
}

export function PublicHeader({ onNavigate, currentPage }: PublicHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const links: { id: Page; label: string }[] = [
    { id: 'home', label: 'Início' },
    { id: 'sobre', label: 'Sobre' },
    { id: 'servicos', label: 'Serviços' },
  ];

  return (
    <header className="bg-[#223143] sticky top-0 z-30 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <button onClick={() => onNavigate('home')} className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#872B35] rounded-lg flex items-center justify-center">
              <PawIcon size={18} className="text-white" />
            </div>
            <div>
              <span className="font-display font-semibold text-white text-lg tracking-tight">Vitallis</span>
              <span className="hidden sm:inline text-[#DDD5CD]/50 text-sm ml-1">Pet Shop</span>
            </div>
          </button>

          <nav className="hidden md:flex items-center gap-1">
            {links.map(link => (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === link.id ? 'bg-white/10 text-white' : 'text-[#DDD5CD]/70 hover:text-white hover:bg-white/5'}`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('login')}
              className="hidden md:block text-sm font-medium text-[#DDD5CD]/70 hover:text-white px-4 py-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              Entrar
            </button>
            <button
              onClick={() => onNavigate('servicos')}
              className="bg-[#872B35] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#6e2029] transition-colors"
            >
              Agendar
            </button>
            <button className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <XIcon size={20} /> : <MenuIcon size={20} />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#223143] px-4 py-3 space-y-1">
          {links.map(link => (
            <button
              key={link.id}
              onClick={() => { onNavigate(link.id); setMenuOpen(false); }}
              className="block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-[#DDD5CD]/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => { onNavigate('login'); setMenuOpen(false); }}
            className="block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-[#DDD5CD]/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            Entrar
          </button>
        </div>
      )}
    </header>
  );
}

export function PublicFooter({ onNavigate }: { onNavigate: (page: Page) => void }) {
  return (
    <footer className="bg-[#131B24] text-[#DDD5CD]/70">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-[#872B35] rounded-lg flex items-center justify-center">
                <PawIcon size={18} className="text-white" />
              </div>
              <span className="font-display text-white text-lg font-semibold">Vitallis Pet Shop</span>
            </div>
            <p className="text-sm leading-relaxed">Cuidado especializado com carinho e profissionalismo para o seu melhor amigo.</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#DDD5CD]/40 mb-3">Navegação</p>
            <div className="space-y-2">
              {(['home', 'sobre', 'servicos'] as Page[]).map(p => (
                <button key={p} onClick={() => onNavigate(p)} className="block text-sm hover:text-[#DDD5CD] transition-colors capitalize">
                  {p === 'home' ? 'Início' : p === 'sobre' ? 'Sobre' : 'Serviços'}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#DDD5CD]/40 mb-3">Contato</p>
            <div className="space-y-2 text-sm">
              <p>📍 Rua das Flores, 142 — Pinheiros, SP</p>
              <p>📞 (11) 3456-7890</p>
              <p>✉ contato@vitallis.com.br</p>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#DDD5CD]/40 mb-3">Horário</p>
            <div className="space-y-1 text-sm">
              <p>Seg – Sex: 8h às 18h</p>
              <p>Sáb: 8h às 14h</p>
              <p>Dom: Fechado</p>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs">© 2026 Vitallis Pet Shop. Todos os direitos reservados.</p>
          <p className="text-xs">Feito com cuidado ♥</p>
        </div>
      </div>
    </footer>
  );
}
