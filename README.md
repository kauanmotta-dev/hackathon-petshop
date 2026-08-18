# API Petshop

API REST para gestão de um petshop: cadastro de clientes/pets, catálogo de serviços, agendamento de banhos com controle de conflitos de agenda, execução do atendimento com notificação automática ao cliente, estoque de materiais e mensagens diretas.

Arquitetura em camadas (Clean Architecture) — ver [`Spec.md`](./Spec.md) para o documento de referência completo (épicos, regras de negócio, modelo de domínio e convenções).

## Stack

Node.js (ESM) · Express · PostgreSQL · Prisma · JWT (`jsonwebtoken`) · `bcrypt` · Zod · `pino` · Jest.

## Configuração

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Copie `.env.example` para `.env` e ajuste `DATABASE_URL`, `JWT_SECRET` etc.

   ```bash
   cp .env.example .env
   ```

3. Com o PostgreSQL acessível, gere o client do Prisma e aplique as migrations:

   ```bash
   npm run prisma:generate
   npm run prisma:migrate:deploy   # aplica a migration já versionada em src/infrastructure/database/prisma/migrations
   npm run prisma:seed             # popula a tabela funcao com CLIENTE, BANHISTA, ADMIN
   ```

   > A migration inicial (`20260814000000_init`) já está versionada no repositório — não é necessário banco acessível para gerá-la, apenas para aplicá-la (`migrate:deploy`) ou evoluí-la (`migrate dev`).

4. Suba a API:

   ```bash
   npm start      # produção
   npm run dev    # com reload automático (node --watch)
   ```

   A API sobe em `http://localhost:3000`, com todas as rotas de negócio sob `/api/v1` e um health check em `/health`.

## Testes

Os casos de uso são testados com repositórios in-memory (`tests/fakes`), sem necessidade de banco de dados:

```bash
npm test
```

## Estrutura

```
src/
  domain/          # entidades, value objects, eventos, erros e ports de repositório — sem dependências externas
  application/      # casos de uso (um arquivo por caso de uso) e ports que não são repositório
  infrastructure/    # Prisma, bcrypt, JWT, EventEmitter, logger e a composition root (container.js)
  interfaces/http/   # Express: rotas, controllers, middlewares e schemas de validação (Zod)
  shared/config/      # validação de variáveis de ambiente
tests/
  unit/             # testes de domain e application
  fakes/            # repositórios e providers in-memory usados nos testes
```

Regra de dependência: `domain` não importa nada de fora; `application` só importa de `domain`; `infrastructure`/`interfaces` implementam os ports definidos em `domain`/`application`.

## Endpoints

Todas as rotas abaixo são prefixadas com `/api/v1`. Rotas marcadas com 🔒 exigem header `Authorization: Bearer <token>`; a coluna **Papel** indica restrição adicional de `funcao` além de estar autenticado (`—` = qualquer usuário autenticado).

### Usuários (`/usuarios`)

| Método | Rota | Auth | Papel | Descrição |
| --- | --- | --- | --- | --- |
| POST | `/usuarios` | — | — | Cadastra um novo usuário |
| POST | `/usuarios/login` | — | — | Autentica e retorna o JWT |
| GET | `/usuarios` | 🔒 | ADMIN | Lista usuários |
| PATCH | `/usuarios/:id` | 🔒 | — | Atualiza dados do próprio usuário |
| POST | `/usuarios/:id/funcoes` | 🔒 | ADMIN | Atribui uma função (`CLIENTE`/`BANHISTA`/`ADMIN`) |
| POST | `/usuarios/:id/telefones` | 🔒 | — | Cadastra um telefone |

### Animais (`/animais`)

| Método | Rota | Auth | Papel | Descrição |
| --- | --- | --- | --- | --- |
| POST | `/animais` | 🔒 | — | Cadastra um pet do cliente autenticado |
| GET | `/animais` | 🔒 | — | Lista os pets do cliente autenticado |
| PATCH | `/animais/:id` | 🔒 | — | Atualiza dados do pet |
| POST | `/animais/:id/prontuario` | 🔒 | BANHISTA/ADMIN | Registra o prontuário |
| PATCH | `/animais/:id/prontuario` | 🔒 | BANHISTA/ADMIN | Atualiza o prontuário |
| GET | `/animais/:id/prontuario` | 🔒 | — | Consulta o prontuário |

