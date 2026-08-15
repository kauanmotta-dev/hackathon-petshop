import { Email } from '../../../domain/value-objects/Email.js';
import { UnauthorizedError } from '../../../domain/errors/UnauthorizedError.js';

export class AutenticarUsuario {
  constructor({ usuarioRepository, hashProvider, tokenProvider }) {
    this.usuarioRepository = usuarioRepository;
    this.hashProvider = hashProvider;
    this.tokenProvider = tokenProvider;
  }

  async execute({ email, senha }) {
    const emailVo = new Email(email);
    const usuario = await this.usuarioRepository.buscarPorEmail(emailVo.value);

    if (!usuario) {
      throw new UnauthorizedError('E-mail ou senha inválidos');
    }

    const senhaCorreta = await this.hashProvider.comparar(senha, usuario.senhaHash);
    if (!senhaCorreta) {
      throw new UnauthorizedError('E-mail ou senha inválidos');
    }

    const token = this.tokenProvider.gerar({ sub: usuario.id, funcoes: usuario.funcoes });

    return {
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        funcoes: usuario.funcoes,
      },
    };
  }
}
