import { Servico } from '../../../domain/entities/Servico.js';

export class CriarServico {
  constructor({ servicoRepository }) {
    this.servicoRepository = servicoRepository;
  }

  async execute({ nome, descricao, preco, duracaoMinutos, portes, especies }) {
    const servico = new Servico({ nome, descricao, preco, duracaoMinutos, portes, especies, ativo: true });
    return this.servicoRepository.salvar(servico);
  }
}
