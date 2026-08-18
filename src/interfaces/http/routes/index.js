import { Router } from 'express';
import { usuarioRoutes } from './usuarioRoutes.js';
import { animalRoutes } from './animalRoutes.js';
import { servicoRoutes } from './servicoRoutes.js';
import { agendamentoRoutes } from './agendamentoRoutes.js';
import { notificacaoRoutes } from './notificacaoRoutes.js';
import { estoqueRoutes } from './estoqueRoutes.js';
import { mensagemRoutes } from './mensagemRoutes.js';

export function routes(container) {
  const router = Router();

  router.use('/usuarios', usuarioRoutes(container));
  router.use('/animais', animalRoutes(container));
  router.use('/servicos', servicoRoutes(container));
  router.use('/agendamentos', agendamentoRoutes(container));
  router.use('/notificacoes', notificacaoRoutes(container));
  router.use('/estoques', estoqueRoutes(container));
  router.use('/mensagens', mensagemRoutes(container));

  return router;
}
