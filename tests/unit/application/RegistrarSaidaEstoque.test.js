import { describe, it, expect, beforeEach } from '@jest/globals';
import { RegistrarEntradaEstoque } from '../../../src/application/usecases/estoque/RegistrarEntradaEstoque.js';
import { RegistrarSaidaEstoque } from '../../../src/application/usecases/estoque/RegistrarSaidaEstoque.js';
import { InMemoryEstoqueRepository } from '../../fakes/InMemoryEstoqueRepository.js';
import { InMemoryMaterialRepository } from '../../fakes/InMemoryMaterialRepository.js';
import { NotFoundError } from '../../../src/domain/errors/NotFoundError.js';
import { ValidationError } from '../../../src/domain/errors/ValidationError.js';
import { BusinessRuleError } from '../../../src/domain/errors/BusinessRuleError.js';

describe('RegistrarSaidaEstoque / RegistrarEntradaEstoque', () => {
  let estoqueRepository;
  let materialRepository;
  let registrarEntrada;
  let registrarSaida;
  let estoque;
  let material;

  beforeEach(async () => {
    estoqueRepository = new InMemoryEstoqueRepository();
    materialRepository = new InMemoryMaterialRepository();
    registrarEntrada = new RegistrarEntradaEstoque({ estoqueRepository, materialRepository });
    registrarSaida = new RegistrarSaidaEstoque({ estoqueRepository, materialRepository });

    estoque = await estoqueRepository.salvar({ nome: 'Depósito 1' });
    material = await materialRepository.salvar({ nome: 'Shampoo', tipo: 'Higiene' });
  });

  it('registra entrada somando ao saldo existente', async () => {
    await registrarEntrada.execute({ estoqueId: estoque.id, materialId: material.id, quantidade: 10 });
    const saldo = await registrarEntrada.execute({ estoqueId: estoque.id, materialId: material.id, quantidade: 5 });

    expect(saldo.quantidade).toBe(15);
  });

  it('registra saída decrementando o saldo', async () => {
    await registrarEntrada.execute({ estoqueId: estoque.id, materialId: material.id, quantidade: 10 });

    const saldo = await registrarSaida.execute({ estoqueId: estoque.id, materialId: material.id, quantidade: 4 });

    expect(saldo.quantidade).toBe(6);
  });

  it('rejeita saída maior que o saldo disponível sem alterar o saldo', async () => {
    await registrarEntrada.execute({ estoqueId: estoque.id, materialId: material.id, quantidade: 3 });

    await expect(
      registrarSaida.execute({ estoqueId: estoque.id, materialId: material.id, quantidade: 4 }),
    ).rejects.toThrow(BusinessRuleError);

    const saldo = await estoqueRepository.buscarSaldo(estoque.id, material.id);
    expect(saldo.quantidade).toBe(3);
  });

  it('rejeita saída quando não existe saldo registrado para o material', async () => {
    await expect(
      registrarSaida.execute({ estoqueId: estoque.id, materialId: material.id, quantidade: 1 }),
    ).rejects.toThrow(BusinessRuleError);
  });

  it('rejeita quantidade de saída zero ou negativa', async () => {
    await expect(
      registrarSaida.execute({ estoqueId: estoque.id, materialId: material.id, quantidade: 0 }),
    ).rejects.toThrow(ValidationError);
  });

  it('não decrementa duas vezes a mesma quantidade quando duas saídas concorrentes disputam o mesmo saldo', async () => {
    await registrarEntrada.execute({ estoqueId: estoque.id, materialId: material.id, quantidade: 10 });

    const resultados = await Promise.allSettled([
      registrarSaida.execute({ estoqueId: estoque.id, materialId: material.id, quantidade: 7 }),
      registrarSaida.execute({ estoqueId: estoque.id, materialId: material.id, quantidade: 7 }),
    ]);

    const sucesso = resultados.filter((r) => r.status === 'fulfilled');
    const falha = resultados.filter((r) => r.status === 'rejected');

    expect(sucesso).toHaveLength(1);
    expect(falha).toHaveLength(1);

    const saldoFinal = await estoqueRepository.buscarSaldo(estoque.id, material.id);
    expect(saldoFinal.quantidade).toBe(3);
  });

  it('lança NotFoundError quando o estoque não existe', async () => {
    await expect(
      registrarSaida.execute({ estoqueId: 999, materialId: material.id, quantidade: 1 }),
    ).rejects.toThrow(NotFoundError);
  });

  it('lança NotFoundError quando o material não existe', async () => {
    await expect(
      registrarSaida.execute({ estoqueId: estoque.id, materialId: 999, quantidade: 1 }),
    ).rejects.toThrow(NotFoundError);
  });
});
