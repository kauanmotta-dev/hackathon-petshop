# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project state

This repository currently contains **no application code** — only planning artifacts. `README.md` is empty. The only content is entity-relationship diagrams under `.docs/`:

- `.docs/DER Conceitual.drawio` / `.png` — conceptual ER diagram
- `.docs/DER Lógico.drawio` / `.png` — logical ER diagram
- `.docs/DER Físico.png` — physical ER diagram (table/column-level, with types and keys)

The current branch is `feature/backend-implementation`, indicating the backend has not yet been built. There are no build, lint, or test commands to run because no source tree, package manifest, or framework has been chosen yet. When implementation begins, this file should be updated with real commands and architecture notes.

## Domain model

The project is a pet shop / grooming management system ("petshop"), in Portuguese. The physical DER (`.docs/DER Físico.png`) defines the intended schema — treat it as the source of truth for entity design until real migrations/models exist:

- **usuario** — a person (customer or staff) with `nome`, `email` (unique), `senha`, `cpf` (unique).
  - **funcao** — a role (e.g. staff role), linked to `usuario` via the `usuario_funcao` join table (many-to-many).
  - **usuario_telefone** — one-to-many phone numbers per user.
- **animal** — a pet, owned by a `usuario` (`usuario_id`).
  - **prontuario** — one-to-one medical record per animal (`historico`, `vacinas`).
- **agendamento** — a scheduled appointment: `data`, `hora`, `status`, linked to `animal_id`, `cliente_id` (usuario), and `banhista_id` (staff usuario).
  - **agendamento_servico** — join table linking an `agendamento` to one or more `servico` entries.
  - **servico** — a service offered (`nome`, `preco`, `duracao`).
- **estoque** — a stock/inventory location (`nome`).
  - **material** — a material/product (`nome`, `tipo`).
  - **material_estoque** — join table with `quantidade`, linking `material` to `estoque`.
  - **usuario_estoque** — join table linking `usuario` to `estoque` (staff assigned to manage a stock location).
- **mensagem** — a message between two users (`remetente_id` → `destinatario_id`), with `conteudo` and `data_envio`.

Key relationship notes:
- Many-to-many relationships (`usuario_funcao`, `agendamento_servico`, `material_estoque`, `usuario_estoque`) are modeled as explicit join tables with their own surrogate `id`, not composite keys.
- `usuario` is the central entity: it plays the role of pet owner (`animal.usuario_id`), appointment client (`agendamento.cliente_id`), staff/groomer (`agendamento.banhista_id`), and message sender/receiver.

When building the backend, keep new schema/model definitions consistent with this diagram, or update the `.docs` diagrams (and this section) if the design changes.
