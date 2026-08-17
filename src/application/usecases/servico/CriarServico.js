import { Servico } from '../../../domain/entities/Servico.js';

export class CriarServico {
  constructor({ servicoRepository }) {
    this.servicoRepository = servicoRepository;
  }

  async execute({ nome, preco, duracaoMinutos }) {
    const servico = new Servico({ nome, preco, duracaoMinutos, ativo: true });
    return this.servicoRepository.salvar(servico);
  }
}
