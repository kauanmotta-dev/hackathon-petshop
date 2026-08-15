# Revisão de Backend — API Petshop

> Revisão técnica do backend (Node.js/Express/Prisma, Clean Architecture) feita contra `Spec.md`, sob a ótica de uma banca de hackathon. Achados priorizados por impacto: bloqueadores primeiro, depois importantes, depois polish. Cada item traz o arquivo, o porquê importa e o caminho de correção.

Data da revisão: 2026-08-14 · Branch: `feature/backend-implementation`

---

## 🔴 Bloqueadores

Corrigir antes de apresentar — bug, falha de segurança ou regra de negócio quebrada.

### 1. IDOR em `ConsultarSaldoEstoque`
Qualquer usuário autenticado (mesmo `CLIENTE`) consegue ler o saldo de **qualquer** estoque só sabendo o `id`.

- `src/interfaces/http/routes/estoqueRoutes.js:34` — a rota `GET /estoques/:id/saldo` só exige `auth`, sem checar vínculo com o estoque.
- `src/interfaces/http/controllers/EstoqueController.js` — `consultarSaldo` nem repassa `req.user.id` para o use case.
- `src/application/usecases/estoque/ConsultarSaldoEstoque.js` — nunca valida se o requisitante está em `usuario_estoque`.

O `Spec.md` (Épico 7) é explícito: só quem está atribuído ao estoque pode consultar. Corrija passando `requesterId` ao use case e verificando o vínculo `usuario_estoque` antes de retornar dados. É o tipo de furo que uma banca acha em 30 segundos testando com um usuário `CLIENTE` comum.

### 2. Race condition no conflito de agenda (double-booking)
`src/application/usecases/agendamento/_conflito.js` faz um `SELECT` (agendamentos ativos do banhista no intervalo) seguido de um `UPDATE` separado — sem transação, lock ou constraint no banco. `schema.prisma` só tem `@@index([banhistaId, data])`, um índice, não uma constraint de exclusão.

Duas atribuições concorrentes ao mesmo banhista no mesmo horário podem ambas passar na validação e ambas serem persistidas — quebrando exatamente a garantia central do Épico 4 ("dois agendamentos do mesmo banhista não podem se sobrepor"). Se a banca simular duas requisições simultâneas, isso cai.

**Correção**: envolver leitura + escrita em `prisma.$transaction` com lock, ou (melhor) adicionar uma constraint de exclusão no Postgres sobre `(banhistaId, faixa_de_tempo)`.

### 3. Race condition / lost-update no estoque
`src/application/usecases/estoque/RegistrarSaidaEstoque.js` lê o saldo, decrementa em memória, e `PrismaEstoqueRepository.salvarSaldo` (`src/infrastructure/database/repositories/PrismaEstoqueRepository.js:68-84`) faz um upsert gravando o valor **absoluto** calculado a partir dessa leitura — sem transação e sem `WHERE quantidade >= X`.

Duas saídas concorrentes podem ambas passar na validação de "não pode ficar negativo" e a última escrita sobrescreve a outra — o estoque fica furado silenciosamente, sem nunca gravar um número negativo (por isso nem aparece como erro óbvio em teste manual).

**Correção**: usar `update({ data: { quantidade: { decrement: qty } } })` com guarda no `WHERE quantidade >= qty`, dentro de transação.

### 4. `FinalizarBanho` sem nenhum teste
Zero cobertura para a transição `EM_ANDAMENTO → FINALIZADO`, para a rejeição de estados inválidos, e para a checagem de autorização desse caso de uso (`src/application/usecases/agendamento/FinalizarBanho.js`). É o núcleo do Épico 5 e está inteiramente não testado — se a banca perguntar "como vocês garantem que só o banhista responsável finaliza", não há prova automatizada.

### 5. Seed não cria um ADMIN inicial
`src/infrastructure/database/prisma/seed.js` só popula a tabela `funcao` (`CLIENTE`, `BANHISTA`, `ADMIN`). Como `AtribuirFuncaoUsuario` é ADMIN-only, depois de rodar o seed do zero **não existe caminho para promover o primeiro usuário a ADMIN** sem mexer direto no banco.

Numa demo ao vivo isso trava a apresentação de qualquer fluxo administrativo (criar serviço, criar estoque, atribuir função). Adicione um usuário ADMIN semente (ou um script/flag de bootstrap) antes da apresentação.

---

## 🟡 Importantes

Não quebram a demo sozinhos, mas um avaliador técnico vai notar.

