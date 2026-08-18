import { Router } from 'express';
import { MensagemController } from '../controllers/MensagemController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validate.js';
import { asyncHandler } from '../asyncHandler.js';
import { enviarMensagemSchema, conversaParamSchema, marcarLidaSchema } from '../validators/mensagemSchemas.js';

export function mensagemRoutes(container) {
  const router = Router();
  const controller = new MensagemController(container.usecases);
  const auth = authMiddleware(container.providers.tokenProvider);

  router.post('/', auth, validate(enviarMensagemSchema), asyncHandler(controller.enviar));
  router.get('/', auth, asyncHandler(controller.listarContatos));
  router.get('/:usuarioId', auth, validate(conversaParamSchema), asyncHandler(controller.listarConversa));
  router.post('/:usuarioId/lida', auth, validate(marcarLidaSchema), asyncHandler(controller.marcarComoLida));

  return router;
}
