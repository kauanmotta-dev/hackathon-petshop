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

// Popula req.user quando um Bearer token válido é enviado, mas nunca rejeita a
// requisição — usado por rotas públicas (ex.: catálogo de serviços) que devem
// funcionar tanto para visitantes anônimos quanto para usuários autenticados.
export function optionalAuthMiddleware(tokenProvider) {
  return (req, res, next) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return next();
    }

    const token = header.slice('Bearer '.length).trim();

    try {
      const payload = tokenProvider.verificar(token);
      req.user = { id: payload.sub, funcoes: payload.funcoes ?? [] };
    } catch {
      // Token ausente/expirado/inválido: segue como visitante anônimo.
    }
    return next();
  };
}
