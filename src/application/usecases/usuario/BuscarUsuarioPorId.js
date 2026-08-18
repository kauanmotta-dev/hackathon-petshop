import { NotFoundError } from '../../../domain/errors/NotFoundError.js';

export class BuscarUsuarioPorId {
  constructor({ usuarioRepository }) {
    this.usuarioRepository = usuarioRepository;
  }

  async execute({ usuarioId }) {
    const usuario = await this.usuarioRepository.buscarPorId(usuarioId);
    if (!usuario) {
      throw new NotFoundError('Usuário não encontrado');
    }
    return usuario;
  }
}
