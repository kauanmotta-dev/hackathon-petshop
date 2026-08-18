import { env } from '../shared/config/env.js';
import { logger } from './logger/pinoLogger.js';
import { prisma } from './database/prismaClient.js';

import { PrismaUsuarioRepository } from './database/repositories/PrismaUsuarioRepository.js';
import { PrismaAnimalRepository } from './database/repositories/PrismaAnimalRepository.js';
import { PrismaServicoRepository } from './database/repositories/PrismaServicoRepository.js';
import { PrismaAgendamentoRepository } from './database/repositories/PrismaAgendamentoRepository.js';
import { PrismaEstoqueRepository } from './database/repositories/PrismaEstoqueRepository.js';
import { PrismaMaterialRepository } from './database/repositories/PrismaMaterialRepository.js';
import { PrismaMensagemRepository } from './database/repositories/PrismaMensagemRepository.js';

import { BcryptHashProvider } from './security/BcryptHashProvider.js';
import { JwtTokenProvider } from './security/JwtTokenProvider.js';
import { NodeEventDispatcher } from './events/NodeEventDispatcher.js';
import { MensagemNotificationSender } from './notifications/MensagemNotificationSender.js';

import { AgendamentoIniciadoEvent } from '../domain/events/AgendamentoIniciadoEvent.js';
import { AgendamentoFinalizadoEvent } from '../domain/events/AgendamentoFinalizadoEvent.js';

import { CadastrarUsuario } from '../application/usecases/usuario/CadastrarUsuario.js';
import { AutenticarUsuario } from '../application/usecases/usuario/AutenticarUsuario.js';
import { AtribuirFuncaoUsuario } from '../application/usecases/usuario/AtribuirFuncaoUsuario.js';
import { CadastrarTelefoneUsuario } from '../application/usecases/usuario/CadastrarTelefoneUsuario.js';
import { AtualizarUsuario } from '../application/usecases/usuario/AtualizarUsuario.js';
import { ListarUsuarios } from '../application/usecases/usuario/ListarUsuarios.js';
import { ListarEquipe } from '../application/usecases/usuario/ListarEquipe.js';
import { BuscarUsuarioPorId } from '../application/usecases/usuario/BuscarUsuarioPorId.js';
import { AlterarSenha } from '../application/usecases/usuario/AlterarSenha.js';

import { CadastrarAnimal } from '../application/usecases/animal/CadastrarAnimal.js';
import { AtualizarAnimal } from '../application/usecases/animal/AtualizarAnimal.js';
import { ListarAnimaisDoCliente } from '../application/usecases/animal/ListarAnimaisDoCliente.js';
import { RegistrarProntuario } from '../application/usecases/animal/RegistrarProntuario.js';
import { AtualizarProntuario } from '../application/usecases/animal/AtualizarProntuario.js';
import { ConsultarProntuario } from '../application/usecases/animal/ConsultarProntuario.js';

import { CriarServico } from '../application/usecases/servico/CriarServico.js';
import { AtualizarServico } from '../application/usecases/servico/AtualizarServico.js';
import { InativarServico } from '../application/usecases/servico/InativarServico.js';
import { ListarServicos } from '../application/usecases/servico/ListarServicos.js';

import { CriarAgendamento } from '../application/usecases/agendamento/CriarAgendamento.js';
import { AdicionarServicoAoAgendamento } from '../application/usecases/agendamento/AdicionarServicoAoAgendamento.js';
import { AtribuirBanhistaAoAgendamento } from '../application/usecases/agendamento/AtribuirBanhistaAoAgendamento.js';
import { ReagendarAgendamento } from '../application/usecases/agendamento/ReagendarAgendamento.js';
import { CancelarAgendamento } from '../application/usecases/agendamento/CancelarAgendamento.js';
import { ListarAgendamentosDetalhados } from '../application/usecases/agendamento/ListarAgendamentosDetalhados.js';
import { BuscarAgendamentoDetalhado } from '../application/usecases/agendamento/BuscarAgendamentoDetalhado.js';
import { IniciarBanho } from '../application/usecases/agendamento/IniciarBanho.js';
import { FinalizarBanho } from '../application/usecases/agendamento/FinalizarBanho.js';

import { NotificarInicioBanho } from '../application/usecases/notificacao/NotificarInicioBanho.js';
import { NotificarFimBanho } from '../application/usecases/notificacao/NotificarFimBanho.js';
import { ListarNotificacoesDoUsuario } from '../application/usecases/notificacao/ListarNotificacoesDoUsuario.js';

