# SOC · Gestão de Incidentes de Segurança da Informação

Projeto inspirado no sistema de chamados feito em sala, adaptado para o fluxo:
**Alerta → Qualificação da Ameaça → Contenção Temporária → Erradicação → Pós-Morte**

Stack: NestJS + Prisma + PostgreSQL (backend) e Next.js + Tailwind (frontend).

---

## Como rodar

### 1. Suba o Postgres via Docker

Na raiz do projeto (onde está o `docker-compose.yml`):

```bash
docker compose up -d db
```

### 2. Backend

```bash
cd soc-server
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate deploy
npm run start:dev
```

API disponível em **http://localhost:8000**.

Na subida, o backend cria (se não existirem) 3 usuários de demonstração:

| Usuário | `X-User-Id`   | Papel          |
| ------- | ------------- | -------------- |
| Maria   | `maria-n1`    | Analista N1    |
| João    | `joao-n2`     | Analista N2    |
| Ana     | `ana-gestora` | Gestor SOC     |

### 3. Frontend

Em outro terminal:

```bash
cd soc-client
npm install
cp .env.local.example .env.local
npm run dev
```

Frontend disponível em **http://localhost:3000**.

---

## Regras de negócio

### Máquina de estados

O status **nunca** é alterado por edição direta. Ele só muda por ações, e cada ação só é válida a partir de um estado:

| Ação        | Só vale em      | Vai para        |
| ----------- | --------------- | --------------- |
| `triar`     | `ALERTA`        | `QUALIFICACAO`  |
| `conter`    | `QUALIFICACAO`  | `CONTENCAO`     |
| `erradicar` | `CONTENCAO`     | `ERRADICACAO`   |
| `encerrar`  | `ERRADICACAO`   | `POS_MORTEM`    |

`POS_MORTEM` é o estado final. A tabela fica em `domain/state-machine/incident-transitions.ts` e é aplicada pela entidade `Incident.aplicar()`. O `PUT /incidents/:id` altera só campos descritivos: um `status` enviado no body é descartado.

### Severidade (P1 a P4)

| Prioridade | Severidade |
| ---------- | ---------- |
| P1         | `CRITICA`  |
| P2         | `ALTA`     |
| P3         | `MEDIA`    |
| P4         | `BAIXA`    |

### Permissões (RBAC por ação e severidade)

Papel mínimo exigido para cada ação. A hierarquia vale de cima para baixo (Gestor SOC > Analista N2 > Analista N1): um papel maior pode tudo que os menores podem.

| Ação        | P3 / P4       | P1 / P2       |
| ----------- | ------------- | ------------- |
| `triar`     | Analista N1   | Analista N1   |
| `conter`    | Analista N2   | Analista N2   |
| `erradicar` | Analista N2   | Analista N2   |
| `encerrar`  | Analista N2   | **Gestor SOC**|

A matriz fica em `domain/state-machine/incident-permissions.ts`. A permissão é verificada **antes** da transição de estado.

> **Autenticação simulada.** Não há login: o usuário é identificado pelo header `X-User-Id`. Isso vale para a disciplina; em produção seria JWT ou sessão. Qualquer cliente pode se passar por qualquer usuário, e a autorização (RBAC) no domínio não depende de como o usuário é identificado.

### Códigos de resposta das ações

| Código | Quando                                                        |
| ------ | ------------------------------------------------------------- |
| 200    | Ação executada                                                |
| 400    | `justificativa` ausente ou vazia                              |
| 401    | Header `X-User-Id` ausente ou usuário inexistente             |
| 403    | Papel sem permissão para a ação naquela severidade            |
| 404    | Incidente não encontrado                                      |
| 422    | Transição inválida para o status atual (ex.: pular etapa)     |

---

## Arquitetura do backend (Clean Architecture)

```
soc-server/src
├── shared/
│   ├── domain/domain.error.ts            # erros base (NotFound, Forbidden)
│   └── infrastructure/database/          # PrismaModule / PrismaService
└── modules/
    ├── users/
    │   ├── domain/                       # Usuario, Papel, porta do repositório
    │   ├── infrastructure/               # adaptador Prisma + seed dos usuários demo
    │   ├── presentation/                 # guard X-User-Id, decorator, GET /users
    │   └── users.module.ts
    └── incidents/
        ├── domain/                       # regras de negócio (sem Nest/Prisma)
        │   ├── entities/incident.entity.ts
        │   ├── enums/incident.enums.ts
        │   ├── errors/                   # not-found, invalid-transition, permissao-negada
        │   ├── state-machine/            # transições e matriz de permissões
        │   └── repositories/incident.repository.ts   # porta (contrato)
        ├── application/use-cases/        # um caso de uso por operação
        ├── infrastructure/repositories/  # adaptador Prisma da porta
        ├── presentation/                 # controller, DTOs, filtro de exceções
        └── incidents.module.ts           # liga porta -> adaptador (DI)
```

Dependências apontam para dentro: presentation/infrastructure → application → domain.

### Endpoints

| Método | Rota                          | Ação                                               |
| ------ | ----------------------------- | -------------------------------------------------- |
| GET    | /incidents                    | Listar                                             |
| GET    | /incidents/:id                | Buscar um                                          |
| POST   | /incidents                    | Incluir                                            |
| PUT    | /incidents/:id                | Alterar campos descritivos (não altera status)     |
| POST   | /incidents/:id/triar          | Ação: ALERTA → QUALIFICACAO                        |
| POST   | /incidents/:id/conter         | Ação: QUALIFICACAO → CONTENCAO                     |
| POST   | /incidents/:id/erradicar      | Ação: CONTENCAO → ERRADICACAO                      |
| POST   | /incidents/:id/encerrar       | Ação: ERRADICACAO → POS_MORTEM                     |
| GET    | /users                        | Listar usuários (usado no seletor do front)        |

As rotas de ação exigem o header `X-User-Id` e o body `{ "justificativa": "..." }`. Não existe rota para excluir incidente.

Exemplo:

```bash
curl -X POST http://localhost:8000/incidents/<id>/triar \
  -H "Content-Type: application/json" \
  -H "X-User-Id: maria-n1" \
  -d '{"justificativa":"Alerta recebido, iniciando triagem"}'
```

## Telas do frontend

- `/incidents` — listar, escolher o usuário em "Atuando como", executar a ação do estado atual (com justificativa obrigatória) e editar
- `/incidents/new` — incluir
- `/incidents/[id]/edit` — alterar

## Ainda não implementado

- Gravação da justificativa e do autor (audit log em transação) e imutabilidade dos logs de contenção
- Guarda de post-mortem obrigatório para encerrar P1/P2
- SLA por severidade e escalonamento

## Uso de IA

As consultas feitas à IA, com prompt, resposta e crítica, estão em [`docs/ai-decisions.md`](docs/ai-decisions.md).
