/**
 * Port para hashing e verificação de senhas.
 * @interface
 */
export class HashProvider {
  async hash(_senhaPlana) {
    throw new Error('HashProvider.hash não implementado');
  }

  async comparar(_senhaPlana, _hash) {
    throw new Error('HashProvider.comparar não implementado');
  }
}
