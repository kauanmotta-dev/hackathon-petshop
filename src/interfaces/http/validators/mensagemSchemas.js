import { z } from 'zod';

export const enviarMensagemSchema = z.object({
  body: z.object({
    destinatarioId: z.coerce.number().int().positive(),
    conteudo: z.string().min(1),
  }),
});

export const conversaParamSchema = z.object({
  params: z.object({
    usuarioId: z.coerce.number().int().positive(),
  }),
});
