import jwt from 'jsonwebtoken';
import { TokenProvider } from '../../application/ports/TokenProvider.js';
import { UnauthorizedError } from '../../domain/errors/UnauthorizedError.js';

export class JwtTokenProvider extends TokenProvider {
  constructor({ secret, expiresIn = '1h' }) {
    super();
    this.secret = secret;
    this.expiresIn = expiresIn;
  }

  gerar(payload) {
    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn });
  }

  verificar(token) {
    try {
      return jwt.verify(token, this.secret);
    } catch {
      throw new UnauthorizedError('Token inválido ou expirado');
    }
  }
}
