import { Router } from 'express';
import { UsuarioController } from '../controllers/UsuarioController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { exigirFuncao } from '../middlewares/exigirFuncao.js';
import { validate } from '../middlewares/validate.js';
import { asyncHandler } from '../asyncHandler.js';
import { FuncaoNome } from '../../../domain/entities/Funcao.js';
import {
  cadastrarUsuarioSchema,
  autenticarUsuarioSchema,
  atribuirFuncaoSchema,
  cadastrarTelefoneSchema,
  atualizarUsuarioSchema,
  listarUsuariosSchema,
} from '../validators/usuarioSchemas.js';

export function usuarioRoutes(container) {
  const router = Router();
  const controller = new UsuarioController(container.usecases);
  const auth = authMiddleware(container.providers.tokenProvider);

  router.post('/', validate(cadastrarUsuarioSchema), asyncHandler(controller.cadastrar));
  router.post('/login', validate(autenticarUsuarioSchema), asyncHandler(controller.autenticar));

  router.get('/', auth, exigirFuncao([FuncaoNome.ADMIN]), validate(listarUsuariosSchema), asyncHandler(controller.listar));
  router.patch('/:id', auth, validate(atualizarUsuarioSchema), asyncHandler(controller.atualizar));
  router.post(
    '/:id/funcoes',
    auth,
    exigirFuncao([FuncaoNome.ADMIN]),
    validate(atribuirFuncaoSchema),
    asyncHandler(controller.atribuirFuncao),
  );
  router.post('/:id/telefones', auth, validate(cadastrarTelefoneSchema), asyncHandler(controller.cadastrarTelefone));

  return router;
}
