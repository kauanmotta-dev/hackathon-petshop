import { DomainError } from '../../../domain/errors/DomainError.js';

const STATUS_POR_CODIGO = {
  VALIDATION_ERROR: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  BUSINESS_RULE_ERROR: 422,
};

export function errorHandler(logger = console) {
  // eslint-disable-next-line no-unused-vars
  return (err, req, res, next) => {
    if (err instanceof DomainError) {
      const status = STATUS_POR_CODIGO[err.code] ?? 400;
      return res.status(status).json({
        error: {
          code: err.code,
          message: err.message,
          details: err.details ?? [],
        },
      });
    }

    logger.error?.({ erro: err }, 'Erro não tratado');
    return res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Erro interno do servidor',
        details: [],
      },
    });
  };
}
