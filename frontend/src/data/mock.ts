import type { User, Pet, Service, Appointment, StockItem, StockLocation, StockMovement, Message, MedicalRecord } from '../types';

export const mockUsers: User[] = [
  { id: 'u1', name: 'Ana Beatriz Costa', email: 'ana@email.com', phone: '(11) 98765-4321', role: 'CLIENTE', active: true, createdAt: '2024-03-15' },
  { id: 'u2', name: 'Carlos Eduardo Lima', email: 'carlos@email.com', phone: '(11) 91234-5678', role: 'CLIENTE', active: true, createdAt: '2024-05-02' },
  { id: 'u3', name: 'Fernanda Matos', email: 'fernanda@petshop.com', phone: '(11) 99876-5432', role: 'BANHISTA', active: true, createdAt: '2023-11-20' },
  { id: 'u4', name: 'Ricardo Alves', email: 'ricardo@petshop.com', phone: '(11) 97654-3210', role: 'BANHISTA', active: true, createdAt: '2023-08-14' },
  { id: 'u5', name: 'Mariana Torres', email: 'admin@petshop.com', phone: '(11) 93456-7890', role: 'ADMIN', active: true, createdAt: '2023-01-10' },
  { id: 'u6', name: 'Diego Souza', email: 'diego@petshop.com', phone: '(11) 92345-6789', role: 'ADMIN', active: false, createdAt: '2023-06-01' },
  { id: 'u7', name: 'Patrícia Nunes', email: 'patricia@email.com', phone: '(11) 94567-8901', role: 'CLIENTE', active: true, createdAt: '2024-07-18' },
];

export const mockPets: Pet[] = [
  { id: 'p1', ownerId: 'u1', name: 'Thor', species: 'Cão', breed: 'Golden Retriever', size: 'Grande', birthDate: '2021-04-10', notes: 'Muito dócil, adora brincar com água', conditions: 'Alérgico a shampoo com perfume forte', color: '#C8860A' },
  { id: 'p2', ownerId: 'u1', name: 'Mel', species: 'Gato', breed: 'Persa', size: 'Médio', birthDate: '2022-08-22', notes: 'Tímida com estranhos', conditions: '', color: '#888888' },
  { id: 'p3', ownerId: 'u2', name: 'Bolinha', species: 'Cão', breed: 'Poodle', size: 'Pequeno', birthDate: '2020-12-05', notes: 'Ansioso, prefere atendimento rápido', conditions: 'Displasia leve no quadril', color: '#F0D080' },
  { id: 'p4', ownerId: 'u7', name: 'Luna', species: 'Cão', breed: 'Labrador', size: 'Grande', birthDate: '2022-02-14', notes: 'Dócil e obediente', conditions: '', color: '#D4A870' },
];

export const mockServices: Service[] = [
  { id: 's1', name: 'Banho Completo', description: 'Banho com shampoo premium, secagem, perfume e hidratação do pelo', duration: 90, price: 65, sizes: ['Pequeno', 'Médio', 'Grande', 'Gigante'], species: ['Cão', 'Gato'], active: true },
  { id: 's2', name: 'Tosa Higiênica', description: 'Tosa das patinhas, barriga e região íntima para maior higiene e conforto', duration: 45, price: 45, sizes: ['Pequeno', 'Médio', 'Grande'], species: ['Cão', 'Gato'], active: true },
  { id: 's3', name: 'Tosa Completa', description: 'Modelagem completa do pelo conforme raça ou preferência do tutor', duration: 120, price: 90, sizes: ['Pequeno', 'Médio', 'Grande', 'Gigante'], species: ['Cão'], active: true },
  { id: 's4', name: 'Banho + Tosa', description: 'Combo completo: banho premium e tosa modeladora com acabamento fino', duration: 180, price: 130, sizes: ['Pequeno', 'Médio', 'Grande'], species: ['Cão'], active: true },
  { id: 's5', name: 'Hidratação Profunda', description: 'Tratamento intensivo de hidratação para pelos ressecados ou danificados', duration: 60, price: 55, sizes: ['Pequeno', 'Médio', 'Grande', 'Gigante'], species: ['Cão', 'Gato'], active: true },
  { id: 's6', name: 'Spa Felino', description: 'Banho especializado para gatos com técnicas de contenção gentil e produtos específicos', duration: 90, price: 80, sizes: ['Pequeno', 'Médio', 'Grande'], species: ['Gato'], active: false },
];

