import { DomainError } from './DomainError.js';

export class NotFoundError extends DomainError {
  constructor(message = 'Recurso não encontrado') {
    super(message, 'NOT_FOUND');
  }
}
