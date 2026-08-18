import { EstoqueRepository } from '../../../domain/repositories/EstoqueRepository.js';
import { Estoque } from '../../../domain/entities/Estoque.js';
import { MaterialEstoque } from '../../../domain/entities/Material.js';
import { MovimentacaoEstoque } from '../../../domain/entities/MovimentacaoEstoque.js';

function toDomain(registro) {
  if (!registro) return null;
  return new Estoque({ id: registro.id, nome: registro.nome, descricao: registro.descricao });
}

function movimentacaoToDomain(registro) {
  if (!registro) return null;
  return new MovimentacaoEstoque({
    id: registro.id,
    materialId: registro.materialId,
    estoqueId: registro.estoqueId,
    usuarioId: registro.usuarioId,
    tipo: registro.tipo,
    quantidade: Number(registro.quantidade),
    observacoes: registro.observacoes,
    criadoEm: registro.criadoEm,
  });
}

function saldoToDomain(registro) {
  if (!registro) return null;
  return new MaterialEstoque({
    id: registro.id,
    materialId: registro.materialId,
    estoqueId: registro.estoqueId,
    quantidade: registro.quantidade,
  });
}

export class PrismaEstoqueRepository extends EstoqueRepository {
  constructor(prisma) {
    super();
    this.prisma = prisma;
  }

  async salvar(estoque) {
    const criado = await this.prisma.estoque.create({ data: { nome: estoque.nome, descricao: estoque.descricao } });
    return toDomain(criado);
  }

  async buscarPorId(id) {
    const registro = await this.prisma.estoque.findUnique({ where: { id: Number(id) } });
    return toDomain(registro);
  }

  async listar() {
    const registros = await this.prisma.estoque.findMany({ orderBy: { id: 'asc' } });
    return registros.map(toDomain);
  }

  async atribuirUsuario(estoqueId, usuarioId) {
    return this.prisma.usuarioEstoque.upsert({
      where: { usuarioId_estoqueId: { usuarioId: Number(usuarioId), estoqueId: Number(estoqueId) } },
      update: {},
      create: { usuarioId: Number(usuarioId), estoqueId: Number(estoqueId) },
    });
  }

  async usuarioVinculado(estoqueId, usuarioId) {
    const vinculo = await this.prisma.usuarioEstoque.findUnique({
      where: { usuarioId_estoqueId: { usuarioId: Number(usuarioId), estoqueId: Number(estoqueId) } },
    });
    return Boolean(vinculo);
  }

  async buscarSaldo(estoqueId, materialId) {
    const registro = await this.prisma.materialEstoque.findUnique({
      where: { materialId_estoqueId: { materialId: Number(materialId), estoqueId: Number(estoqueId) } },
    });
    return saldoToDomain(registro);
  }

  async listarSaldoPorEstoque(estoqueId) {
    const registros = await this.prisma.materialEstoque.findMany({
      where: { estoqueId: Number(estoqueId) },
      include: { material: true },
      orderBy: { id: 'asc' },
    });
    return registros.map((registro) => ({
      material: {
        id: registro.material.id,
        nome: registro.material.nome,
        tipo: registro.material.tipo,
        unidade: registro.material.unidade,
        categoria: registro.material.categoria,
        quantidadeCritica: Number(registro.material.quantidadeCritica),
      },
      quantidade: Number(registro.quantidade),
    }));
  }

  async incrementarSaldo(estoqueId, materialId, quantidade) {
    const salvo = await this.prisma.materialEstoque.upsert({
      where: {
        materialId_estoqueId: { materialId: Number(materialId), estoqueId: Number(estoqueId) },
      },
      update: { quantidade: { increment: quantidade } },
      create: { materialId: Number(materialId), estoqueId: Number(estoqueId), quantidade },
    });
    return saldoToDomain(salvo);
  }

  async decrementarSaldo(estoqueId, materialId, quantidade) {
    const resultado = await this.prisma.materialEstoque.updateMany({
      where: {
        materialId: Number(materialId),
        estoqueId: Number(estoqueId),
        quantidade: { gte: quantidade },
      },
      data: { quantidade: { decrement: quantidade } },
    });
    if (resultado.count === 0) {
      return null;
    }
    return this.buscarSaldo(estoqueId, materialId);
  }

  async registrarMovimentacao({ estoqueId, materialId, usuarioId, tipo, quantidade, observacoes }) {
    const criado = await this.prisma.movimentacaoEstoque.create({
      data: {
        estoqueId: Number(estoqueId),
        materialId: Number(materialId),
        usuarioId: usuarioId ? Number(usuarioId) : null,
        tipo,
        quantidade,
        observacoes: observacoes ?? '',
      },
    });
    return movimentacaoToDomain(criado);
  }

  async listarMovimentacoes(estoqueId) {
    const registros = await this.prisma.movimentacaoEstoque.findMany({
      where: { estoqueId: Number(estoqueId) },
      include: { material: true, usuario: { select: { id: true, nome: true } } },
      orderBy: { criadoEm: 'desc' },
    });
    return registros.map((registro) => ({
      ...movimentacaoToDomain(registro),
      materialNome: registro.material.nome,
      unidade: registro.material.unidade,
      usuarioNome: registro.usuario ? registro.usuario.nome : null,
    }));
  }
}
