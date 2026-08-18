/**
 * Port para emissão/verificação de tokens de autenticação (JWT).
 * @interface
 */
export class TokenProvider {
  gerar(_payload) {
    throw new Error('TokenProvider.gerar não implementado');
  }

  verificar(_token) {
    throw new Error('TokenProvider.verificar não implementado');
  }
}
