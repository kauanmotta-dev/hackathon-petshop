import { UsuarioRepository } from '../../src/domain/repositories/UsuarioRepository.js';
import { Usuario } from '../../src/domain/entities/Usuario.js';

export class InMemoryUsuarioRepository extends UsuarioRepository {
  constructor() {
    super();
    this.usuarios = new Map();
    this.proximoId = 1;
  }

  async salvar(usuario) {
    const id = this.proximoId++;
    const salvo = new Usuario({ ...usuario, id });
    this.usuarios.set(id, salvo);
    return salvo;
  }

  async buscarPorId(id) {
    return this.usuarios.get(Number(id)) ?? null;
  }

  async buscarPorEmail(email) {
    return [...this.usuarios.values()].find((u) => u.email === email) ?? null;
  }

  async buscarPorCpf(cpf) {
    if (!cpf) return null;
    return [...this.usuarios.values()].find((u) => u.cpf === cpf) ?? null;
  }

  async listar({ page = 1, pageSize = 20 } = {}) {
    const todos = [...this.usuarios.values()];
    const inicio = (page - 1) * pageSize;
    return { data: todos.slice(inicio, inicio + pageSize), meta: { page, pageSize, total: todos.length } };
  }

  async atualizar(usuario) {
    this.usuarios.set(usuario.id, usuario);
    return usuario;
  }

  async adicionarTelefone(usuarioId, telefone) {
    const usuario = await this.buscarPorId(usuarioId);
    usuario.adicionarTelefone(telefone);
    return usuario;
  }
}
