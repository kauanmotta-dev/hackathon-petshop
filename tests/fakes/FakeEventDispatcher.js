import { EventDispatcher } from '../../src/application/ports/EventDispatcher.js';

export class FakeEventDispatcher extends EventDispatcher {
  constructor() {
    super();
    this.publicados = [];
  }

  subscribe() {}

  publish(evento) {
    this.publicados.push(evento);
  }
}
