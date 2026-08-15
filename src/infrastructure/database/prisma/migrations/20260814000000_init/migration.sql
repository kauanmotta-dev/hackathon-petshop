-- CreateEnum
CREATE TYPE "StatusAgendamento" AS ENUM ('AGENDADO', 'EM_ANDAMENTO', 'FINALIZADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "TipoMensagem" AS ENUM ('MANUAL', 'NOTIFICACAO');

-- CreateTable
CREATE TABLE "usuario" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha_hash" TEXT NOT NULL,
    "cpf" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "funcao" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "funcao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuario_funcao" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "funcao_id" INTEGER NOT NULL,

    CONSTRAINT "usuario_funcao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuario_telefone" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "telefone" TEXT NOT NULL,

    CONSTRAINT "usuario_telefone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "animal" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "especie" TEXT NOT NULL,
    "raca" TEXT,

    CONSTRAINT "animal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prontuario" (
    "id" SERIAL NOT NULL,
    "animal_id" INTEGER NOT NULL,
    "historico" TEXT NOT NULL DEFAULT '',
    "vacinas" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "prontuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "servico" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "preco" DECIMAL(10,2) NOT NULL,
    "duracao_minutos" INTEGER NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "servico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agendamento" (
    "id" SERIAL NOT NULL,
    "cliente_id" INTEGER NOT NULL,
    "banhista_id" INTEGER,
    "animal_id" INTEGER NOT NULL,
    "data" DATE NOT NULL,
    "hora" TEXT NOT NULL,
    "status" "StatusAgendamento" NOT NULL DEFAULT 'AGENDADO',

    CONSTRAINT "agendamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agendamento_servico" (
    "id" SERIAL NOT NULL,
    "agendamento_id" INTEGER NOT NULL,
    "servico_id" INTEGER NOT NULL,

    CONSTRAINT "agendamento_servico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "estoque" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "estoque_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "material" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,

    CONSTRAINT "material_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "material_estoque" (
    "id" SERIAL NOT NULL,
    "material_id" INTEGER NOT NULL,
    "estoque_id" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "material_estoque_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuario_estoque" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "estoque_id" INTEGER NOT NULL,

    CONSTRAINT "usuario_estoque_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mensagem" (
    "id" SERIAL NOT NULL,
    "remetente_id" INTEGER,
    "destinatario_id" INTEGER NOT NULL,
    "conteudo" TEXT NOT NULL,
    "tipo" "TipoMensagem" NOT NULL DEFAULT 'MANUAL',
    "data_envio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mensagem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_cpf_key" ON "usuario"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "funcao_nome_key" ON "funcao"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_funcao_usuario_id_funcao_id_key" ON "usuario_funcao"("usuario_id", "funcao_id");

-- CreateIndex
CREATE UNIQUE INDEX "prontuario_animal_id_key" ON "prontuario"("animal_id");

-- CreateIndex
CREATE INDEX "agendamento_banhista_id_data_idx" ON "agendamento"("banhista_id", "data");

-- CreateIndex
CREATE UNIQUE INDEX "agendamento_servico_agendamento_id_servico_id_key" ON "agendamento_servico"("agendamento_id", "servico_id");

-- CreateIndex
CREATE UNIQUE INDEX "material_estoque_material_id_estoque_id_key" ON "material_estoque"("material_id", "estoque_id");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_estoque_usuario_id_estoque_id_key" ON "usuario_estoque"("usuario_id", "estoque_id");

-- CreateIndex
CREATE INDEX "mensagem_destinatario_id_tipo_idx" ON "mensagem"("destinatario_id", "tipo");

-- AddForeignKey
ALTER TABLE "usuario_funcao" ADD CONSTRAINT "usuario_funcao_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_funcao" ADD CONSTRAINT "usuario_funcao_funcao_id_fkey" FOREIGN KEY ("funcao_id") REFERENCES "funcao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_telefone" ADD CONSTRAINT "usuario_telefone_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "animal" ADD CONSTRAINT "animal_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prontuario" ADD CONSTRAINT "prontuario_animal_id_fkey" FOREIGN KEY ("animal_id") REFERENCES "animal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agendamento" ADD CONSTRAINT "agendamento_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agendamento" ADD CONSTRAINT "agendamento_banhista_id_fkey" FOREIGN KEY ("banhista_id") REFERENCES "usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agendamento" ADD CONSTRAINT "agendamento_animal_id_fkey" FOREIGN KEY ("animal_id") REFERENCES "animal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agendamento_servico" ADD CONSTRAINT "agendamento_servico_agendamento_id_fkey" FOREIGN KEY ("agendamento_id") REFERENCES "agendamento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agendamento_servico" ADD CONSTRAINT "agendamento_servico_servico_id_fkey" FOREIGN KEY ("servico_id") REFERENCES "servico"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "material_estoque" ADD CONSTRAINT "material_estoque_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "material"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "material_estoque" ADD CONSTRAINT "material_estoque_estoque_id_fkey" FOREIGN KEY ("estoque_id") REFERENCES "estoque"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_estoque" ADD CONSTRAINT "usuario_estoque_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_estoque" ADD CONSTRAINT "usuario_estoque_estoque_id_fkey" FOREIGN KEY ("estoque_id") REFERENCES "estoque"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mensagem" ADD CONSTRAINT "mensagem_remetente_id_fkey" FOREIGN KEY ("remetente_id") REFERENCES "usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mensagem" ADD CONSTRAINT "mensagem_destinatario_id_fkey" FOREIGN KEY ("destinatario_id") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