import { CriarEstoque } from '../application/usecases/estoque/CriarEstoque.js';
import { CriarMaterial } from '../application/usecases/estoque/CriarMaterial.js';
import { RegistrarEntradaEstoque } from '../application/usecases/estoque/RegistrarEntradaEstoque.js';
import { RegistrarSaidaEstoque } from '../application/usecases/estoque/RegistrarSaidaEstoque.js';
import { AtribuirUsuarioAoEstoque } from '../application/usecases/estoque/AtribuirUsuarioAoEstoque.js';
import { ConsultarSaldoEstoque } from '../application/usecases/estoque/ConsultarSaldoEstoque.js';
import { ListarEstoques } from '../application/usecases/estoque/ListarEstoques.js';
import { ListarMateriais } from '../application/usecases/estoque/ListarMateriais.js';
import { ListarMovimentacoesEstoque } from '../application/usecases/estoque/ListarMovimentacoesEstoque.js';

import { EnviarMensagem } from '../application/usecases/mensagem/EnviarMensagem.js';
import { ListarConversaDoUsuario } from '../application/usecases/mensagem/ListarConversaDoUsuario.js';
import { MarcarConversaComoLida } from '../application/usecases/mensagem/MarcarConversaComoLida.js';
import { ListarContatosDeMensagens } from '../application/usecases/mensagem/ListarContatosDeMensagens.js';

// Repositórios (adapters do lado da persistência para os ports de domain/repositories)
const usuarioRepository = new PrismaUsuarioRepository(prisma);
const animalRepository = new PrismaAnimalRepository(prisma);
const servicoRepository = new PrismaServicoRepository(prisma);
const agendamentoRepository = new PrismaAgendamentoRepository(prisma);
const estoqueRepository = new PrismaEstoqueRepository(prisma);
const materialRepository = new PrismaMaterialRepository(prisma);
const mensagemRepository = new PrismaMensagemRepository(prisma);

// Providers (adapters para os ports de application/ports)
const hashProvider = new BcryptHashProvider(env.BCRYPT_SALT_ROUNDS);
const tokenProvider = new JwtTokenProvider({ secret: env.JWT_SECRET, expiresIn: env.JWT_EXPIRES_IN });
const eventDispatcher = new NodeEventDispatcher(logger);
const notificationSender = new MensagemNotificationSender({ mensagemRepository });

// Casos de uso — Usuario
const cadastrarUsuario = new CadastrarUsuario({ usuarioRepository, hashProvider });
const autenticarUsuario = new AutenticarUsuario({ usuarioRepository, hashProvider, tokenProvider });
const atribuirFuncaoUsuario = new AtribuirFuncaoUsuario({ usuarioRepository });
const cadastrarTelefoneUsuario = new CadastrarTelefoneUsuario({ usuarioRepository });
const atualizarUsuario = new AtualizarUsuario({ usuarioRepository });
const listarUsuarios = new ListarUsuarios({ usuarioRepository });
const listarEquipe = new ListarEquipe({ usuarioRepository });
const buscarUsuarioPorId = new BuscarUsuarioPorId({ usuarioRepository });
const alterarSenha = new AlterarSenha({ usuarioRepository, hashProvider });

// Casos de uso — Animal
const cadastrarAnimal = new CadastrarAnimal({ animalRepository });
const atualizarAnimal = new AtualizarAnimal({ animalRepository });
const listarAnimaisDoCliente = new ListarAnimaisDoCliente({ animalRepository });
const registrarProntuario = new RegistrarProntuario({ animalRepository });
const atualizarProntuario = new AtualizarProntuario({ animalRepository });
const consultarProntuario = new ConsultarProntuario({ animalRepository });

// Casos de uso — Servico
const criarServico = new CriarServico({ servicoRepository });
const atualizarServico = new AtualizarServico({ servicoRepository });
const inativarServico = new InativarServico({ servicoRepository });
const listarServicos = new ListarServicos({ servicoRepository });

// Casos de uso — Agendamento
const criarAgendamento = new CriarAgendamento({ agendamentoRepository, animalRepository, servicoRepository });
const adicionarServicoAoAgendamento = new AdicionarServicoAoAgendamento({ agendamentoRepository, servicoRepository });
const atribuirBanhistaAoAgendamento = new AtribuirBanhistaAoAgendamento({
  agendamentoRepository,
  usuarioRepository,
  servicoRepository,
});
const reagendarAgendamento = new ReagendarAgendamento({ agendamentoRepository, servicoRepository });
const cancelarAgendamento = new CancelarAgendamento({ agendamentoRepository });
const listarAgendamentosDetalhados = new ListarAgendamentosDetalhados({ agendamentoRepository });
const buscarAgendamentoDetalhado = new BuscarAgendamentoDetalhado({ agendamentoRepository });
const iniciarBanho = new IniciarBanho({ agendamentoRepository, eventDispatcher });
const finalizarBanho = new FinalizarBanho({ agendamentoRepository, eventDispatcher });

