export const FuncaoNome = Object.freeze({
  CLIENTE: 'CLIENTE',
  BANHISTA: 'BANHISTA',
  ADMIN: 'ADMIN',
});

export class Funcao {
  constructor({ id, nome }) {
    this.id = id;
    this.nome = nome;
  }
}
