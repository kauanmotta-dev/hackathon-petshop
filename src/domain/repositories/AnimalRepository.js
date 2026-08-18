/**
 * Port do repositório de Animal.
 * @interface
 */
export class AnimalRepository {
  async salvar(_animal) {
    throw new Error('AnimalRepository.salvar não implementado');
  }

  async buscarPorId(_id) {
    throw new Error('AnimalRepository.buscarPorId não implementado');
  }

  async listarPorUsuario(_usuarioId) {
    throw new Error('AnimalRepository.listarPorUsuario não implementado');
  }

  async atualizar(_animal) {
    throw new Error('AnimalRepository.atualizar não implementado');
  }

  async salvarProntuario(_prontuario) {
    throw new Error('AnimalRepository.salvarProntuario não implementado');
  }

  async buscarProntuarioPorAnimalId(_animalId) {
    throw new Error('AnimalRepository.buscarProntuarioPorAnimalId não implementado');
  }

  async atualizarProntuario(_prontuario) {
    throw new Error('AnimalRepository.atualizarProntuario não implementado');
  }
}
