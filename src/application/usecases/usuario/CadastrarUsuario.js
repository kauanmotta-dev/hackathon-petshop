import { Usuario } from '../../../domain/entities/Usuario.js';
import { FuncaoNome } from '../../../domain/entities/Funcao.js';
import { Email } from '../../../domain/value-objects/Email.js';
import { Cpf } from '../../../domain/value-objects/Cpf.js';
import { ValidationError } from '../../../domain/errors/ValidationError.js';
import { ConflictError } from '../../../domain/errors/ConflictError.js';

const SENHA_MIN_LENGTH = 8;

export class CadastrarUsuario {
  constructor({ usuarioRepository, hashProvider }) {
    this.usuarioRepository = usuarioRepository;
    this.hashProvider = hashProvider;
  }

  async execute({ nome, email, senha, cpf }) {
    if (!senha || senha.length < SENHA_MIN_LENGTH) {
      throw new ValidationError(`Senha deve ter ao menos ${SENHA_MIN_LENGTH} caracteres`);
    }

    const emailVo = new Email(email);
    const cpfVo = cpf ? new Cpf(cpf) : null;

    const usuarioExistente = await this.usuarioRepository.buscarPorEmail(emailVo.value);
    if (usuarioExistente) {
      throw new ConflictError('Já existe um usuário cadastrado com este e-mail');
    }

    if (cpfVo) {
      const donoDoCpf = await this.usuarioRepository.buscarPorCpf(cpfVo.value);
      if (donoDoCpf) {
        throw new ConflictError('Já existe um usuário cadastrado com este CPF');
      }
    }

    const senhaHash = await this.hashProvider.hash(senha);

    const usuario = new Usuario({
      nome,
      email: emailVo.value,
      senhaHash,
      cpf: cpfVo ? cpfVo.value : null,
      funcoes: [FuncaoNome.CLIENTE],
    });

    return this.usuarioRepository.salvar(usuario);
  }
}
