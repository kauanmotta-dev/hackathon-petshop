import { UsuarioRepository } from '../../../domain/repositories/UsuarioRepository.js';
import { Usuario } from '../../../domain/entities/Usuario.js';

const INCLUDE_RELACOES = {
  funcoes: { include: { funcao: true } },
  telefones: true,
};

function toDomain(registro) {
  if (!registro) return null;
  return new Usuario({
    id: registro.id,
    nome: registro.nome,
    email: registro.email,
    senhaHash: registro.senhaHash,
    cpf: registro.cpf,
    funcoes: registro.funcoes.map((uf) => uf.funcao.nome),
    telefones: registro.telefones.map((t) => t.telefone),
  });
}

export class PrismaUsuarioRepository extends UsuarioRepository {
  constructor(prisma) {
    super();
    this.prisma = prisma;
  }

  async salvar(usuario) {
    const funcoes = await this.prisma.funcao.findMany({ where: { nome: { in: usuario.funcoes } } });

    const criado = await this.prisma.usuario.create({
      data: {
        nome: usuario.nome,
        email: usuario.email,
        senhaHash: usuario.senhaHash,
        cpf: usuario.cpf,
        funcoes: {
          create: funcoes.map((funcao) => ({ funcao: { connect: { id: funcao.id } } })),
        },
        telefones: {
          create: usuario.telefones.map((telefone) => ({ telefone })),
        },
      },
      include: INCLUDE_RELACOES,
    });

    return toDomain(criado);
  }

  async buscarPorId(id) {
    const registro = await this.prisma.usuario.findUnique({
      where: { id: Number(id) },
      include: INCLUDE_RELACOES,
    });
    return toDomain(registro);
  }

  async buscarPorEmail(email) {
    const registro = await this.prisma.usuario.findUnique({
      where: { email },
      include: INCLUDE_RELACOES,
    });
    return toDomain(registro);
  }

  async buscarPorCpf(cpf) {
    if (!cpf) return null;
    const registro = await this.prisma.usuario.findUnique({
      where: { cpf },
      include: INCLUDE_RELACOES,
    });
    return toDomain(registro);
  }

  async listar({ page = 1, pageSize = 20 } = {}) {
    const skip = (page - 1) * pageSize;
    const [registros, total] = await Promise.all([
      this.prisma.usuario.findMany({ include: INCLUDE_RELACOES, skip, take: pageSize, orderBy: { id: 'asc' } }),
      this.prisma.usuario.count(),
    ]);
    return { data: registros.map(toDomain), meta: { page, pageSize, total } };
  }

  async atualizar(usuario) {
    const funcoesAtuais = await this.prisma.usuarioFuncao.findMany({
      where: { usuarioId: usuario.id },
      include: { funcao: true },
    });
    const nomesAtuais = funcoesAtuais.map((uf) => uf.funcao.nome);
    const novasFuncoes = usuario.funcoes.filter((nome) => !nomesAtuais.includes(nome));

    if (novasFuncoes.length > 0) {
      const funcoes = await this.prisma.funcao.findMany({ where: { nome: { in: novasFuncoes } } });
      await this.prisma.usuarioFuncao.createMany({
        data: funcoes.map((funcao) => ({ usuarioId: usuario.id, funcaoId: funcao.id })),
        skipDuplicates: true,
      });
    }

    const atualizado = await this.prisma.usuario.update({
      where: { id: usuario.id },
      data: {
        nome: usuario.nome,
        email: usuario.email,
        cpf: usuario.cpf,
      },
      include: INCLUDE_RELACOES,
    });

    return toDomain(atualizado);
  }

  async adicionarTelefone(usuarioId, telefone) {
    await this.prisma.usuarioTelefone.create({
      data: { usuarioId: Number(usuarioId), telefone },
    });
    return this.buscarPorId(usuarioId);
  }
}
