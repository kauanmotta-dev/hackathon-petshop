import { FuncaoNome } from '../../../domain/entities/Funcao.js';

export class ListarEquipe {
  constructor({ usuarioRepository }) {
    this.usuarioRepository = usuarioRepository;
  }

  async execute() {
    return this.usuarioRepository.listarPorFuncoes([FuncaoNome.ADMIN, FuncaoNome.BANHISTA]);
  }
}
