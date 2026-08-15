import { Router } from 'express';
import { MensagemController } from '../controllers/MensagemController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validate.js';
import { asyncHandler } from '../asyncHandler.js';
import { enviarMensagemSchema, conversaParamSchema } from '../validators/mensagemSchemas.js';

export function mensagemRoutes(container) {
  const router = Router();
  const controller = new MensagemController(container.usecases);
  const auth = authMiddleware(container.providers.tokenProvider);

  router.post('/', auth, validate(enviarMensagemSchema), asyncHandler(controller.enviar));
  router.get('/:usuarioId', auth, validate(conversaParamSchema), asyncHandler(controller.listarConversa));

  return router;
}
