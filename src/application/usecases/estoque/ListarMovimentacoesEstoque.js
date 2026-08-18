import { NotFoundError } from '../../../domain/errors/NotFoundError.js';
import { ForbiddenError } from '../../../domain/errors/ForbiddenError.js';
import { FuncaoNome } from '../../../domain/entities/Funcao.js';

export class ListarMovimentacoesEstoque {
  constructor({ estoqueRepository }) {
    this.estoqueRepository = estoqueRepository;
  }

  async execute({ estoqueId, requesterId, requesterFuncoes = [] }) {
    const estoque = await this.estoqueRepository.buscarPorId(estoqueId);
    if (!estoque) throw new NotFoundError('Estoque não encontrado');

    const ehAdmin = requesterFuncoes.includes(FuncaoNome.ADMIN);
    if (!ehAdmin) {
      const vinculado = requesterId && (await this.estoqueRepository.usuarioVinculado(estoqueId, requesterId));
      if (!vinculado) {
        throw new ForbiddenError('Você não tem acesso a este estoque');
      }
    }

    return this.estoqueRepository.listarMovimentacoes(estoqueId);
  }
}
