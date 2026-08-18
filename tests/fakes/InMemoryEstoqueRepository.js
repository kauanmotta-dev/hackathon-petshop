import { EstoqueRepository } from '../../src/domain/repositories/EstoqueRepository.js';
import { Estoque } from '../../src/domain/entities/Estoque.js';
import { MaterialEstoque } from '../../src/domain/entities/Material.js';

export class InMemoryEstoqueRepository extends EstoqueRepository {
  constructor() {
    super();
    this.estoques = new Map();
    this.saldos = new Map();
    this.vinculos = new Set();
    this.movimentacoes = [];
    this.proximoEstoqueId = 1;
    this.proximoSaldoId = 1;
    this.proximaMovimentacaoId = 1;
  }

  _chaveSaldo(estoqueId, materialId) {
    return `${Number(estoqueId)}:${Number(materialId)}`;
  }

  async salvar(estoque) {
    const id = this.proximoEstoqueId++;
    const salvo = new Estoque({ ...estoque, id });
    this.estoques.set(id, salvo);
    return salvo;
  }

  async buscarPorId(id) {
    return this.estoques.get(Number(id)) ?? null;
  }

  async listar() {
    return [...this.estoques.values()];
  }

  async atribuirUsuario(estoqueId, usuarioId) {
    this.vinculos.add(`${Number(usuarioId)}:${Number(estoqueId)}`);
  }

  async usuarioVinculado(estoqueId, usuarioId) {
    return this.vinculos.has(`${Number(usuarioId)}:${Number(estoqueId)}`);
  }

  async buscarSaldo(estoqueId, materialId) {
    return this.saldos.get(this._chaveSaldo(estoqueId, materialId)) ?? null;
  }

  async listarSaldoPorEstoque(estoqueId) {
    return [...this.saldos.values()].filter((s) => s.estoqueId === Number(estoqueId));
  }

  async incrementarSaldo(estoqueId, materialId, quantidade) {
    const chave = this._chaveSaldo(estoqueId, materialId);
    const atual = this.saldos.get(chave);
    const salvo = new MaterialEstoque({
      id: atual?.id ?? this.proximoSaldoId++,
      materialId: Number(materialId),
      estoqueId: Number(estoqueId),
      quantidade: (atual?.quantidade ?? 0) + quantidade,
    });
    this.saldos.set(chave, salvo);
    return salvo;
  }

  async decrementarSaldo(estoqueId, materialId, quantidade) {
    const chave = this._chaveSaldo(estoqueId, materialId);
    const atual = this.saldos.get(chave);
    if (!atual || atual.quantidade < quantidade) {
      return null;
    }
    const salvo = new MaterialEstoque({
      id: atual.id,
      materialId: atual.materialId,
      estoqueId: atual.estoqueId,
      quantidade: atual.quantidade - quantidade,
    });
    this.saldos.set(chave, salvo);
    return salvo;
  }

  async registrarMovimentacao({ estoqueId, materialId, usuarioId, tipo, quantidade, observacoes }) {
    const registro = {
      id: this.proximaMovimentacaoId++,
      estoqueId: Number(estoqueId),
      materialId: Number(materialId),
      usuarioId: usuarioId ?? null,
      tipo,
      quantidade,
      observacoes: observacoes ?? '',
      criadoEm: new Date(),
    };
    this.movimentacoes.push(registro);
    return registro;
  }

  async listarMovimentacoes(estoqueId) {
    return this.movimentacoes.filter((m) => m.estoqueId === Number(estoqueId));
  }
}
