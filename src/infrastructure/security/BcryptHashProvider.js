import bcrypt from 'bcrypt';
import { HashProvider } from '../../application/ports/HashProvider.js';

export class BcryptHashProvider extends HashProvider {
  constructor(saltRounds = 10) {
    super();
    this.saltRounds = saltRounds;
  }

  async hash(senhaPlana) {
    return bcrypt.hash(senhaPlana, this.saltRounds);
  }

  async comparar(senhaPlana, hash) {
    return bcrypt.compare(senhaPlana, hash);
  }
}
