import { z } from 'zod';

export const criarServicoSchema = z.object({
  body: z.object({
    nome: z.string().min(1),
    descricao: z.string().optional(),
    preco: z.coerce.number().min(0),
    duracaoMinutos: z.coerce.number().int().positive(),
    portes: z.array(z.string()).optional(),
    especies: z.array(z.string()).optional(),
  }),
});

export const atualizarServicoSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
  body: z.object({
    nome: z.string().min(1).optional(),
    descricao: z.string().optional(),
    preco: z.coerce.number().min(0).optional(),
    duracaoMinutos: z.coerce.number().int().positive().optional(),
    portes: z.array(z.string()).optional(),
    especies: z.array(z.string()).optional(),
    ativo: z.coerce.boolean().optional(),
  }),
});

export const servicoIdParamSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
});
