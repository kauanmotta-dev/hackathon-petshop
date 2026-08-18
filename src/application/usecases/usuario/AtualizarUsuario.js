import { NotFoundError } from '../../../domain/errors/NotFoundError.js';
import { ConflictError } from '../../../domain/errors/ConflictError.js';
import { Email } from '../../../domain/value-objects/Email.js';
import { Cpf } from '../../../domain/value-objects/Cpf.js';

export class AtualizarUsuario {
  constructor({ usuarioRepository }) {
    this.usuarioRepository = usuarioRepository;
  }

  async execute({ usuarioId, nome, email, cpf, ativo }) {
    const usuario = await this.usuarioRepository.buscarPorId(usuarioId);
    if (!usuario) {
      throw new NotFoundError('Usuário não encontrado');
    }

    if (email !== undefined) {
      const emailVo = new Email(email);
      if (emailVo.value !== usuario.email) {
        const outroUsuario = await this.usuarioRepository.buscarPorEmail(emailVo.value);
        if (outroUsuario && outroUsuario.id !== usuario.id) {
          throw new ConflictError('Já existe um usuário cadastrado com este e-mail');
        }
        usuario.email = emailVo.value;
      }
    }

    if (cpf !== undefined && cpf !== null) {
      const cpfVo = new Cpf(cpf);
      if (!usuario.cpf || cpfVo.value !== usuario.cpf) {
        const outroUsuario = await this.usuarioRepository.buscarPorCpf(cpfVo.value);
        if (outroUsuario && outroUsuario.id !== usuario.id) {
          throw new ConflictError('Já existe um usuário cadastrado com este CPF');
        }
        usuario.cpf = cpfVo.value;
      }
    }

    if (nome !== undefined) {
      usuario.nome = nome.trim();
    }

    if (ativo !== undefined) {
      usuario.ativo = Boolean(ativo);
    }

    return this.usuarioRepository.atualizar(usuario);
  }
}
