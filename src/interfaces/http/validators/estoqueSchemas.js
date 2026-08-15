import { z } from 'zod';

export const criarEstoqueSchema = z.object({
  body: z.object({
    nome: z.string().min(1),
  }),
});

export const criarMaterialSchema = z.object({
  body: z.object({
    nome: z.string().min(1),
    tipo: z.string().min(1),
  }),
});

export const movimentacaoEstoqueSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
  body: z.object({
    materialId: z.coerce.number().int().positive(),
    quantidade: z.coerce.number().positive(),
  }),
});

export const atribuirUsuarioEstoqueSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
  body: z.object({
    usuarioId: z.coerce.number().int().positive(),
  }),
});

export const estoqueIdParamSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
});
