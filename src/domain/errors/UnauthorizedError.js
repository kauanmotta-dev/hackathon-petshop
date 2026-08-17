import { DomainError } from './DomainError.js';

export class UnauthorizedError extends DomainError {
  constructor(message = 'Não autorizado') {
    super(message, 'UNAUTHORIZED');
  }
}
