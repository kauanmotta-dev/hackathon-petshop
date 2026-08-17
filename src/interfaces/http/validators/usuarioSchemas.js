import { z } from 'zod';

export const cadastrarUsuarioSchema = z.object({
  body: z.object({
    nome: z.string().min(2),
    email: z.string().email(),
    senha: z.string().min(8),
    cpf: z.string().optional(),
  }),
});

export const autenticarUsuarioSchema = z.object({
  body: z.object({
    email: z.string().email(),
    senha: z.string().min(1),
  }),
});

export const atribuirFuncaoSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
  body: z.object({
    funcao: z.enum(['CLIENTE', 'BANHISTA', 'ADMIN']),
  }),
});

export const cadastrarTelefoneSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
  body: z.object({
    telefone: z.string().min(10),
  }),
});

export const atualizarUsuarioSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
  body: z.object({
    nome: z.string().min(2).optional(),
    email: z.string().email().optional(),
    cpf: z.string().optional(),
  }),
});

export const listarUsuariosSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().optional(),
    pageSize: z.coerce.number().int().positive().max(100).optional(),
  }),
});
