/**
 * Port do repositório de Material.
 * @interface
 */
export class MaterialRepository {
  async salvar(_material) {
    throw new Error('MaterialRepository.salvar não implementado');
  }

  async buscarPorId(_id) {
    throw new Error('MaterialRepository.buscarPorId não implementado');
  }

  async listar() {
    throw new Error('MaterialRepository.listar não implementado');
  }
}
