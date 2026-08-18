import { NotFoundError } from '../../../domain/errors/NotFoundError.js';

export class AtribuirUsuarioAoEstoque {
  constructor({ estoqueRepository, usuarioRepository }) {
    this.estoqueRepository = estoqueRepository;
    this.usuarioRepository = usuarioRepository;
  }

  async execute({ estoqueId, usuarioId }) {
    const estoque = await this.estoqueRepository.buscarPorId(estoqueId);
    if (!estoque) throw new NotFoundError('Estoque não encontrado');

    const usuario = await this.usuarioRepository.buscarPorId(usuarioId);
    if (!usuario) throw new NotFoundError('Usuário não encontrado');

    return this.estoqueRepository.atribuirUsuario(estoqueId, usuarioId);
  }
}
