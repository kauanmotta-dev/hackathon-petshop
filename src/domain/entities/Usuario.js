import { ValidationError } from '../errors/ValidationError.js';
import { BusinessRuleError } from '../errors/BusinessRuleError.js';
import { FuncaoNome } from './Funcao.js';

export class Usuario {
  constructor({ id, nome, email, senhaHash, cpf = null, funcoes = [FuncaoNome.CLIENTE], telefones = [] }) {
    if (!nome || nome.trim().length < 2) {
      throw new ValidationError('Nome do usuário deve ter ao menos 2 caracteres');
    }
    if (!senhaHash) {
      throw new ValidationError('Senha do usuário é obrigatória');
    }

    this.id = id;
    this.nome = nome.trim();
    this.email = email;
    this.senhaHash = senhaHash;
    this.cpf = cpf;
    this.funcoes = [...new Set(funcoes)];
    this.telefones = telefones;
  }

  temFuncao(funcao) {
    return this.funcoes.includes(funcao);
  }

  adicionarFuncao(funcao) {
    if (!Object.values(FuncaoNome).includes(funcao)) {
      throw new ValidationError(`Papel inválido: ${funcao}`);
    }
    if (this.temFuncao(funcao)) {
      throw new BusinessRuleError(`Usuário já possui o papel ${funcao}`);
    }
    this.funcoes.push(funcao);
  }

  adicionarTelefone(telefone) {
    this.telefones.push(telefone);
  }
}