// Casos de uso — Notificação
const notificarInicioBanho = new NotificarInicioBanho({ notificationSender, logger });
const notificarFimBanho = new NotificarFimBanho({ notificationSender, logger });
const listarNotificacoesDoUsuario = new ListarNotificacoesDoUsuario({ mensagemRepository });

// Casos de uso — Estoque
const criarEstoque = new CriarEstoque({ estoqueRepository });
const criarMaterial = new CriarMaterial({ materialRepository });
const registrarEntradaEstoque = new RegistrarEntradaEstoque({ estoqueRepository, materialRepository });
const registrarSaidaEstoque = new RegistrarSaidaEstoque({ estoqueRepository, materialRepository });
const atribuirUsuarioAoEstoque = new AtribuirUsuarioAoEstoque({ estoqueRepository, usuarioRepository });
const consultarSaldoEstoque = new ConsultarSaldoEstoque({ estoqueRepository });
const listarEstoques = new ListarEstoques({ estoqueRepository });
const listarMateriais = new ListarMateriais({ materialRepository });
const listarMovimentacoesEstoque = new ListarMovimentacoesEstoque({ estoqueRepository });

// Casos de uso — Mensagem
const enviarMensagem = new EnviarMensagem({ mensagemRepository, usuarioRepository });
const listarConversaDoUsuario = new ListarConversaDoUsuario({ mensagemRepository });
const marcarConversaComoLida = new MarcarConversaComoLida({ mensagemRepository });
const listarContatosDeMensagens = new ListarContatosDeMensagens({ mensagemRepository });

// Épico 6: o disparo da notificação é assíncrono/desacoplado da mudança de
// status do agendamento — assinado aqui, na composition root, para que
// IniciarBanho/FinalizarBanho nunca importem a lógica de notificação.
eventDispatcher.subscribe(AgendamentoIniciadoEvent.NOME, (evento) =>
  notificarInicioBanho.execute({ clienteId: evento.clienteId, agendamentoId: evento.agendamentoId }),
);
eventDispatcher.subscribe(AgendamentoFinalizadoEvent.NOME, (evento) =>
  notificarFimBanho.execute({ clienteId: evento.clienteId, agendamentoId: evento.agendamentoId }),
);

export const container = {
  prisma,
  logger,
  repositories: {
    usuarioRepository,
    animalRepository,
    servicoRepository,
    agendamentoRepository,
    estoqueRepository,
    materialRepository,
    mensagemRepository,
  },
  providers: {
    hashProvider,
    tokenProvider,
    eventDispatcher,
    notificationSender,
  },
  usecases: {
    usuario: {
      cadastrarUsuario,
      autenticarUsuario,
      atribuirFuncaoUsuario,
      cadastrarTelefoneUsuario,
      atualizarUsuario,
      listarUsuarios,
      listarEquipe,
      buscarUsuarioPorId,
      alterarSenha,
    },
    animal: {
      cadastrarAnimal,
      atualizarAnimal,
      listarAnimaisDoCliente,
      registrarProntuario,
      atualizarProntuario,
      consultarProntuario,
    },
    servico: {
      criarServico,
      atualizarServico,
      inativarServico,
      listarServicos,
    },
    agendamento: {
      criarAgendamento,
      adicionarServicoAoAgendamento,
      atribuirBanhistaAoAgendamento,
      reagendarAgendamento,
      cancelarAgendamento,
      listarAgendamentosDetalhados,
      buscarAgendamentoDetalhado,
      iniciarBanho,
      finalizarBanho,
    },
    notificacao: {
      notificarInicioBanho,
      notificarFimBanho,
      listarNotificacoesDoUsuario,
    },
    estoque: {
      criarEstoque,
      criarMaterial,
      registrarEntradaEstoque,
      registrarSaidaEstoque,
      atribuirUsuarioAoEstoque,
      consultarSaldoEstoque,
      listarEstoques,
      listarMateriais,
      listarMovimentacoesEstoque,
    },
    mensagem: {
      enviarMensagem,
      listarConversaDoUsuario,
      marcarConversaComoLida,
      listarContatosDeMensagens,
    },
  },
};
