import { DomainError } from './DomainError.js';

export class ForbiddenError extends DomainError {
  constructor(message = 'Acesso proibido') {
    super(message, 'FORBIDDEN');
  }
}
