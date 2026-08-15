# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project state

The backend is implemented per [`Spec.md`](./Spec.md) (the authoritative reference — read it in full before making domain/architecture changes). Clean Architecture layers under `src/`: `domain/` (entities, value objects, events, errors, repository ports — no external deps), `application/` (use cases, one file per use case, plus non-repository ports), `infrastructure/` (Prisma repositories, bcrypt/JWT adapters, EventEmitter-based dispatcher, `container.js` composition root), `interfaces/http/` (Express routes/controllers/middlewares/Zod validators). Dependency rule: `domain` imports nothing external; `application` imports only `domain`; `infrastructure`/`interfaces` implement the ports.

**Database connectivity was unavailable during initial implementation.** The Prisma schema (`src/infrastructure/database/prisma/schema.prisma`) and an initial migration (`src/infrastructure/database/prisma/migrations/20260814000000_init`) were generated offline via `prisma migrate diff --from-empty` (no live DB needed for generation) and are already versioned. Nothing has been applied to a real database yet — run `npm run prisma:migrate:deploy` (or `prisma:migrate` to evolve the schema further) once a connection is restored, then `npm run prisma:seed` to seed the `funcao` table (`CLIENTE`, `BANHISTA`, `ADMIN`).

## Commands

```bash
npm install                    # install dependencies
cp .env.example .env           # then set DATABASE_URL / JWT_SECRET

npm run prisma:generate        # generate Prisma client
npm run prisma:migrate         # create/apply a migration in dev (needs live DB)
npm run prisma:migrate:deploy  # apply committed migrations (needs live DB)
npm run prisma:seed            # seed funcao table

npm start                      # run the API (src/interfaces/http/server.js)
npm run dev                    # run with --watch

npm test                       # Jest — unit tests only, in-memory fakes, no DB required
```

All business routes are under `/api/v1` (see `src/interfaces/http/routes/index.js`); `/health` is unauthenticated.

## Domain model

The project is a pet shop / grooming management system ("petshop"), in Portuguese. `Spec.md`'s "Modelo de domínio" section is the source of truth (it supersedes the raw `.docs/` diagrams — a few inconsistencies in the original DERs were resolved there, e.g. `Funcao` no longer carries `usuario_id`, `quantidade` lives on `material_estoque` not `Material`, `Estoque` sits between `Usuario` and `Material`). The physical schema is implemented 1:1 in `schema.prisma`.

- **usuario** — a person (customer or staff) with `nome`, `email` (unique), `senha_hash`, `cpf` (unique, optional).
  - **funcao** — a role (`CLIENTE`, `BANHISTA`, `ADMIN`; seeded, not exposed via API), linked via `usuario_funcao` (N:N).
  - **usuario_telefone** — one-to-many phone numbers per user.
- **animal** — a pet, owned by a `usuario` (`usuario_id`).
  - **prontuario** — 0..1 medical record per animal (`historico`, `vacinas`).
- **agendamento** — a scheduled appointment: `data`, `hora`, `status` (`AGENDADO → EM_ANDAMENTO → FINALIZADO`, or `AGENDADO → CANCELADO`; no other transitions), linked to `animal_id`, `cliente_id` (usuario), and an optional `banhista_id` (staff usuario; required only to transition into `EM_ANDAMENTO`).
  - **agendamento_servico** — join table linking an `agendamento` to one or more `servico` entries (at least 1 required).
  - **servico** — a service offered (`nome`, `preco` ≥ 0, `duracao_minutos` > 0, `ativo` — soft delete).
- **estoque** — a stock/inventory location (`nome`).
  - **material** — a material/product (`nome`, `tipo`).
  - **material_estoque** — join table with `quantidade` (≥ 0), linking `material` to `estoque`.
  - **usuario_estoque** — join table linking `usuario` to `estoque` (staff assigned to manage a stock location).
- **mensagem** — used both for direct messages and system notifications (`tipo`: `MANUAL` | `NOTIFICACAO`), `remetente_id` → `destinatario_id`, `conteudo`, `data_envio`. `remetente_id` is null for system notifications.

Key relationship notes:
- Many-to-many relationships (`usuario_funcao`, `agendamento_servico`, `material_estoque`, `usuario_estoque`) are modeled as explicit join tables with their own surrogate `id`, not composite keys.
- `usuario` is the central entity: pet owner (`animal.usuario_id`), appointment client (`agendamento.cliente_id`), staff/groomer (`agendamento.banhista_id`), and message sender/receiver.
- Starting/finishing a bath (`IniciarBanho`/`FinalizarBanho`) emits a domain event (`AgendamentoIniciadoEvent`/`AgendamentoFinalizadoEvent`) through the `EventDispatcher` port, consumed by notification use cases wired in `container.js` — this keeps the status-transition use cases decoupled from notification delivery (a failed notification must never roll back or block the status change).

When changing schema/model definitions, keep `Spec.md` and `schema.prisma` in sync, and add a new Prisma migration rather than editing the initial one.