export const mockAppointments: Appointment[] = [
  { id: 'a1', clientId: 'u1', clientName: 'Ana Beatriz Costa', petId: 'p1', petName: 'Thor', serviceId: 's4', serviceName: 'Banho + Tosa', groomerId: 'u3', groomerName: 'Fernanda Matos', date: '2026-08-18', time: '09:00', status: 'AGENDADO', notes: 'Usar shampoo sem perfume forte', price: 130 },
  { id: 'a2', clientId: 'u2', clientName: 'Carlos Eduardo Lima', petId: 'p3', petName: 'Bolinha', serviceId: 's1', serviceName: 'Banho Completo', groomerId: 'u4', groomerName: 'Ricardo Alves', date: '2026-08-17', time: '10:30', status: 'EM_ANDAMENTO', notes: '', price: 65 },
  { id: 'a3', clientId: 'u7', clientName: 'Patrícia Nunes', petId: 'p4', petName: 'Luna', serviceId: 's3', serviceName: 'Tosa Completa', groomerId: 'u3', groomerName: 'Fernanda Matos', date: '2026-08-17', time: '14:00', status: 'AGENDADO', notes: 'Tosa padrão labrador', price: 90 },
  { id: 'a4', clientId: 'u1', clientName: 'Ana Beatriz Costa', petId: 'p2', petName: 'Mel', serviceId: 's6', serviceName: 'Spa Felino', groomerId: 'u4', groomerName: 'Ricardo Alves', date: '2026-08-10', time: '11:00', status: 'CONCLUIDO', notes: '', price: 80 },
  { id: 'a5', clientId: 'u1', clientName: 'Ana Beatriz Costa', petId: 'p1', petName: 'Thor', serviceId: 's1', serviceName: 'Banho Completo', groomerId: 'u3', groomerName: 'Fernanda Matos', date: '2026-07-25', time: '09:30', status: 'CONCLUIDO', notes: '', price: 65 },
  { id: 'a6', clientId: 'u2', clientName: 'Carlos Eduardo Lima', petId: 'p3', petName: 'Bolinha', serviceId: 's2', serviceName: 'Tosa Higiênica', groomerId: 'u4', groomerName: 'Ricardo Alves', date: '2026-08-05', time: '15:00', status: 'CANCELADO', notes: 'Tutor desmarcou', price: 45 },
];

export const mockStockLocations: StockLocation[] = [
  { id: 'l1', name: 'Estoque Principal', description: 'Almoxarifado geral do pet shop' },
  { id: 'l2', name: 'Sala de Banho', description: 'Materiais de uso imediato na área de banho' },
  { id: 'l3', name: 'Sala de Tosa', description: 'Equipamentos e materiais de tosa' },
];

export const mockStockItems: StockItem[] = [
  { id: 'i1', locationId: 'l1', locationName: 'Estoque Principal', name: 'Shampoo Premium Neutro', unit: 'litros', quantity: 2.5, criticalQty: 5, category: 'Higiene' },
  { id: 'i2', locationId: 'l1', locationName: 'Estoque Principal', name: 'Condicionador Hidratante', unit: 'litros', quantity: 8, criticalQty: 3, category: 'Higiene' },
  { id: 'i3', locationId: 'l2', locationName: 'Sala de Banho', name: 'Perfume Suave Pet', unit: 'unidades', quantity: 3, criticalQty: 5, category: 'Perfumaria' },
  { id: 'i4', locationId: 'l2', locationName: 'Sala de Banho', name: 'Toalhas de Microfibra', unit: 'unidades', quantity: 12, criticalQty: 8, category: 'Equipamento' },
  { id: 'i5', locationId: 'l3', locationName: 'Sala de Tosa', name: 'Lâmina de Tosa Nº 10', unit: 'unidades', quantity: 0, criticalQty: 2, category: 'Equipamento' },
  { id: 'i6', locationId: 'l3', locationName: 'Sala de Tosa', name: 'Tesoura de Acabamento', unit: 'unidades', quantity: 1, criticalQty: 2, category: 'Equipamento' },
  { id: 'i7', locationId: 'l1', locationName: 'Estoque Principal', name: 'Luvas Descartáveis (cx)', unit: 'caixas', quantity: 6, criticalQty: 2, category: 'EPI' },
  { id: 'i8', locationId: 'l1', locationName: 'Estoque Principal', name: 'Máscara Facial Descartável', unit: 'unidades', quantity: 45, criticalQty: 20, category: 'EPI' },
];

