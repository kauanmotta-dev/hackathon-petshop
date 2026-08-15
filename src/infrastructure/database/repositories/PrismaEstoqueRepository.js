import { EstoqueRepository } from '../../../domain/repositories/EstoqueRepository.js';
import { Estoque } from '../../../domain/entities/Estoque.js';
import { MaterialEstoque } from '../../../domain/entities/Material.js';

function toDomain(registro) {
  if (!registro) return null;
  return new Estoque({ id: registro.id, nome: registro.nome });
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
    const criado = await this.prisma.estoque.create({ data: { nome: estoque.nome } });
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
      material: { id: registro.material.id, nome: registro.material.nome, tipo: registro.material.tipo },
      quantidade: registro.quantidade,
    }));
  }

  async salvarSaldo(materialEstoque) {
    const salvo = await this.prisma.materialEstoque.upsert({
      where: {
        materialId_estoqueId: {
          materialId: materialEstoque.materialId,
          estoqueId: materialEstoque.estoqueId,
        },
      },
      update: { quantidade: materialEstoque.quantidade },
      create: {
        materialId: materialEstoque.materialId,
        estoqueId: materialEstoque.estoqueId,
        quantidade: materialEstoque.quantidade,
      },
    });
    return saldoToDomain(salvo);
  }
}
