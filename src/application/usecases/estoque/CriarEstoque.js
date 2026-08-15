import { Estoque } from '../../../domain/entities/Estoque.js';

export class CriarEstoque {
  constructor({ estoqueRepository }) {
    this.estoqueRepository = estoqueRepository;
  }

  async execute({ nome }) {
    const estoque = new Estoque({ nome });
    return this.estoqueRepository.salvar(estoque);
  }
}
