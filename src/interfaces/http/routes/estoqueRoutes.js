import { Router } from 'express';
import { EstoqueController } from '../controllers/EstoqueController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { exigirFuncao } from '../middlewares/exigirFuncao.js';
import { validate } from '../middlewares/validate.js';
import { asyncHandler } from '../asyncHandler.js';
import { FuncaoNome } from '../../../domain/entities/Funcao.js';
import {
  criarEstoqueSchema,
  criarMaterialSchema,
  movimentacaoEstoqueSchema,
  atribuirUsuarioEstoqueSchema,
  estoqueIdParamSchema,
} from '../validators/estoqueSchemas.js';

export function estoqueRoutes(container) {
  const router = Router();
  const controller = new EstoqueController(container.usecases);
  const auth = authMiddleware(container.providers.tokenProvider);
  const admin = exigirFuncao([FuncaoNome.ADMIN]);

  router.post('/', auth, admin, validate(criarEstoqueSchema), asyncHandler(controller.criarEstoque));
  router.get('/', auth, admin, asyncHandler(controller.listarEstoques));
  router.get('/materiais', auth, admin, asyncHandler(controller.listarMateriais));
  router.post('/materiais', auth, admin, validate(criarMaterialSchema), asyncHandler(controller.criarMaterial));

  router.post('/:id/entradas', auth, admin, validate(movimentacaoEstoqueSchema), asyncHandler(controller.registrarEntrada));
  router.post('/:id/saidas', auth, admin, validate(movimentacaoEstoqueSchema), asyncHandler(controller.registrarSaida));
  router.post(
    '/:id/usuarios',
    auth,
    admin,
    validate(atribuirUsuarioEstoqueSchema),
    asyncHandler(controller.atribuirUsuario),
  );
  router.get('/:id/saldo', auth, validate(estoqueIdParamSchema), asyncHandler(controller.consultarSaldo));
  router.get('/:id/movimentacoes', auth, validate(estoqueIdParamSchema), asyncHandler(controller.listarMovimentacoes));

  return router;
}
