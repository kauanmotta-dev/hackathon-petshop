/**
 * Port para publicação/assinatura de eventos de domínio, desacoplando os
 * casos de uso que emitem eventos (ex.: IniciarBanho) dos handlers que
 * reagem a eles (ex.: NotificarInicioBanho).
 * @interface
 */
export class EventDispatcher {
  subscribe(_nomeEvento, _handler) {
    throw new Error('EventDispatcher.subscribe não implementado');
  }

  publish(_evento) {
    throw new Error('EventDispatcher.publish não implementado');
  }
}
