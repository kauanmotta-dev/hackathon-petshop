import { PrismaClient } from '@prisma/client';
import { env } from '../../../shared/config/env.js';
import { BcryptHashProvider } from '../../security/BcryptHashProvider.js';
import { FuncaoNome } from '../../../domain/entities/Funcao.js';

const prisma = new PrismaClient();
const hashProvider = new BcryptHashProvider(env.BCRYPT_SALT_ROUNDS);

const ADMIN_NOME = process.env.ADMIN_NOME || 'Administrador';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@petshop.com';
const ADMIN_SENHA = process.env.ADMIN_SENHA;

async function main() {
  if (!ADMIN_SENHA) {
    throw new Error('ADMIN_SENHA é obrigatório — defina-o no .env antes de rodar o seed.');
  }

  await Promise.all(
    Object.values(FuncaoNome).map((nome) => prisma.funcao.upsert({ where: { nome }, update: {}, create: { nome } })),
  );
  console.log('Seed de funções concluído: CLIENTE, BANHISTA, ADMIN');

  const funcaoAdmin = await prisma.funcao.findUniqueOrThrow({
    where: { nome: FuncaoNome.ADMIN },
  });

  const senhaHash = await hashProvider.hash(ADMIN_SENHA);
  const admin = await prisma.usuario.upsert({
    where: { email: ADMIN_EMAIL },
    update: {},
    create: { nome: ADMIN_NOME, email: ADMIN_EMAIL, senhaHash },
  });

  await prisma.usuarioFuncao.upsert({
    where: { usuarioId_funcaoId: { usuarioId: admin.id, funcaoId: funcaoAdmin.id } },
    update: {},
    create: { usuarioId: admin.id, funcaoId: funcaoAdmin.id },
  });

  console.log(`Usuário ADMIN pronto: ${ADMIN_EMAIL} (senha definida via ADMIN_SENHA no .env).`);
}

main()
  .catch((erro) => {
    console.error(erro);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
