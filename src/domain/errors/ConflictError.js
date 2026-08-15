import { DomainError } from './DomainError.js';

export class ConflictError extends DomainError {
  constructor(message = 'Conflito de dados') {
    super(message, 'CONFLICT');
  }
}
