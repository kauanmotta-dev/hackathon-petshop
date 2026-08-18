/**
 * Port do repositório de Servico.
 * @interface
 */
export class ServicoRepository {
  async salvar(_servico) {
    throw new Error('ServicoRepository.salvar não implementado');
  }

  async buscarPorId(_id) {
    throw new Error('ServicoRepository.buscarPorId não implementado');
  }

  async listarAtivos() {
    throw new Error('ServicoRepository.listarAtivos não implementado');
  }

  async listar() {
    throw new Error('ServicoRepository.listar não implementado');
  }

  async listarPorIds(_ids) {
    throw new Error('ServicoRepository.listarPorIds não implementado');
  }

  async atualizar(_servico) {
    throw new Error('ServicoRepository.atualizar não implementado');
  }
}
