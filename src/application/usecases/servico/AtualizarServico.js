import { NotFoundError } from '../../../domain/errors/NotFoundError.js';

export class AtualizarServico {
  constructor({ servicoRepository }) {
    this.servicoRepository = servicoRepository;
  }

  async execute({ servicoId, nome, descricao, preco, duracaoMinutos, portes, especies, ativo }) {
    const servico = await this.servicoRepository.buscarPorId(servicoId);
    if (!servico) {
      throw new NotFoundError('Serviço não encontrado');
    }

    servico.atualizar({ nome, descricao, preco, duracaoMinutos, portes, especies, ativo });

    return this.servicoRepository.atualizar(servico);
  }
}
