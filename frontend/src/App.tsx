import { useEffect, useState } from 'react';
import type { AppState, Page, User } from './types';
import { isAuthenticated, fetchMe, logout as logoutRequest } from './services/auth';
import { listContacts } from './services/messages';
import { PublicHeader, PublicFooter, AuthLayout } from './components/Layout';

// Public pages
import Home from './pages/public/Home';
import Auth from './pages/public/Auth';
import Services from './pages/public/Services';
import Sobre from './pages/public/Sobre';

// Client pages
import ClientDashboard from './pages/client/Dashboard';
import Pets from './pages/client/Pets';
import Booking from './pages/client/Booking';
import Appointments from './pages/client/Appointments';
import Messages from './pages/client/Messages';
import Profile from './pages/client/Profile';

// Groomer pages
import GroomerDashboard from './pages/groomer/Dashboard';
import AppointmentDetail from './pages/groomer/AppointmentDetail';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminAppointments from './pages/admin/Appointments';
import Stock from './pages/admin/Stock';
import AdminServices from './pages/admin/Services';
import AdminUsers from './pages/admin/Users';

const PUBLIC_PAGES: Page[] = ['home', 'sobre', 'servicos', 'login', 'cadastro'];

export default function App() {
  const [state, setState] = useState<AppState>({
    currentPage: 'home',
    currentUser: null,
    selectedAppointmentId: null,
    selectedPetId: null,
  });
  const [bootstrapping, setBootstrapping] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const navigate = (page: Page) => setState(s => ({ ...s, currentPage: page }));

  const login = (user: User) => {
    const defaultPage: Page =
      user.role === 'ADMIN' ? 'admin-dashboard' :
      user.role === 'BANHISTA' ? 'groomer-dashboard' :
      'client-dashboard';
    setState(s => ({ ...s, currentUser: user, currentPage: defaultPage }));
  };

  const logout = () => {
    logoutRequest();
    setState({ currentPage: 'home', currentUser: null, selectedAppointmentId: null, selectedPetId: null });
  };

  const selectAppointment = (id: string) => setState(s => ({ ...s, selectedAppointmentId: id, currentPage: 'groomer-appointment' }));

  const { currentPage, currentUser } = state;
  const isPublic = PUBLIC_PAGES.includes(currentPage);

  // Rehydrate the session from a stored token on first load, so a page refresh
  // doesn't silently boot the user back to the public home page.
  useEffect(() => {
    if (!isAuthenticated()) { setBootstrapping(false); return; }
    fetchMe()
      .then(user => setState(s => ({ ...s, currentUser: user, currentPage: PUBLIC_PAGES.includes(s.currentPage) ? defaultPageFor(user) : s.currentPage })))
      .catch(() => logoutRequest())
      .finally(() => setBootstrapping(false));
  }, []);

  useEffect(() => {
    if (!currentUser) { setUnreadCount(0); return; }
    let cancelled = false;
    const refresh = () => {
      listContacts()
        .then(contacts => { if (!cancelled) setUnreadCount(contacts.reduce((sum, c) => sum + c.unread, 0)); })
        .catch(() => {});
    };
    refresh();
    const interval = setInterval(refresh, 30000);
    return () => { cancelled = true; clearInterval(interval); };
  }, [currentUser, currentPage]);

  if (bootstrapping) {
    return (
      <div className="bg-[#DDD5CD] min-h-screen flex items-center justify-center">
        <p className="text-[#536273] text-sm">Carregando…</p>
      </div>
    );
  }

  // Public area
  if (isPublic || !currentUser) {
    return (
      <div className="bg-[#DDD5CD] min-h-screen">
        {currentPage !== 'login' && currentPage !== 'cadastro' && (
          <PublicHeader onNavigate={navigate} currentPage={currentPage} />
        )}

        {currentPage === 'home' && <Home onNavigate={navigate} />}
        {currentPage === 'sobre' && <Sobre onNavigate={navigate} />}
        {currentPage === 'servicos' && <Services onNavigate={navigate} />}
        {(currentPage === 'login' || currentPage === 'cadastro') && (
          <Auth mode={currentPage} onNavigate={navigate} onLogin={login} />
        )}

        {currentPage !== 'login' && currentPage !== 'cadastro' && (
          <PublicFooter onNavigate={navigate} />
        )}
      </div>
    );
  }

  // Authenticated area
  const renderPage = () => {
    if (currentUser.role === 'CLIENTE') {
      switch (currentPage) {
        case 'client-dashboard': return <ClientDashboard user={currentUser} onNavigate={navigate} />;
        case 'client-pets': return <Pets user={currentUser} onNavigate={navigate} />;
        case 'client-booking': return <Booking user={currentUser} onNavigate={navigate} />;
        case 'client-appointments': return <Appointments user={currentUser} onNavigate={navigate} />;
        case 'client-messages': return <Messages user={currentUser} />;
        case 'client-profile': return <Profile user={currentUser} />;
        default: return <ClientDashboard user={currentUser} onNavigate={navigate} />;
      }
    }

    if (currentUser.role === 'BANHISTA') {
      switch (currentPage) {
        case 'groomer-dashboard': return <GroomerDashboard user={currentUser} onNavigate={navigate} onSelectAppointment={selectAppointment} />;
        case 'groomer-appointment': return state.selectedAppointmentId ? <AppointmentDetail appointmentId={state.selectedAppointmentId} onNavigate={navigate} /> : <GroomerDashboard user={currentUser} onNavigate={navigate} onSelectAppointment={selectAppointment} />;
        case 'groomer-messages': return <Messages user={currentUser} />;
        default: return <GroomerDashboard user={currentUser} onNavigate={navigate} onSelectAppointment={selectAppointment} />;
      }
    }

    if (currentUser.role === 'ADMIN') {
      switch (currentPage) {
        case 'admin-dashboard': return <AdminDashboard user={currentUser} onNavigate={navigate} />;
        case 'admin-appointments': return <AdminAppointments />;
        case 'admin-stock': return <Stock />;
        case 'admin-services': return <AdminServices />;
        case 'admin-users': return <AdminUsers />;
        case 'admin-messages': return <Messages user={currentUser} />;
        default: return <AdminDashboard user={currentUser} onNavigate={navigate} />;
      }
    }

    return null;
  };

  return (
    <AuthLayout
      currentPage={currentPage}
      onNavigate={navigate}
      user={currentUser}
      onLogout={logout}
      unreadCount={unreadCount}
    >
      {renderPage()}
    </AuthLayout>
  );
}

function defaultPageFor(user: User): Page {
  if (user.role === 'ADMIN') return 'admin-dashboard';
  if (user.role === 'BANHISTA') return 'groomer-dashboard';
  return 'client-dashboard';
}
