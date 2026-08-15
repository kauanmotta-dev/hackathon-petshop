import { ValidationError } from '../../../domain/errors/ValidationError.js';

export function validate(schema) {
  return (req, res, next) => {
    const resultado = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!resultado.success) {
      const details = resultado.error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      }));
      return next(new ValidationError('Dados de entrada inválidos', details));
    }

    req.body = resultado.data.body ?? req.body;
    req.query = resultado.data.query ?? req.query;
    return next();
  };
}
