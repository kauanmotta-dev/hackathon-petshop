import { describe, it, expect, beforeEach } from '@jest/globals';
import { ConsultarSaldoEstoque } from '../../../src/application/usecases/estoque/ConsultarSaldoEstoque.js';
import { InMemoryEstoqueRepository } from '../../fakes/InMemoryEstoqueRepository.js';
import { NotFoundError } from '../../../src/domain/errors/NotFoundError.js';
import { ForbiddenError } from '../../../src/domain/errors/ForbiddenError.js';
import { FuncaoNome } from '../../../src/domain/entities/Funcao.js';

describe('ConsultarSaldoEstoque', () => {
  let estoqueRepository;
  let usecase;

  beforeEach(() => {
    estoqueRepository = new InMemoryEstoqueRepository();
    usecase = new ConsultarSaldoEstoque({ estoqueRepository });
  });

  it('retorna o saldo quando o requisitante é ADMIN, mesmo sem vínculo com o estoque', async () => {
    const estoque = await estoqueRepository.salvar({ nome: 'Depósito 1' });

    const resultado = await usecase.execute({
      estoqueId: estoque.id,
      requesterId: 999,
      requesterFuncoes: [FuncaoNome.ADMIN],
    });

    expect(resultado).toEqual([]);
  });

  it('retorna o saldo quando o requisitante está vinculado ao estoque via usuario_estoque', async () => {
    const estoque = await estoqueRepository.salvar({ nome: 'Depósito 1' });
    await estoqueRepository.atribuirUsuario(estoque.id, 42);

    await expect(
      usecase.execute({ estoqueId: estoque.id, requesterId: 42, requesterFuncoes: [FuncaoNome.BANHISTA] }),
    ).resolves.toEqual([]);
  });

  it('nega acesso (IDOR) quando o requisitante não é ADMIN nem está vinculado ao estoque', async () => {
    const estoque = await estoqueRepository.salvar({ nome: 'Depósito 1' });

    await expect(
      usecase.execute({ estoqueId: estoque.id, requesterId: 999, requesterFuncoes: [FuncaoNome.CLIENTE] }),
    ).rejects.toThrow(ForbiddenError);
  });

  it('lança NotFoundError quando o estoque não existe', async () => {
    await expect(
      usecase.execute({ estoqueId: 999, requesterId: 1, requesterFuncoes: [FuncaoNome.ADMIN] }),
    ).rejects.toThrow(NotFoundError);
  });
});
