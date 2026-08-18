import { ServicoRepository } from '../../src/domain/repositories/ServicoRepository.js';
import { Servico } from '../../src/domain/entities/Servico.js';

export class InMemoryServicoRepository extends ServicoRepository {
  constructor() {
    super();
    this.servicos = new Map();
    this.proximoId = 1;
  }

  async salvar(servico) {
    const id = this.proximoId++;
    const salvo = new Servico({ ...servico, id });
    this.servicos.set(id, salvo);
    return salvo;
  }

  async buscarPorId(id) {
    return this.servicos.get(Number(id)) ?? null;
  }

  async listarAtivos() {
    return [...this.servicos.values()].filter((s) => s.ativo);
  }

  async listar() {
    return [...this.servicos.values()];
  }

  async listarPorIds(ids) {
    return ids.map((id) => this.servicos.get(Number(id))).filter(Boolean);
  }

  async atualizar(servico) {
    this.servicos.set(servico.id, servico);
    return servico;
  }
}
