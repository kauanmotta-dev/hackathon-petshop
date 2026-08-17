import { ValidationError } from '../errors/ValidationError.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class Email {
  #value;

  constructor(value) {
    if (typeof value !== 'string' || !EMAIL_REGEX.test(value.trim())) {
      throw new ValidationError('E-mail inválido');
    }
    this.#value = value.trim().toLowerCase();
  }

  get value() {
    return this.#value;
  }

  equals(other) {
    return other instanceof Email && other.value === this.#value;
  }

  toString() {
    return this.#value;
  }
}
