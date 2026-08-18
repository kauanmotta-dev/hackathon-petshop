import express from 'express';
import cors from 'cors';
import pinoHttp from 'pino-http';
import { routes } from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { env } from '../../shared/config/env.js';

export function createApp(container) {
  const app = express();

  app.use(cors({ origin: env.CORS_ORIGIN === '*' ? true : env.CORS_ORIGIN.split(',').map((s) => s.trim()) }));
  app.use(express.json());
  app.use(pinoHttp({ logger: container.logger }));

  app.get('/health', (req, res) => res.status(200).json({ data: { status: 'ok' } }));

  app.use('/api/v1', routes(container));

  app.use((req, res) => {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Rota não encontrada', details: [] } });
  });

  app.use(errorHandler(container.logger));

  return app;
}
