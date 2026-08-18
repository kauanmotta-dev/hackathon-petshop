import { Mensagem, TipoMensagem } from '../../../domain/entities/Mensagem.js';
import { NotFoundError } from '../../../domain/errors/NotFoundError.js';

export class EnviarMensagem {
  constructor({ mensagemRepository, usuarioRepository }) {
    this.mensagemRepository = mensagemRepository;
    this.usuarioRepository = usuarioRepository;
  }

  async execute({ remetenteId, destinatarioId, conteudo }) {
    const destinatario = await this.usuarioRepository.buscarPorId(destinatarioId);
    if (!destinatario) {
      throw new NotFoundError('Destinatário não encontrado');
    }

    const mensagem = new Mensagem({
      remetenteId,
      destinatarioId,
      conteudo,
      tipo: TipoMensagem.MANUAL,
    });

    return this.mensagemRepository.salvar(mensagem);
  }
}
