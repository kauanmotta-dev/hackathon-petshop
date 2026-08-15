/**
 * Port do repositório de Estoque (inclui material_estoque e usuario_estoque).
 * @interface
 */
export class EstoqueRepository {
  async salvar(_estoque) {
    throw new Error('EstoqueRepository.salvar não implementado');
  }

  async buscarPorId(_id) {
    throw new Error('EstoqueRepository.buscarPorId não implementado');
  }

  async listar() {
    throw new Error('EstoqueRepository.listar não implementado');
  }

  async atribuirUsuario(_estoqueId, _usuarioId) {
    throw new Error('EstoqueRepository.atribuirUsuario não implementado');
  }

  async buscarSaldo(_estoqueId, _materialId) {
    throw new Error('EstoqueRepository.buscarSaldo não implementado');
  }

  async listarSaldoPorEstoque(_estoqueId) {
    throw new Error('EstoqueRepository.listarSaldoPorEstoque não implementado');
  }

  async salvarSaldo(_materialEstoque) {
    throw new Error('EstoqueRepository.salvarSaldo não implementado');
  }
}
