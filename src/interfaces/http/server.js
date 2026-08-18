import { env } from '../../shared/config/env.js';
import { container } from '../../infrastructure/container.js';
import { createApp } from './app.js';
import { serializarErro } from '../../shared/logging/serializarErro.js';

const app = createApp(container);

const server = app.listen(env.PORT, () => {
  container.logger.info(`API Petshop rodando na porta ${env.PORT}`);
});

async function encerrar(sinal) {
  container.logger.info(`Recebido ${sinal}, encerrando servidor...`);
  server.close(async () => {
    await container.prisma.$disconnect();
    process.exit(0);
  });
}

process.on('SIGINT', () => encerrar('SIGINT'));
process.on('SIGTERM', () => encerrar('SIGTERM'));

process.on('unhandledRejection', (erro) => {
  container.logger.error({ erro: serializarErro(erro) }, 'unhandledRejection não tratado');
});
