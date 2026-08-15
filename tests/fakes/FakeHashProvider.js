import { HashProvider } from '../../src/application/ports/HashProvider.js';

export class FakeHashProvider extends HashProvider {
  async hash(senhaPlana) {
    return `hash:${senhaPlana}`;
  }

  async comparar(senhaPlana, hash) {
    return hash === `hash:${senhaPlana}`;
  }
}