### Serviços (`/servicos`)

| Método | Rota | Auth | Papel | Descrição |
| --- | --- | --- | --- | --- |
| GET | `/servicos` | 🔒 | — | Lista serviços ativos |
| POST | `/servicos` | 🔒 | ADMIN | Cria um serviço |
| PATCH | `/servicos/:id` | 🔒 | ADMIN | Atualiza um serviço |
| DELETE | `/servicos/:id` | 🔒 | ADMIN | Inativa um serviço (soft delete) |

### Agendamentos (`/agendamentos`)

| Método | Rota | Auth | Papel | Descrição |
| --- | --- | --- | --- | --- |
| POST | `/agendamentos` | 🔒 | — | Cria um agendamento (mínimo 1 serviço) |
| GET | `/agendamentos/cliente` | 🔒 | — | Lista os agendamentos do cliente autenticado |
| GET | `/agendamentos/banhista` | 🔒 | BANHISTA | Lista os agendamentos do banhista autenticado |
| POST | `/agendamentos/:id/servicos` | 🔒 | — | Adiciona um serviço ao agendamento |
| POST | `/agendamentos/:id/banhista` | 🔒 | ADMIN | Atribui um banhista ao agendamento |
| PATCH | `/agendamentos/:id` | 🔒 | — | Reagenda (nova data/hora) |
| POST | `/agendamentos/:id/cancelar` | 🔒 | — | Cancela o agendamento |
| POST | `/agendamentos/:id/iniciar` | 🔒 | BANHISTA/ADMIN | Inicia o atendimento (`AGENDADO → EM_ANDAMENTO`) |
| POST | `/agendamentos/:id/finalizar` | 🔒 | BANHISTA/ADMIN | Finaliza o atendimento e dispara notificação ao cliente |

### Estoques (`/estoques`)

| Método | Rota | Auth | Papel | Descrição |
| --- | --- | --- | --- | --- |
| POST | `/estoques` | 🔒 | ADMIN | Cria um local de estoque |
| POST | `/estoques/materiais` | 🔒 | ADMIN | Cadastra um material |
| POST | `/estoques/:id/entradas` | 🔒 | ADMIN | Registra entrada de material |
| POST | `/estoques/:id/saidas` | 🔒 | ADMIN | Registra saída de material |
| POST | `/estoques/:id/usuarios` | 🔒 | ADMIN | Atribui um usuário responsável pelo estoque |
| GET | `/estoques/:id/saldo` | 🔒 | — | Consulta o saldo de materiais |

### Mensagens (`/mensagens`)

| Método | Rota | Auth | Papel | Descrição |
| --- | --- | --- | --- | --- |
| POST | `/mensagens` | 🔒 | — | Envia uma mensagem direta a outro usuário |
| GET | `/mensagens/:usuarioId` | 🔒 | — | Lista a conversa com um usuário |

### Notificações (`/notificacoes`)

| Método | Rota | Auth | Papel | Descrição |
| --- | --- | --- | --- | --- |
| GET | `/notificacoes` | 🔒 | — | Lista as notificações do usuário autenticado |

### Health check

| Método | Rota | Auth | Descrição |
| --- | --- | --- | --- |
| GET | `/health` | — | Verifica se a API está no ar (fora do prefixo `/api/v1`) |

## Notas sobre o estado atual

- O banco de dados não estava acessível no momento desta implementação. O schema Prisma e a migration inicial foram gerados e versionados (`prisma migrate diff --from-empty`, sem precisar de conexão real), prontos para `prisma migrate deploy` assim que a conexão for restabelecida.
- Notificações (Épico 6) são persistidas via a entidade `Mensagem` (tipo `NOTIFICACAO`) e disparadas de forma desacoplada por um `EventDispatcher` (EventEmitter nativo) — ver `src/infrastructure/container.js` para a assinatura dos handlers.
