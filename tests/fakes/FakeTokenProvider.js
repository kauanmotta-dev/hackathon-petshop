import { TokenProvider } from '../../src/application/ports/TokenProvider.js';

export class FakeTokenProvider extends TokenProvider {
  gerar(payload) {
    return `token:${JSON.stringify(payload)}`;
  }

  verificar(token) {
    return JSON.parse(token.replace(/^token:/, ''));
  }
}
