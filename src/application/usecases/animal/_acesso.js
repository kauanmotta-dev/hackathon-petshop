import { ForbiddenError } from '../../../domain/errors/ForbiddenError.js';
import { FuncaoNome } from '../../../domain/entities/Funcao.js';

export function garantirAcessoAoAnimal(animal, { requesterId, requesterFuncoes = [] }) {
  const ehStaff = requesterFuncoes.includes(FuncaoNome.ADMIN) || requesterFuncoes.includes(FuncaoNome.BANHISTA);
  if (!ehStaff && !animal.pertenceA(requesterId)) {
    throw new ForbiddenError('Você não tem acesso a este animal');
  }
}
