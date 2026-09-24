# Pulse FX - Agent Instructions

## Monorepo Structure
- **NPM Workspaces** with 3 packages:
  - `apps/api` (@pulse-fx/api) - Node/Express/TypeScript API
  - `apps/web` (@pulse-fx/web) - React/TypeScript/Vite frontend
  - `packages/shared` - shared types/utilities (empty currently)

## Key Commands
```bash
# Install all dependencies
npm install

# Development (run both)
npm run dev          # runs dev:api & dev:web in parallel

# API only
npm run dev:api      # tsx watch src/index.ts (port 3333)
npm run build        # tsup src/index.ts --format cjs
npm run test         # vitest
npm run start        # node dist/index.js

# Web only
npm run dev:web      # vite (port 5173)
npm run build        # tsc -b && vite build
npm run lint         # eslint .
npm run preview      # vite preview
```

## Docker (full stack)
```bash
docker-compose up -d   # db (5432), api (3333), web (80)
docker-compose down -v # clean shutdown + volumes
```

## Environment Variables
| Service | Variables |
|---------|-----------|
| API | `DATABASE_URL`, `PORT=3333`, `BCB_API_URL`, `FRED_API_KEY`, `FRED_API_URL` |
| Web | `VITE_API_URL` (build-time, passed via Docker arg) |

Local `.env` at `apps/api/.env` - copy and adjust for local dev.

## Database
- **PostgreSQL 15** via Docker
- **Prisma ORM** with migrations in `apps/api/prisma/migrations/`
- Schema: `Indicator`, `Observation`, `Favorite` (single-tenant)
- Run migrations: `npx prisma migrate deploy` (auto in Docker CMD)
- Generate client: `npx prisma generate` (output to `src/infrastructure/database/prisma/generated`)

## Architecture Notes
- **Clean Architecture** in API: `domain/` (entities, repository interfaces), `use-cases/`, `infra/` (Prisma adapters, external API clients), `main/` (DI factories, Express setup)
- Domain has **zero external dependencies**
- Repository pattern with interfaces in domain, Prisma implementations in infra
- Indicators: USD_BRL (PTAX), SELIC, FEDFUNDS, CPI_US

## Testing
- **vitest** for API (configured in `apps/api/package.json`)
- **No tests currently in web** (eslint only)
- Minimum 5 test files required by challenge spec

## Ports
- API: 3333
- Web: 5173 (dev), 80 (Docker/nginx)
- PostgreSQL: 5432

## Gotchas
- API Dockerfile copies entire monorepo for workspace install
- Prisma client generated to non-standard path (`src/infrastructure/database/prisma/generated`)
- Web Docker build requires `VITE_API_URL` arg
- No root-level test/lint scripts - run per workspace


## Permissões (Boundaries)
- **FAÇA SEMPRE:** Leia os endpoints do `apps/api` antes de criar chamadas HTTP no `apps/web`. Verifique os tipos e o linter após criar novos componentes.
- **PERGUNTE PRIMEIRO:** Antes de adicionar novas dependências (libs) ao `package.json` do `web`. Antes de realizar grandes refatorações.
- **NUNCA FAÇA:** Não modifique NADA em `apps/api`. Não use o tipo `any` no TypeScript (use `unknown` se necessário). Não ignore regras do ESLint com comentários.

---

## 4. Boas Práticas React e SOLID (Web Stack)

### Stack Base
- O projeto usa **React 19** e **Vite 8**. Utilize as práticas mais modernas do React.
- Módulos são ES Modules (`"type": "module"`).

### Separação de Responsabilidades (SRP)
- UI e Lógica de Negócio (ex: fetch de cotações, cálculos de conversão) não devem se misturar.
- Extraia regras de negócio e chamadas HTTP para Custom Hooks (ex: `useExchangeRates()`) ou Services.
- **Exemplo obrigatório:**
  ```tsx
  // ✅ CORRETO: Lógica isolada
  import { useExchangeRates } from '../hooks/useExchangeRates';
  
  export function FXDashboard() {
    const { rates, isLoading } = useExchangeRates();
    return <RatesTable data="{rates}" loading="{isLoading}"/>;
  }


## Diretrizes de Git, Commit e Versionamento

Como agente de código, você deve seguir rigorosamente a estratégia de **Commits Atômicos** combinada com a convenção **Conventional Commits**. Commits gigantes acumulando alterações de múltiplos escopos ou arquivos não relacionados são estritamente proibidos.

---

### 1. Princípio dos Commits Atômicos (Atomic Commits)
* **Uma única intenção por commit:** Cada commit deve conter apenas UMA alteração lógica e independente. Nunca misture refatoração, correção de bugs e criação de novas telas no mesmo commit.
* **Stage Explícito:** NUNCA execute `git add .` ou `git add -A`. Sempre adicione apenas os arquivos específicos relacionados à tarefa atual: `git add apps/api/src/auth.ts`.
* **Frequência e Safety Checkpoints:** Faça commits incrementais assim que um sub-bloco da tarefa estiver finalizado e testado, permitindo reversões simples caso um passo seguinte falhe.
* **Código Funcional:** Nunca suba código com erros de sintaxe ou testes quebrados em um commit.

---

### 2. Formato das Mensagens de Commit

Siga o formato padrão **Conventional Commits**:

`<type>(<scope>): <descrição no imperativo>`

#### Tipos Permitidos (`<type>`):
* `feat`: Nova funcionalidade ou endpoint para o usuário/cliente.
* `fix`: Correção de um bug ou comportamento inesperado.
* `refactor`: Alteração de código interno sem alterar o comportamento externo ou corrigir bugs.
* `chore`: Tarefas de manutenção, atualização de dependências, configurações ou scripts.
* `test`: Adição ou ajuste de testes automatizados.
* `docs`: Alterações exclusivamente na documentação (ex: `README.md`, comentários).
* `style`: Formatação, ponto e vírgula, espaçamento (sem alteração de lógica).
* `perf`: Mudança focada exclusivamente em ganho de performance.

#### Escopos (`<scope>`):
No contexto deste monorepo, utilize obrigatoriamente o escopo que identifica a aplicação ou pacote modificado:
* `api`: Mudanças dentro do workspace/app de backend (`apps/api`).
* `web`: Mudanças dentro do workspace/app de frontend (`apps/web`).
* `shared` / `ui`: Pacotes ou módulos compartilhados entre apps.
* `root`: Mudanças no nível da raiz do repositório (ex: `.gitignore`, Dockerfile raiz).

---

### 3. Exemplo Prático de Fluxo de Trabalho do Agente

Quando for solicitado para **"Implementar autenticação de usuário com tela de login e API"**:

❌ **Incorreto (Commit Gigante):**
```bash
# Adiciona 15 arquivos de api, web, docs e configs de uma vez só
git add .
git commit -m "feat: implementada autenticacao e login na api e web"