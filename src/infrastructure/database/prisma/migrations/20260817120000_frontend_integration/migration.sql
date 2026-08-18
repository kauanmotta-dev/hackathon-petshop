-- CreateEnum
CREATE TYPE "TipoMovimentacao" AS ENUM ('ENTRADA', 'SAIDA');

-- AlterTable: usuario
ALTER TABLE "usuario" ADD COLUMN "ativo" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable: animal
ALTER TABLE "animal" ADD COLUMN "porte" TEXT;
ALTER TABLE "animal" ADD COLUMN "data_nascimento" DATE;
ALTER TABLE "animal" ADD COLUMN "cor" TEXT;
ALTER TABLE "animal" ADD COLUMN "observacoes" TEXT NOT NULL DEFAULT '';
ALTER TABLE "animal" ADD COLUMN "condicoes" TEXT NOT NULL DEFAULT '';

-- AlterTable: servico
ALTER TABLE "servico" ADD COLUMN "descricao" TEXT NOT NULL DEFAULT '';
ALTER TABLE "servico" ADD COLUMN "portes" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "servico" ADD COLUMN "especies" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

-- AlterTable: mensagem
ALTER TABLE "mensagem" ADD COLUMN "lida" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable: estoque
ALTER TABLE "estoque" ADD COLUMN "descricao" TEXT NOT NULL DEFAULT '';

-- AlterTable: material
ALTER TABLE "material" ADD COLUMN "unidade" TEXT NOT NULL DEFAULT 'unidades';
ALTER TABLE "material" ADD COLUMN "categoria" TEXT NOT NULL DEFAULT 'Geral';
ALTER TABLE "material" ADD COLUMN "quantidade_critica" DECIMAL(10,2) NOT NULL DEFAULT 0;

-- AlterTable: material_estoque (Int -> Decimal)
ALTER TABLE "material_estoque" ALTER COLUMN "quantidade" SET DATA TYPE DECIMAL(10,2);

-- CreateTable: movimentacao_estoque
CREATE TABLE "movimentacao_estoque" (
    "id" SERIAL NOT NULL,
    "material_id" INTEGER NOT NULL,
    "estoque_id" INTEGER NOT NULL,
    "usuario_id" INTEGER,
    "tipo" "TipoMovimentacao" NOT NULL,
    "quantidade" DECIMAL(10,2) NOT NULL,
    "observacoes" TEXT NOT NULL DEFAULT '',
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "movimentacao_estoque_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "movimentacao_estoque_estoque_id_criado_em_idx" ON "movimentacao_estoque"("estoque_id", "criado_em");

-- AddForeignKey
ALTER TABLE "movimentacao_estoque" ADD CONSTRAINT "movimentacao_estoque_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "material"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimentacao_estoque" ADD CONSTRAINT "movimentacao_estoque_estoque_id_fkey" FOREIGN KEY ("estoque_id") REFERENCES "estoque"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimentacao_estoque" ADD CONSTRAINT "movimentacao_estoque_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
