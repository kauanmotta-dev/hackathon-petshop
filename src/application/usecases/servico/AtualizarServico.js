import { NotFoundError } from '../../../domain/errors/NotFoundError.js';

export class AtualizarServico {
  constructor({ servicoRepository }) {
    this.servicoRepository = servicoRepository;
  }

  async execute({ servicoId, nome, preco, duracaoMinutos }) {
    const servico = await this.servicoRepository.buscarPorId(servicoId);
    if (!servico) {
      throw new NotFoundError('Serviço não encontrado');
    }

    servico.atualizar({ nome, preco, duracaoMinutos });

    return this.servicoRepository.atualizar(servico);
  }
}
