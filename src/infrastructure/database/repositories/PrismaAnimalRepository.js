import { AnimalRepository } from '../../../domain/repositories/AnimalRepository.js';
import { Animal } from '../../../domain/entities/Animal.js';
import { Prontuario } from '../../../domain/entities/Prontuario.js';

function toDomain(registro) {
  if (!registro) return null;
  return new Animal({
    id: registro.id,
    usuarioId: registro.usuarioId,
    nome: registro.nome,
    especie: registro.especie,
    raca: registro.raca,
    porte: registro.porte,
    dataNascimento: registro.dataNascimento,
    cor: registro.cor,
    observacoes: registro.observacoes,
    condicoes: registro.condicoes,
    prontuario: registro.prontuario ? prontuarioToDomain(registro.prontuario) : null,
  });
}

function prontuarioToDomain(registro) {
  if (!registro) return null;
  return new Prontuario({
    id: registro.id,
    animalId: registro.animalId,
    historico: registro.historico,
    vacinas: registro.vacinas,
  });
}

export class PrismaAnimalRepository extends AnimalRepository {
  constructor(prisma) {
    super();
    this.prisma = prisma;
  }

  async salvar(animal) {
    const criado = await this.prisma.animal.create({
      data: {
        usuarioId: animal.usuarioId,
        nome: animal.nome,
        especie: animal.especie,
        raca: animal.raca,
        porte: animal.porte,
        dataNascimento: animal.dataNascimento,
        cor: animal.cor,
        observacoes: animal.observacoes,
        condicoes: animal.condicoes,
      },
      include: { prontuario: true },
    });
    return toDomain(criado);
  }

  async buscarPorId(id) {
    const registro = await this.prisma.animal.findUnique({
      where: { id: Number(id) },
      include: { prontuario: true },
    });
    return toDomain(registro);
  }

  async listarPorUsuario(usuarioId) {
    const registros = await this.prisma.animal.findMany({
      where: { usuarioId: Number(usuarioId) },
      include: { prontuario: true },
      orderBy: { id: 'asc' },
    });
    return registros.map(toDomain);
  }

  async atualizar(animal) {
    const atualizado = await this.prisma.animal.update({
      where: { id: animal.id },
      data: {
        nome: animal.nome,
        especie: animal.especie,
        raca: animal.raca,
        porte: animal.porte,
        dataNascimento: animal.dataNascimento,
        cor: animal.cor,
        observacoes: animal.observacoes,
        condicoes: animal.condicoes,
      },
      include: { prontuario: true },
    });
    return toDomain(atualizado);
  }

  async salvarProntuario(prontuario) {
    const criado = await this.prisma.prontuario.create({
      data: {
        animalId: prontuario.animalId,
        historico: prontuario.historico,
        vacinas: prontuario.vacinas,
      },
    });
    return prontuarioToDomain(criado);
  }

  async buscarProntuarioPorAnimalId(animalId) {
    const registro = await this.prisma.prontuario.findUnique({ where: { animalId: Number(animalId) } });
    return prontuarioToDomain(registro);
  }

  async atualizarProntuario(prontuario) {
    const atualizado = await this.prisma.prontuario.update({
      where: { id: prontuario.id },
      data: { historico: prontuario.historico, vacinas: prontuario.vacinas },
    });
    return prontuarioToDomain(atualizado);
  }
}
