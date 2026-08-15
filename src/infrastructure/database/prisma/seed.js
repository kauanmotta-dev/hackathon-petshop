import { PrismaClient } from '@prisma/client';
import { FuncaoNome } from '../../../domain/entities/Funcao.js';

const prisma = new PrismaClient();

async function main() {
  for (const nome of Object.values(FuncaoNome)) {
    await prisma.funcao.upsert({
      where: { nome },
      update: {},
      create: { nome },
    });
  }
  console.log('Seed de funções concluído: CLIENTE, BANHISTA, ADMIN');
}

main()
  .catch((erro) => {
    console.error(erro);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
