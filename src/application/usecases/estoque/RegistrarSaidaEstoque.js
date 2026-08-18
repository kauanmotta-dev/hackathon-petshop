import { NotFoundError } from '../../../domain/errors/NotFoundError.js';
import { ValidationError } from '../../../domain/errors/ValidationError.js';
import { BusinessRuleError } from '../../../domain/errors/BusinessRuleError.js';

export class RegistrarSaidaEstoque {
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
      throw new ValidationError('Quantidade de saída deve ser maior que zero');
    }

    // Decremento atômico com guarda WHERE quantidade >= X no próprio UPDATE:
    // evita que duas saídas concorrentes leiam o mesmo saldo, ambas passem na
    // validação em memória e uma sobrescreva a outra (lost update / estoque
    // furado silenciosamente).
    const saldoAtualizado = await this.estoqueRepository.decrementarSaldo(estoqueId, materialId, quantidadeNumerica);
    if (!saldoAtualizado) {
      throw new BusinessRuleError('Estoque insuficiente para esta saída');
    }

    await this.estoqueRepository.registrarMovimentacao({
      estoqueId,
      materialId,
      usuarioId,
      tipo: 'SAIDA',
      quantidade: quantidadeNumerica,
      observacoes,
    });

    return saldoAtualizado;
  }
}
