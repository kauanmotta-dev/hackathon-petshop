import { UnauthorizedError } from '../../../domain/errors/UnauthorizedError.js';

export function authMiddleware(tokenProvider) {
  return (req, res, next) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return next(new UnauthorizedError('Token de autenticação ausente'));
    }

    const token = header.slice('Bearer '.length).trim();

    try {
      const payload = tokenProvider.verificar(token);
      req.user = { id: payload.sub, funcoes: payload.funcoes ?? [] };
      return next();
    } catch (erro) {
      return next(erro);
    }
  };
}
