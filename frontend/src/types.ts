export type UserRole = 'CLIENTE' | 'BANHISTA' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  active: boolean;
  createdAt: string;
}

export interface Pet {
  id: string;
  ownerId: string;
  name: string;
  species: 'Cão' | 'Gato' | 'Outro';
  breed: string;
  size: 'Pequeno' | 'Médio' | 'Grande' | 'Gigante';
  birthDate: string;
  notes: string;
  conditions: string;
  color: string;
}

export interface MedicalRecord {
  id: string;
  petId: string;
  date: string;
  service: string;
  groomer: string;
  notes: string;
  observations: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  sizes: string[];
  species: string[];
  active: boolean;
}

export type AppointmentStatus = 'AGENDADO' | 'EM_ANDAMENTO' | 'CONCLUIDO' | 'CANCELADO';

export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  petId: string;
  petName: string;
  serviceId: string;
  serviceName: string;
  groomerId: string;
  groomerName: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  notes: string;
  price: number;
}

export interface StockLocation {
  id: string;
  name: string;
  description: string;
}

export interface StockItem {
  id: string;
  locationId: string;
  locationName: string;
  name: string;
  unit: string;
  quantity: number;
  criticalQty: number;
  category: string;
}

export interface StockMovement {
  id: string;
  itemId: string;
  itemName: string;
  type: 'ENTRADA' | 'SAIDA';
  quantity: number;
  date: string;
  notes: string;
  userId: string;
  userName: string;
}

export interface Message {
  id: string;
  fromId: string;
  fromName: string;
  toId: string;
  toName: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export type Page =
  | 'home' | 'sobre' | 'servicos' | 'login' | 'cadastro'
  | 'client-dashboard' | 'client-pets' | 'client-booking' | 'client-appointments' | 'client-messages' | 'client-profile'
  | 'groomer-dashboard' | 'groomer-appointment' | 'groomer-messages'
  | 'admin-dashboard' | 'admin-appointments' | 'admin-stock' | 'admin-services' | 'admin-users' | 'admin-messages';

export interface AppState {
  currentPage: Page;
  currentUser: User | null;
  selectedAppointmentId: string | null;
  selectedPetId: string | null;
}
