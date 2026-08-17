import { Router } from 'express';
import { ServicoController } from '../controllers/ServicoController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { exigirFuncao } from '../middlewares/exigirFuncao.js';
import { validate } from '../middlewares/validate.js';
import { asyncHandler } from '../asyncHandler.js';
import { FuncaoNome } from '../../../domain/entities/Funcao.js';
import { criarServicoSchema, atualizarServicoSchema, servicoIdParamSchema } from '../validators/servicoSchemas.js';

export function servicoRoutes(container) {
  const router = Router();
  const controller = new ServicoController(container.usecases);
  const auth = authMiddleware(container.providers.tokenProvider);
  const admin = exigirFuncao([FuncaoNome.ADMIN]);

  router.get('/', auth, asyncHandler(controller.listar));
  router.post('/', auth, admin, validate(criarServicoSchema), asyncHandler(controller.criar));
  router.patch('/:id', auth, admin, validate(atualizarServicoSchema), asyncHandler(controller.atualizar));
  router.delete('/:id', auth, admin, validate(servicoIdParamSchema), asyncHandler(controller.inativar));

  return router;
}
