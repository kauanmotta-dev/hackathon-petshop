import { ValidationError } from '../errors/ValidationError.js';

function apenasDigitos(value) {
  return String(value).replace(/\D/g, '');
}

function isSequenciaRepetida(digits) {
  return /^(\d)\1{10}$/.test(digits);
}

function calcularDigitoVerificador(digits, multiplicadorInicial) {
  let soma = 0;
  let multiplicador = multiplicadorInicial;
  for (const char of digits) {
    soma += Number(char) * multiplicador;
    multiplicador -= 1;
  }
  const resto = (soma * 10) % 11;
  return resto === 10 ? 0 : resto;
}

function isCpfValido(digits) {
  if (digits.length !== 11 || isSequenciaRepetida(digits)) return false;
  const primeiroDigito = calcularDigitoVerificador(digits.slice(0, 9), 10);
  const segundoDigito = calcularDigitoVerificador(digits.slice(0, 10), 11);
  return primeiroDigito === Number(digits[9]) && segundoDigito === Number(digits[10]);
}

export class Cpf {
  #value;

  constructor(value) {
    const digits = apenasDigitos(value);
    if (!isCpfValido(digits)) {
      throw new ValidationError('CPF inválido');
    }
    this.#value = digits;
  }

  get value() {
    return this.#value;
  }

  equals(other) {
    return other instanceof Cpf && other.value === this.#value;
  }

  toString() {
    return this.#value;
  }
}
