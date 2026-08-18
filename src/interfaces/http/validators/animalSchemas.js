import { z } from 'zod';

export const cadastrarAnimalSchema = z.object({
  body: z.object({
    nome: z.string().min(1),
    especie: z.string().min(1),
    raca: z.string().optional(),
    porte: z.string().optional(),
    dataNascimento: z.string().optional(),
    cor: z.string().optional(),
    observacoes: z.string().optional(),
    condicoes: z.string().optional(),
  }),
});

export const atualizarAnimalSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
  body: z.object({
    nome: z.string().min(1).optional(),
    especie: z.string().min(1).optional(),
    raca: z.string().optional(),
    porte: z.string().optional(),
    dataNascimento: z.string().optional(),
    cor: z.string().optional(),
    observacoes: z.string().optional(),
    condicoes: z.string().optional(),
  }),
});

export const idParamSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
});

export const registrarProntuarioSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
  body: z.object({
    historico: z.string().optional(),
    vacinas: z.string().optional(),
  }),
});

export const atualizarProntuarioSchema = registrarProntuarioSchema;
