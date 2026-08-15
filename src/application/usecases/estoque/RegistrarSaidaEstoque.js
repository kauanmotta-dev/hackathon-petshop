import { MaterialEstoque } from '../../../domain/entities/Material.js';
import { NotFoundError } from '../../../domain/errors/NotFoundError.js';

export class RegistrarSaidaEstoque {
  constructor({ estoqueRepository, materialRepository }) {
    this.estoqueRepository = estoqueRepository;
    this.materialRepository = materialRepository;
  }

  async execute({ estoqueId, materialId, quantidade }) {
    const estoque = await this.estoqueRepository.buscarPorId(estoqueId);
    if (!estoque) throw new NotFoundError('Estoque não encontrado');

    const material = await this.materialRepository.buscarPorId(materialId);
    if (!material) throw new NotFoundError('Material não encontrado');

    let saldo = await this.estoqueRepository.buscarSaldo(estoqueId, materialId);
    if (!saldo) {
      saldo = new MaterialEstoque({ materialId, estoqueId, quantidade: 0 });
    }

    saldo.registrarSaida(Number(quantidade));

    return this.estoqueRepository.salvarSaldo(saldo);
  }
}
