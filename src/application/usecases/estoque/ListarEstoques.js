export class ListarEstoques {
  constructor({ estoqueRepository }) {
    this.estoqueRepository = estoqueRepository;
  }

  async execute() {
    const estoques = await this.estoqueRepository.listar();
    return Promise.all(
      estoques.map(async (estoque) => ({
        ...estoque,
        materiais: await this.estoqueRepository.listarSaldoPorEstoque(estoque.id),
      })),
    );
  }
}
