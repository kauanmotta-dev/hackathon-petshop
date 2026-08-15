import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, 'DATABASE_URL é obrigatória'),
  PORT: z.coerce.number().int().positive().default(3000),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  JWT_SECRET: z.string().min(8, 'JWT_SECRET é obrigatório e deve ter ao menos 8 caracteres'),
  JWT_EXPIRES_IN: z.string().default('1h'),
  BCRYPT_SALT_ROUNDS: z.coerce.number().int().positive().default(10),
  LOG_LEVEL: z.string().default('info'),
});

const resultado = envSchema.safeParse(process.env);

if (!resultado.success) {
  console.error('Configuração de ambiente inválida:');
  console.error(resultado.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = resultado.data;
