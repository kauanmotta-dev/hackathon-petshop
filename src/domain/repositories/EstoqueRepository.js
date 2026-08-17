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

  async usuarioVinculado(_estoqueId, _usuarioId) {
    throw new Error('EstoqueRepository.usuarioVinculado não implementado');
  }

  async buscarSaldo(_estoqueId, _materialId) {
    throw new Error('EstoqueRepository.buscarSaldo não implementado');
  }

  async listarSaldoPorEstoque(_estoqueId) {
    throw new Error('EstoqueRepository.listarSaldoPorEstoque não implementado');
  }

  /**
   * Incrementa atomicamente o saldo (upsert com incremento em uma única
   * instrução no banco), evitando o lost-update de um ciclo ler→somar→gravar
   * valor absoluto quando duas entradas concorrem pelo mesmo material/estoque.
   */
  async incrementarSaldo(_estoqueId, _materialId, _quantidade) {
    throw new Error('EstoqueRepository.incrementarSaldo não implementado');
  }

  /**
   * Decrementa atomicamente o saldo somente se `quantidade` disponível for
   * suficiente (guarda `WHERE quantidade >= quantidade` no mesmo UPDATE).
   * Retorna o saldo atualizado, ou `null` se não havia saldo suficiente —
   * evita que duas saídas concorrentes leiam o mesmo valor, ambas passem na
   * validação em memória e uma sobrescreva a outra (lost update).
   */
  async decrementarSaldo(_estoqueId, _materialId, _quantidade) {
    throw new Error('EstoqueRepository.decrementarSaldo não implementado');
  }
}
