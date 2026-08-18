import { z } from 'zod';

export const criarEstoqueSchema = z.object({
  body: z.object({
    nome: z.string().min(1),
    descricao: z.string().optional(),
  }),
});

export const criarMaterialSchema = z.object({
  body: z.object({
    nome: z.string().min(1),
    tipo: z.string().min(1),
    unidade: z.string().optional(),
    categoria: z.string().optional(),
    quantidadeCritica: z.coerce.number().min(0).optional(),
  }),
});

export const movimentacaoEstoqueSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
  body: z.object({
    materialId: z.coerce.number().int().positive(),
    quantidade: z.coerce.number().positive(),
    observacoes: z.string().optional(),
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
