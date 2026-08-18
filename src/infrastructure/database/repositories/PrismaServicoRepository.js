import { ServicoRepository } from '../../../domain/repositories/ServicoRepository.js';
import { Servico } from '../../../domain/entities/Servico.js';

function toDomain(registro) {
  if (!registro) return null;
  return new Servico({
    id: registro.id,
    nome: registro.nome,
    descricao: registro.descricao,
    preco: Number(registro.preco),
    duracaoMinutos: registro.duracaoMinutos,
    portes: registro.portes,
    especies: registro.especies,
    ativo: registro.ativo,
  });
}

export class PrismaServicoRepository extends ServicoRepository {
  constructor(prisma) {
    super();
    this.prisma = prisma;
  }

  async salvar(servico) {
    const criado = await this.prisma.servico.create({
      data: {
        nome: servico.nome,
        descricao: servico.descricao,
        preco: servico.preco,
        duracaoMinutos: servico.duracaoMinutos,
        portes: servico.portes,
        especies: servico.especies,
        ativo: servico.ativo,
      },
    });
    return toDomain(criado);
  }

  async buscarPorId(id) {
    const registro = await this.prisma.servico.findUnique({ where: { id: Number(id) } });
    return toDomain(registro);
  }

  async listarAtivos() {
    const registros = await this.prisma.servico.findMany({ where: { ativo: true }, orderBy: { id: 'asc' } });
    return registros.map(toDomain);
  }

  async listar() {
    const registros = await this.prisma.servico.findMany({ orderBy: { id: 'asc' } });
    return registros.map(toDomain);
  }

  async listarPorIds(ids) {
    const registros = await this.prisma.servico.findMany({ where: { id: { in: ids.map(Number) } } });
    return registros.map(toDomain);
  }

  async atualizar(servico) {
    const atualizado = await this.prisma.servico.update({
      where: { id: servico.id },
      data: {
        nome: servico.nome,
        descricao: servico.descricao,
        preco: servico.preco,
        duracaoMinutos: servico.duracaoMinutos,
        portes: servico.portes,
        especies: servico.especies,
        ativo: servico.ativo,
      },
    });
    return toDomain(atualizado);
  }
}
