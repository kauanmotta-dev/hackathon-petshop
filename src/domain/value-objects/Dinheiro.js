import { ValidationError } from '../errors/ValidationError.js';

export class Dinheiro {
  #centavos;

  constructor(valorEmReais) {
    const numero = Number(valorEmReais);
    if (Number.isNaN(numero) || numero < 0) {
      throw new ValidationError('Valor monetário inválido: deve ser um número maior ou igual a zero');
    }
    this.#centavos = Math.round(numero * 100);
  }

  get valor() {
    return this.#centavos / 100;
  }

  get centavos() {
    return this.#centavos;
  }

  somar(outro) {
    return new Dinheiro((this.#centavos + outro.centavos) / 100);
  }

  toString() {
    return this.valor.toFixed(2);
  }
}
