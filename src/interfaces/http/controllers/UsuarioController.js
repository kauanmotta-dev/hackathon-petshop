import { FuncaoNome } from '../../../domain/entities/Funcao.js';
import { ForbiddenError } from '../../../domain/errors/ForbiddenError.js';

function serializarUsuario(usuario) {
  return {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    cpf: usuario.cpf,
    funcoes: usuario.funcoes,
    telefones: usuario.telefones,
  };
}

function garantirSelfOuAdmin(req, usuarioId) {
  const ehAdmin = req.user.funcoes.includes(FuncaoNome.ADMIN);
  if (!ehAdmin && Number(req.user.id) !== Number(usuarioId)) {
    throw new ForbiddenError('Você só pode alterar seus próprios dados');
  }
}

export class UsuarioController {
  constructor({ usuario: usecases }) {
    this.usecases = usecases;
  }

  cadastrar = async (req, res) => {
    const usuario = await this.usecases.cadastrarUsuario.execute(req.body);
    res.status(201).json({ data: serializarUsuario(usuario) });
  };

  autenticar = async (req, res) => {
    const resultado = await this.usecases.autenticarUsuario.execute(req.body);
    res.status(200).json({ data: resultado });
  };

  listar = async (req, res) => {
    const { page = 1, pageSize = 20 } = req.query;
    const resultado = await this.usecases.listarUsuarios.execute({ page: Number(page), pageSize: Number(pageSize) });
    res.status(200).json({
      data: resultado.data.map(serializarUsuario),
      meta: resultado.meta,
    });
  };

  atualizar = async (req, res) => {
    garantirSelfOuAdmin(req, req.params.id);
    const usuario = await this.usecases.atualizarUsuario.execute({ usuarioId: req.params.id, ...req.body });
    res.status(200).json({ data: serializarUsuario(usuario) });
  };

  atribuirFuncao = async (req, res) => {
    const usuario = await this.usecases.atribuirFuncaoUsuario.execute({
      usuarioId: req.params.id,
      funcao: req.body.funcao,
    });
    res.status(200).json({ data: serializarUsuario(usuario) });
  };

  cadastrarTelefone = async (req, res) => {
    garantirSelfOuAdmin(req, req.params.id);
    const usuario = await this.usecases.cadastrarTelefoneUsuario.execute({
      usuarioId: req.params.id,
      telefone: req.body.telefone,
    });
    res.status(201).json({ data: serializarUsuario(usuario) });
  };
}