export const mockMovements: StockMovement[] = [
  { id: 'm1', itemId: 'i1', itemName: 'Shampoo Premium Neutro', type: 'SAIDA', quantity: 0.5, date: '2026-08-17', notes: 'Atendimento Thor', userId: 'u3', userName: 'Fernanda Matos' },
  { id: 'm2', itemId: 'i2', itemName: 'Condicionador Hidratante', type: 'ENTRADA', quantity: 5, date: '2026-08-15', notes: 'Reposição de estoque', userId: 'u5', userName: 'Mariana Torres' },
  { id: 'm3', itemId: 'i5', itemName: 'Lâmina de Tosa Nº 10', type: 'SAIDA', quantity: 2, date: '2026-08-12', notes: 'Desgaste natural', userId: 'u4', userName: 'Ricardo Alves' },
];

export const mockMessages: Message[] = [
  { id: 'msg1', fromId: 'u1', fromName: 'Ana Beatriz Costa', toId: 'u5', toName: 'Pet Shop Vitallis', content: 'Olá! Gostaria de saber se posso trazer o Thor mais cedo amanhã, por volta das 8h30?', timestamp: '2026-08-17T09:30:00', read: true },
  { id: 'msg2', fromId: 'u5', fromName: 'Pet Shop Vitallis', toId: 'u1', toName: 'Ana Beatriz Costa', content: 'Bom dia Ana! Claro, pode trazer às 8h30 sem problema. A Fernanda estará aqui para receber o Thor.', timestamp: '2026-08-17T09:45:00', read: true },
  { id: 'msg3', fromId: 'u2', fromName: 'Carlos Eduardo Lima', toId: 'u5', toName: 'Pet Shop Vitallis', content: 'O Bolinha ficou com o pelo muito macio após o banho de hoje! Vocês são demais!', timestamp: '2026-08-17T15:20:00', read: false },
];

export const mockMedicalRecords: MedicalRecord[] = [
  { id: 'mr1', petId: 'p1', date: '2026-07-25', service: 'Banho Completo', groomer: 'Fernanda Matos', notes: 'Pelo em ótimo estado', observations: 'Tutor pediu shampoo neutro. Thor ficou calmo durante todo o atendimento.' },
  { id: 'mr2', petId: 'p1', date: '2026-06-10', service: 'Banho + Tosa', groomer: 'Ricardo Alves', notes: 'Tosa padrão Golden', observations: 'Pequeno sinal de irritação na pata traseira esquerda — orientado tutor a verificar com veterinário.' },
  { id: 'mr3', petId: 'p2', date: '2026-08-10', service: 'Spa Felino', groomer: 'Ricardo Alves', notes: 'Hidratação no pelo', observations: 'Mel ficou um pouco agitada no início mas relaxou. Pelo persa em excelente condição.' },
  { id: 'mr4', petId: 'p3', date: '2026-07-01', service: 'Tosa Higiênica', groomer: 'Fernanda Matos', notes: 'Corte higiênico padrão', observations: 'Bolinha cooperativo. Displasia não afetou o atendimento.' },
];

export function getStockStatus(item: StockItem): 'normal' | 'baixo' | 'critico' | 'sem_estoque' {
  if (item.quantity === 0) return 'sem_estoque';
  if (item.quantity <= item.criticalQty * 0.5) return 'critico';
  if (item.quantity <= item.criticalQty) return 'baixo';
  return 'normal';
}
