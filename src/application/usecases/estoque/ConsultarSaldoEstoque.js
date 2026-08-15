import { NotFoundError } from '../../../domain/errors/NotFoundError.js';

export class ConsultarSaldoEstoque {
  constructor({ estoqueRepository }) {
    this.estoqueRepository = estoqueRepository;
  }

  async execute({ estoqueId }) {
    const estoque = await this.estoqueRepository.buscarPorId(estoqueId);
    if (!estoque) throw new NotFoundError('Estoque não encontrado');

    return this.estoqueRepository.listarSaldoPorEstoque(estoqueId);
  }
}
