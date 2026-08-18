import { ValidationError } from '../errors/ValidationError.js';

export const TipoMovimentacao = Object.freeze({
  ENTRADA: 'ENTRADA',
  SAIDA: 'SAIDA',
});

export class MovimentacaoEstoque {
  constructor({ id, materialId, estoqueId, usuarioId = null, tipo, quantidade, observacoes = '', criadoEm = new Date() }) {
    if (!materialId || !estoqueId) {
      throw new ValidationError('Material e estoque são obrigatórios');
    }
    if (!Object.values(TipoMovimentacao).includes(tipo)) {
      throw new ValidationError(`Tipo de movimentação inválido: ${tipo}`);
    }
    if (!Number.isFinite(Number(quantidade)) || Number(quantidade) <= 0) {
      throw new ValidationError('Quantidade da movimentação deve ser maior que zero');
    }

    this.id = id;
    this.materialId = materialId;
    this.estoqueId = estoqueId;
    this.usuarioId = usuarioId;
    this.tipo = tipo;
    this.quantidade = Number(quantidade);
    this.observacoes = observacoes ?? '';
    this.criadoEm = criadoEm;
  }
}
