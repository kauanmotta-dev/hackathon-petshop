import { EventEmitter } from 'node:events';
import { EventDispatcher } from '../../application/ports/EventDispatcher.js';
import { serializarErro } from '../../shared/logging/serializarErro.js';

export class NodeEventDispatcher extends EventDispatcher {
  constructor(logger = console) {
    super();
    this.emitter = new EventEmitter();
    this.logger = logger;
  }

  subscribe(nomeEvento, handler) {
    this.emitter.on(nomeEvento, async (evento) => {
      try {
        await handler(evento);
      } catch (erro) {
        this.logger.error?.({ erro: serializarErro(erro), nomeEvento }, 'Falha ao processar handler de evento de domínio');
      }
    });
  }

  publish(evento) {
    this.emitter.emit(evento.nome, evento);
  }
}
