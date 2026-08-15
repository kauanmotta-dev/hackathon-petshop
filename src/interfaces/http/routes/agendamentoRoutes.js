import { Router } from 'express';
import { AgendamentoController } from '../controllers/AgendamentoController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { exigirFuncao } from '../middlewares/exigirFuncao.js';
import { validate } from '../middlewares/validate.js';
import { asyncHandler } from '../asyncHandler.js';
import { FuncaoNome } from '../../../domain/entities/Funcao.js';
import {
  criarAgendamentoSchema,
  adicionarServicoSchema,
  atribuirBanhistaSchema,
  reagendarSchema,
  agendamentoIdParamSchema,
} from '../validators/agendamentoSchemas.js';

export function agendamentoRoutes(container) {
  const router = Router();
  const controller = new AgendamentoController(container.usecases);
  const auth = authMiddleware(container.providers.tokenProvider);
  const admin = exigirFuncao([FuncaoNome.ADMIN]);
  const equipe = exigirFuncao([FuncaoNome.BANHISTA, FuncaoNome.ADMIN]);

  router.post('/', auth, validate(criarAgendamentoSchema), asyncHandler(controller.criar));
  router.get('/cliente', auth, asyncHandler(controller.listarDoCliente));
  router.get('/banhista', auth, exigirFuncao([FuncaoNome.BANHISTA]), asyncHandler(controller.listarDoBanhista));

  router.post('/:id/servicos', auth, validate(adicionarServicoSchema), asyncHandler(controller.adicionarServico));
  router.post('/:id/banhista', auth, admin, validate(atribuirBanhistaSchema), asyncHandler(controller.atribuirBanhista));
  router.patch('/:id', auth, validate(reagendarSchema), asyncHandler(controller.reagendar));
  router.post('/:id/cancelar', auth, validate(agendamentoIdParamSchema), asyncHandler(controller.cancelar));

  router.post('/:id/iniciar', auth, equipe, validate(agendamentoIdParamSchema), asyncHandler(controller.iniciar));
  router.post('/:id/finalizar', auth, equipe, validate(agendamentoIdParamSchema), asyncHandler(controller.finalizar));

  return router;
}
