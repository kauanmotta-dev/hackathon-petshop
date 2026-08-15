import { Telefone } from '../../../domain/value-objects/Telefone.js';
import { NotFoundError } from '../../../domain/errors/NotFoundError.js';

export class CadastrarTelefoneUsuario {
  constructor({ usuarioRepository }) {
    this.usuarioRepository = usuarioRepository;
  }

  async execute({ usuarioId, telefone }) {
    const usuario = await this.usuarioRepository.buscarPorId(usuarioId);
    if (!usuario) {
      throw new NotFoundError('Usuário não encontrado');
    }

    const telefoneVo = new Telefone(telefone);

    return this.usuarioRepository.adicionarTelefone(usuarioId, telefoneVo.value);
  }
}
