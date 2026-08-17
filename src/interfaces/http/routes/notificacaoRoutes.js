import { Router } from 'express';
import { NotificacaoController } from '../controllers/NotificacaoController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { asyncHandler } from '../asyncHandler.js';

export function notificacaoRoutes(container) {
  const router = Router();
  const controller = new NotificacaoController(container.usecases);
  const auth = authMiddleware(container.providers.tokenProvider);

  router.get('/', auth, asyncHandler(controller.listarDoUsuario));

  return router;
}
