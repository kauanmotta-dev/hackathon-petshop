import { ValidationError } from '../errors/ValidationError.js';
import { Dinheiro } from '../value-objects/Dinheiro.js';

export class Servico {
  constructor({ id, nome, preco, duracaoMinutos, ativo = true }) {
    if (!nome || nome.trim().length < 1) {
      throw new ValidationError('Nome do serviço é obrigatório');
    }
    if (!Number.isFinite(Number(duracaoMinutos)) || Number(duracaoMinutos) <= 0) {
      throw new ValidationError('Duração do serviço deve ser maior que zero');
    }

    this.id = id;
    this.nome = nome.trim();
    this.preco = new Dinheiro(preco).valor;
    this.duracaoMinutos = Number(duracaoMinutos);
    this.ativo = ativo;
  }

  inativar() {
    this.ativo = false;
  }

  atualizar({ nome, preco, duracaoMinutos }) {
    if (nome !== undefined) {
      if (!nome || nome.trim().length < 1) {
        throw new ValidationError('Nome do serviço é obrigatório');
      }
      this.nome = nome.trim();
    }
    if (preco !== undefined) {
      this.preco = new Dinheiro(preco).valor;
    }
    if (duracaoMinutos !== undefined) {
      if (!Number.isFinite(Number(duracaoMinutos)) || Number(duracaoMinutos) <= 0) {
        throw new ValidationError('Duração do serviço deve ser maior que zero');
      }
      this.duracaoMinutos = Number(duracaoMinutos);
    }
  }
}
