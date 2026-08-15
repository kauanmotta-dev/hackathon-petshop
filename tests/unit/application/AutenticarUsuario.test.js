import { describe, it, expect, beforeEach } from '@jest/globals';
import { CadastrarUsuario } from '../../../src/application/usecases/usuario/CadastrarUsuario.js';
import { AutenticarUsuario } from '../../../src/application/usecases/usuario/AutenticarUsuario.js';
import { InMemoryUsuarioRepository } from '../../fakes/InMemoryUsuarioRepository.js';
import { FakeHashProvider } from '../../fakes/FakeHashProvider.js';
import { FakeTokenProvider } from '../../fakes/FakeTokenProvider.js';
import { UnauthorizedError } from '../../../src/domain/errors/UnauthorizedError.js';

describe('AutenticarUsuario', () => {
  let usuarioRepository;
  let autenticar;

  beforeEach(async () => {
    usuarioRepository = new InMemoryUsuarioRepository();
    const hashProvider = new FakeHashProvider();
    const cadastrar = new CadastrarUsuario({ usuarioRepository, hashProvider });
    await cadastrar.execute({ nome: 'Ana Silva', email: 'ana@example.com', senha: 'senha1234' });

    autenticar = new AutenticarUsuario({ usuarioRepository, hashProvider, tokenProvider: new FakeTokenProvider() });
  });

  it('retorna um token válido para credenciais corretas', async () => {
    const resultado = await autenticar.execute({ email: 'ana@example.com', senha: 'senha1234' });
    expect(resultado.token).toBeDefined();
    expect(resultado.usuario.email).toBe('ana@example.com');
  });

  it('falha com não autorizado quando a senha está incorreta', async () => {
    await expect(autenticar.execute({ email: 'ana@example.com', senha: 'errada123' })).rejects.toThrow(
      UnauthorizedError,
    );
  });

  it('falha com não autorizado quando o e-mail não existe, sem indicar a causa', async () => {
    await expect(autenticar.execute({ email: 'naoexiste@example.com', senha: 'senha1234' })).rejects.toThrow(
      UnauthorizedError,
    );
  });
});
