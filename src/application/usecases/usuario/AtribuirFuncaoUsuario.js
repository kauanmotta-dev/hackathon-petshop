import { NotFoundError } from '../../../domain/errors/NotFoundError.js';

export class AtribuirFuncaoUsuario {
  constructor({ usuarioRepository }) {
    this.usuarioRepository = usuarioRepository;
  }

  async execute({ usuarioId, funcao }) {
    const usuario = await this.usuarioRepository.buscarPorId(usuarioId);
    if (!usuario) {
      throw new NotFoundError('Usuário não encontrado');
    }

    usuario.adicionarFuncao(funcao);

    return this.usuarioRepository.atualizar(usuario);
  }
}
