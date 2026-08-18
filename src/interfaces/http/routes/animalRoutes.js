import { Router } from 'express';
import { AnimalController } from '../controllers/AnimalController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { exigirFuncao } from '../middlewares/exigirFuncao.js';
import { validate } from '../middlewares/validate.js';
import { asyncHandler } from '../asyncHandler.js';
import { FuncaoNome } from '../../../domain/entities/Funcao.js';
import {
  cadastrarAnimalSchema,
  atualizarAnimalSchema,
  idParamSchema,
  registrarProntuarioSchema,
  atualizarProntuarioSchema,
} from '../validators/animalSchemas.js';

export function animalRoutes(container) {
  const router = Router();
  const controller = new AnimalController(container.usecases);
  const auth = authMiddleware(container.providers.tokenProvider);
  const equipe = exigirFuncao([FuncaoNome.BANHISTA, FuncaoNome.ADMIN]);

  router.post('/', auth, validate(cadastrarAnimalSchema), asyncHandler(controller.cadastrar));
  router.get('/', auth, asyncHandler(controller.listarDoCliente));
  router.patch('/:id', auth, validate(atualizarAnimalSchema), asyncHandler(controller.atualizar));

  router.post('/:id/prontuario', auth, equipe, validate(registrarProntuarioSchema), asyncHandler(controller.registrarProntuario));
  router.patch('/:id/prontuario', auth, equipe, validate(atualizarProntuarioSchema), asyncHandler(controller.atualizarProntuario));
  router.get('/:id/prontuario', auth, validate(idParamSchema), asyncHandler(controller.consultarProntuario));

  return router;
}
