import { z } from 'zod';

export const criarAgendamentoSchema = z.object({
  body: z.object({
    animalId: z.coerce.number().int().positive(),
    data: z.string().min(1),
    hora: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, 'Hora deve estar no formato HH:mm'),
    servicoIds: z.array(z.coerce.number().int().positive()).min(1),
  }),
});

export const adicionarServicoSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
  body: z.object({
    servicoId: z.coerce.number().int().positive(),
  }),
});

export const atribuirBanhistaSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
  body: z.object({
    banhistaId: z.coerce.number().int().positive(),
  }),
});

export const reagendarSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
  body: z.object({
    data: z.string().min(1),
    hora: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, 'Hora deve estar no formato HH:mm'),
  }),
});

export const agendamentoIdParamSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
});
