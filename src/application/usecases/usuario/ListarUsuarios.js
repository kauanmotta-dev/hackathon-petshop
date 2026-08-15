export class ListarUsuarios {
  constructor({ usuarioRepository }) {
    this.usuarioRepository = usuarioRepository;
  }

  async execute({ page = 1, pageSize = 20 } = {}) {
    return this.usuarioRepository.listar({ page, pageSize });
  }
}
