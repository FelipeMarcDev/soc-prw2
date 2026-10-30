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

## Arquitetura do backend (Clean Architecture)

```
soc-server/src
├── shared/
│   ├── domain/domain.error.ts            # erros base de domínio
│   └── infrastructure/database/          # PrismaModule / PrismaService
└── modules/incidents/
    ├── domain/                           # regras de negócio (sem Nest/Prisma)
    │   ├── entities/incident.entity.ts
    │   ├── enums/incident.enums.ts
    │   ├── errors/incident-not-found.error.ts
    │   └── repositories/incident.repository.ts   # porta (contrato)
    ├── application/use-cases/            # um caso de uso por ação
    ├── infrastructure/repositories/      # adaptador Prisma da porta
    ├── presentation/                     # controller, DTOs, filtro de exceções
    └── incidents.module.ts               # liga porta -> adaptador (DI)
```

Dependências apontam para dentro: presentation/infrastructure → application → domain.

### Endpoints

| Método | Rota                     | Ação                         |
| ------ | ------------------------ | ---------------------------- |
| GET    | /incidents               | Listar                       |
| GET    | /incidents/:id           | Buscar um                    |
| POST   | /incidents               | Incluir                      |
| PUT    | /incidents/:id           | Alterar                      |
| PATCH  | /incidents/:id/status    | Avançar/alterar status       |
| DELETE | /incidents/:id           | Excluir (204)                |

## Telas do frontend

- `/incidents` — listar, avançar status, editar e excluir (com confirmação)
- `/incidents/new` — incluir
- `/incidents/[id]/edit` — alterar