- **`validate.js` não reatribui `req.params` após a coerção do Zod** (`src/interfaces/http/middlewares/validate.js:19-21`) — `req.body`/`req.query` são substituídos pelo resultado parseado, mas `req.params` não, então o `z.coerce.number()` nos schemas de `:id` é descartado e o controller recebe a string original do Express. Funciona hoje por coerção implícita downstream, mas é uma bomba-relógio para bugs de `===` contra número vindo do Prisma.
- **`AtualizarProntuario` não checa acesso no próprio use case** — diferente de `ConsultarProntuario`/`AtualizarAnimal`, não chama `src/application/usecases/animal/_acesso.js`. Hoje não é explorável porque a rota já restringe a `BANHISTA`/`ADMIN`, mas quebra o padrão de defesa em profundidade dos demais use cases — se a rota mudar no futuro, o buraco reabre sem ninguém notar no código do use case.
- **24 dos 37 use cases sem teste algum**, incluindo `RegistrarSaidaEstoque` (a regra de saldo negativo, ver bloqueador #3) e todo `_acesso.js` de animal/prontuário (a regra de IDOR do Épico 2 não tem prova automatizada).
- **`npm test` quebra em Git Bash no Windows** — o shim `.bin/jest` falha com `SyntaxError` nesse shell; funciona normalmente em PowerShell/cmd. Se algum avaliador tentar rodar em outro shell, parece que os testes não existem.
- **Sem `process.on('unhandledRejection')`** — os handlers de notificação (`NotificarInicioBanho`/`NotificarFimBanho`) rodam fora do ciclo request/response via `EventDispatcher`, fora da cobertura do `asyncHandler`. Já se auto-protegem com try/catch interno, então não é urgente, mas uma rede de segurança no nível do processo é barata.
- **`JWT_SECRET` só exige 8 caracteres** (`src/shared/config/env.js:8`) — fraco para segredo de assinatura. Suba para ≥32.
- **Nitpick**: `ReagendarAgendamento.js` muta a entidade em memória antes de validar se a nova data é passado — inofensivo hoje, mas inverta a ordem por consistência com `CriarAgendamento`.

---

## 🟢 Melhorias opcionais

- Em `AgendamentoController`/`AnimalController`/`MensagemController`, o padrão `{ clienteId: req.user.id, ...req.body }` funciona hoje porque os schemas Zod não declaram esses campos (o spread nunca sobrescreve), mas é frágil — inverta para `{ ...req.body, clienteId: req.user.id }` como defesa em profundidade.
- `errorHandler.js` loga o objeto de erro completo em respostas 500 — considere redação de campos sensíveis antes de logar, mesmo não tendo achado log de senha/token hoje.

---

## Pontos fortes (vale destacar na apresentação)

- **Separação de camadas real, não decorativa**: zero import de Prisma/Express/bcrypt/jsonwebtoken em `domain/` ou `application/`, verificado por grep, não por leitura de intenção.
- **Autenticação sem enumeration**: senha errada e e-mail inexistente retornam o mesmíssimo `UnauthorizedError` (`AutenticarUsuario.js`), testado explicitamente.
- **Desacoplamento de eventos bem feito**: `NodeEventDispatcher` e os handlers de notificação têm catch duplo — uma falha no envio de notificação genuinamente não consegue reverter ou bloquear `IniciarBanho`/`FinalizarBanho`, exatamente o requisito do Épico 6.
- **Transições de status e autorização de atendimento corretas**: `IniciarBanho`/`FinalizarBanho`/`CancelarAgendamento`/`ReagendarAgendamento` checam papel + dono corretamente, com validação redundante na entidade de domínio (`Agendamento.js`, `StatusAgendamento.js`).
- **Soft delete de serviço com validação em duas camadas** (Zod + entidade `Servico`) — defesa em profundidade de verdade, não só no controller.
- **A maior parte das rotas de IDOR está certa**: agendamentos, mensagens e usuários sempre derivam o `id` do JWT (`req.user.id`), nunca de parâmetro/body — só o estoque escapou dessa disciplina.
- **README/CLAUDE.md/package.json consistentes**; `/health` é liveness puro sem dependência frágil.

---

## Prioridade sugerida antes da apresentação

1. Bootstrap de ADMIN no seed (bloqueador #5) — sem isso a demo trava logo de cara.
2. IDOR do estoque (bloqueador #1) — correção rápida, alto risco se testado ao vivo.
3. Teste de `FinalizarBanho` (bloqueador #4) — rápido de escrever, cobre um buraco visível.
4. Races de agendamento e estoque (bloqueadores #2 e #3) — mais trabalho, mas são a resposta pronta para "e se dois clientes agendarem ao mesmo tempo?".
5. Resto da lista 🟡, conforme sobrar tempo.
