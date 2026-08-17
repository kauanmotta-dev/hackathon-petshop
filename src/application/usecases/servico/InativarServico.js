import { NotFoundError } from '../../../domain/errors/NotFoundError.js';

export class InativarServico {
  constructor({ servicoRepository }) {
    this.servicoRepository = servicoRepository;
  }

  async execute({ servicoId }) {
    const servico = await this.servicoRepository.buscarPorId(servicoId);
    if (!servico) {
      throw new NotFoundError('Serviço não encontrado');
    }

    servico.inativar();

    return this.servicoRepository.atualizar(servico);
  }
}
