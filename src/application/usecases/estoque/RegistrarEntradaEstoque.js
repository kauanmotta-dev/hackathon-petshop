import { NotFoundError } from '../../../domain/errors/NotFoundError.js';
import { ValidationError } from '../../../domain/errors/ValidationError.js';

export class RegistrarEntradaEstoque {
  constructor({ estoqueRepository, materialRepository }) {
    this.estoqueRepository = estoqueRepository;
    this.materialRepository = materialRepository;
  }

  async execute({ estoqueId, materialId, quantidade, observacoes, usuarioId }) {
    const estoque = await this.estoqueRepository.buscarPorId(estoqueId);
    if (!estoque) throw new NotFoundError('Estoque não encontrado');

    const material = await this.materialRepository.buscarPorId(materialId);
    if (!material) throw new NotFoundError('Material não encontrado');

    const quantidadeNumerica = Number(quantidade);
    if (!Number.isFinite(quantidadeNumerica) || quantidadeNumerica <= 0) {
      throw new ValidationError('Quantidade de entrada deve ser maior que zero');
    }

    const saldo = await this.estoqueRepository.incrementarSaldo(estoqueId, materialId, quantidadeNumerica);
    await this.estoqueRepository.registrarMovimentacao({
      estoqueId,
      materialId,
      usuarioId,
      tipo: 'ENTRADA',
      quantidade: quantidadeNumerica,
      observacoes,
    });
    return saldo;
  }
}
