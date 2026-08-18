import { ForbiddenError } from '../../../domain/errors/ForbiddenError.js';
import { UnauthorizedError } from '../../../domain/errors/UnauthorizedError.js';

export function exigirFuncao(funcoesPermitidas = []) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new UnauthorizedError('Autenticação necessária'));
    }

    const possuiFuncao = req.user.funcoes.some((funcao) => funcoesPermitidas.includes(funcao));
    if (!possuiFuncao) {
      return next(new ForbiddenError(`Acesso restrito aos papéis: ${funcoesPermitidas.join(', ')}`));
    }

    return next();
  };
}
