import { z } from 'zod';

export const criarServicoSchema = z.object({
  body: z.object({
    nome: z.string().min(1),
    preco: z.coerce.number().min(0),
    duracaoMinutos: z.coerce.number().int().positive(),
  }),
});

export const atualizarServicoSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
  body: z.object({
    nome: z.string().min(1).optional(),
    preco: z.coerce.number().min(0).optional(),
    duracaoMinutos: z.coerce.number().int().positive().optional(),
  }),
});

export const servicoIdParamSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
});
