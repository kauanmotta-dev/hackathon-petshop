/**
 * Port do repositório de Usuario. Implementações concretas vivem em infrastructure/database/repositories.
 * @interface
 */
export class UsuarioRepository {
  async salvar(_usuario) {
    throw new Error('UsuarioRepository.salvar não implementado');
  }

  async buscarPorId(_id) {
    throw new Error('UsuarioRepository.buscarPorId não implementado');
  }

  async buscarPorEmail(_email) {
    throw new Error('UsuarioRepository.buscarPorEmail não implementado');
  }

  async buscarPorCpf(_cpf) {
    throw new Error('UsuarioRepository.buscarPorCpf não implementado');
  }

  async listar({ page, pageSize } = {}) {
    throw new Error('UsuarioRepository.listar não implementado');
  }

  async atualizar(_usuario) {
    throw new Error('UsuarioRepository.atualizar não implementado');
  }

  async adicionarTelefone(_usuarioId, _telefone) {
    throw new Error('UsuarioRepository.adicionarTelefone não implementado');
  }
}
