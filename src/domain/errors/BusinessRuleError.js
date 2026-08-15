import { DomainError } from './DomainError.js';

export class BusinessRuleError extends DomainError {
  constructor(message = 'Regra de negócio violada') {
    super(message, 'BUSINESS_RULE_ERROR');
  }
}
