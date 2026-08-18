import { NotFoundError } from '../../../domain/errors/NotFoundError.js';
import { UnauthorizedError } from '../../../domain/errors/UnauthorizedError.js';
import { ValidationError } from '../../../domain/errors/ValidationError.js';

const SENHA_MIN_LENGTH = 8;

export class AlterarSenha {
  constructor({ usuarioRepository, hashProvider }) {
    this.usuarioRepository = usuarioRepository;
    this.hashProvider = hashProvider;
  }

  async execute({ usuarioId, senhaAtual, novaSenha }) {
    if (!novaSenha || novaSenha.length < SENHA_MIN_LENGTH) {
      throw new ValidationError(`Nova senha deve ter ao menos ${SENHA_MIN_LENGTH} caracteres`);
    }

    const usuario = await this.usuarioRepository.buscarPorId(usuarioId);
    if (!usuario) {
      throw new NotFoundError('Usuário não encontrado');
    }

    const senhaCorreta = await this.hashProvider.comparar(senhaAtual, usuario.senhaHash);
    if (!senhaCorreta) {
      throw new UnauthorizedError('Senha atual incorreta');
    }

    const novaSenhaHash = await this.hashProvider.hash(novaSenha);
    return this.usuarioRepository.atualizarSenha(usuario.id, novaSenhaHash);
  }
}
