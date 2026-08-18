import { MaterialRepository } from '../../../domain/repositories/MaterialRepository.js';
import { Material } from '../../../domain/entities/Material.js';

function toDomain(registro) {
  if (!registro) return null;
  return new Material({
    id: registro.id,
    nome: registro.nome,
    tipo: registro.tipo,
    unidade: registro.unidade,
    categoria: registro.categoria,
    quantidadeCritica: Number(registro.quantidadeCritica),
  });
}

export class PrismaMaterialRepository extends MaterialRepository {
  constructor(prisma) {
    super();
    this.prisma = prisma;
  }

  async salvar(material) {
    const criado = await this.prisma.material.create({
      data: {
        nome: material.nome,
        tipo: material.tipo,
        unidade: material.unidade,
        categoria: material.categoria,
        quantidadeCritica: material.quantidadeCritica,
      },
    });
    return toDomain(criado);
  }

  async buscarPorId(id) {
    const registro = await this.prisma.material.findUnique({ where: { id: Number(id) } });
    return toDomain(registro);
  }

  async listar() {
    const registros = await this.prisma.material.findMany({ orderBy: { id: 'asc' } });
    return registros.map(toDomain);
  }
}
