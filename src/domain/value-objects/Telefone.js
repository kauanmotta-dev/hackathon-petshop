import { ValidationError } from '../errors/ValidationError.js';

function apenasDigitos(value) {
  return String(value ?? '').replace(/\D/g, '');
}

export class Telefone {
  #value;

  constructor(value) {
    const digits = apenasDigitos(value);
    if (digits.length < 10 || digits.length > 11) {
      throw new ValidationError('Telefone inválido');
    }
    this.#value = digits;
  }

  get value() {
    return this.#value;
  }

  equals(other) {
    return other instanceof Telefone && other.value === this.#value;
  }

  toString() {
    return this.#value;
  }
}
