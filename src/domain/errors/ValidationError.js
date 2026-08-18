import { DomainError } from './DomainError.js';

export class ValidationError extends DomainError {
  constructor(message, details = []) {
    super(message, 'VALIDATION_ERROR');
    this.details = details;
  }
}
