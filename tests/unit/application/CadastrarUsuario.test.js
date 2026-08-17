import { describe, it, expect, beforeEach } from '@jest/globals';
import { CadastrarUsuario } from '../../../src/application/usecases/usuario/CadastrarUsuario.js';
import { InMemoryUsuarioRepository } from '../../fakes/InMemoryUsuarioRepository.js';
import { FakeHashProvider } from '../../fakes/FakeHashProvider.js';
import { ConflictError } from '../../../src/domain/errors/ConflictError.js';
import { ValidationError } from '../../../src/domain/errors/ValidationError.js';
import { FuncaoNome } from '../../../src/domain/entities/Funcao.js';

describe('CadastrarUsuario', () => {
  let usuarioRepository;
  let usecase;

  beforeEach(() => {
    usuarioRepository = new InMemoryUsuarioRepository();
    usecase = new CadastrarUsuario({ usuarioRepository, hashProvider: new FakeHashProvider() });
  });

  it('cadastra um usuário com papel CLIENTE por padrão e senha em hash', async () => {
    const usuario = await usecase.execute({ nome: 'Ana Silva', email: 'ana@example.com', senha: 'senha1234' });

    expect(usuario.id).toBeDefined();
    expect(usuario.funcoes).toEqual([FuncaoNome.CLIENTE]);
    expect(usuario.senhaHash).not.toBe('senha1234');
  });

  it('falha com conflito quando o e-mail já está cadastrado', async () => {
    await usecase.execute({ nome: 'Ana Silva', email: 'ana@example.com', senha: 'senha1234' });

    await expect(
      usecase.execute({ nome: 'Outra Ana', email: 'ana@example.com', senha: 'outrasenha' }),
    ).rejects.toThrow(ConflictError);
  });

  it('falha com conflito quando o CPF já está cadastrado', async () => {
    await usecase.execute({ nome: 'Ana Silva', email: 'ana@example.com', senha: 'senha1234', cpf: '52998224725' });

    await expect(
      usecase.execute({ nome: 'Bia Souza', email: 'bia@example.com', senha: 'senha1234', cpf: '52998224725' }),
    ).rejects.toThrow(ConflictError);
  });

  it('falha quando a senha tem menos de 8 caracteres', async () => {
    await expect(
      usecase.execute({ nome: 'Ana Silva', email: 'ana@example.com', senha: '1234567' }),
    ).rejects.toThrow(ValidationError);
  });
});
