# Pulse FX — Câmbio (BRL) e indicadores macro

MVP para acompanhar **câmbio (BRL/USD)** e **indicadores macro Brasil/EUA** a partir de fontes públicas (BCB e FRED), com dados persistidos em PostgreSQL, API própria (Node/Express/TypeScript) e cliente web (React/TypeScript/Vite).

> **Disclaimer:** informação com caráter exclusivamente educacional e informativo. **Não** constitui recomendação de investimento, oferta ou solicitação de compra/venda de ativos. O mesmo aviso é exibido no frontend (`DisclaimerBanner` + seção "Limitações dos Dados").

## Subir o ambiente em menos de 15 minutos (Docker Compose)

Pré-requisitos: Docker + Docker Compose e uma `FRED_API_KEY` válida (ver "Variáveis de ambiente").

```bash
git clone <repo-url>
cd "Pulse FX"

# Sobe db (5432), api (3333) e web (80)
docker-compose up -d

# Acompanhar logs
docker-compose logs -f api

# Acessos
# Web: http://localhost
# API: http://localhost:3333
# Health: http://localhost:3333/health

# Derrubar (com volumes)
docker-compose down -v
```

O container da API executa `npx prisma migrate deploy` antes de subir o servidor, então o schema é aplicado automaticamente. O seed inicial dos 4 indicadores está em `apps/api/src/infrastructure/database/seeds/` e é aplicado no boot quando a tabela `indicators` está vazia.

Desenvolvimento local (sem Docker):

```bash
npm install
npm run dev          # api (3333) + web (5173) em paralelo
# ou isolado:
npm run dev:api      # tsx watch apps/api/src/index.ts
npm run dev:web      # vite (porta 5173)
```

## Variáveis de ambiente

| Serviço | Variável | Obrigatória | Descrição |
|---------|----------|-------------|-----------|
| API | `DATABASE_URL` | Sim | Conexão PostgreSQL. No Compose: `postgresql://postgres:postgrespassword@db:5432/pulse_fx?schema=public`. Local: `apps/api/.env`. |
| API | `FRED_API_KEY` | Sim (p/ FRED) | Chave do FRED (https://fredaccount.stlouisfed.org/apikeys). Sem ela, o provider FRED falha e `FEDFUNDS`/`CPI_US` não sincronizam. |
| API | `ADMIN_API_KEY` | Sim (p/ sync manual) | Protege `POST /admin/sync` via header `x-admin-key`. |
| API | `PORT` | Não (default 3333) | Porta da API. |
| Web (build-time) | `VITE_API_URL` | Sim | URL base da API consumida pelo frontend. No Compose é passada como arg (`http://localhost:3333`). Local/dev usa `http://localhost:3333` por padrão. |

Atenção: no `docker-compose.yml` o serviço `api` recebe `DATABASE_URL` e `PORT` por padrão. Para sincronizar o FRED e usar o endpoint admin dentro do Docker, exporte `FRED_API_KEY` e `ADMIN_API_KEY` no ambiente do host ou adicione-as ao bloco `environment` do serviço `api`. O arquivo local de referência é `apps/api/.env`.

## Funcionalidades (MVP)

1. **Dashboard (web `/`):** cards com nome, último valor, data de referência e variação % (`IndicatorCard` + `IndicatorGrid`).
2. **Detalhe (web `/indicators/:id`):** série temporal em gráfico (`IndicatorChart`), tabela de observações (`ObservationsTable`) e texto de limitações (`DataLimitations`).
3. **Meus indicadores (`/favorites`):** favoritar/desfavoritar com persistência real no backend (`POST /indicators/:id/favorite`, tabela `favorites`, modelo single-tenant).
4. **Sincronização:** incremental + idempotente, job diário agendado e endpoint admin protegido (ver "Sincronização").
5. **Disclaimer visível:** banner no topo + aviso no rodapé e na tela de detalhe.

## 📊 Indicadores Selecionados e Justificativa de Produto

O **Pulse FX** tem como objetivo central fornecer um painel coeso para acompanhamento do câmbio (BRL/USD) e dos principais vetores macroeconômicos de pressão cambial entre Brasil e Estados Unidos. A escolha dos 4 indicadores abrange o tripé fundamental de Câmbio, Juros e Inflação:

### 1. Dólar Comercial PTAX (BCB)
* **Fonte:** Banco Central do Brasil (SGS) | **Código da Série:** `1` | **Periodicidade:** Diária (dias úteis)
* **Documentação/Referência:** [BCB Dados Abertos](https://dadosabertos.bcb.gov.br/) / [SGS BCB](https://www3.bcb.gov.br/sgspub/)
* **Justificativa:** Cotação oficial de fechamento do câmbio BRL/USD calculada pelo Banco Central do Brasil. Como indicador principal da aplicação, fornece a referência diária exata do preço da moeda e permite ao usuário acompanhar a variação percentual do Real em relação ao mercado no último dia útil.

### 2. Taxa Selic Meta (BCB)
* **Fonte:** Banco Central do Brasil (SGS) | **Código da Série:** `432` | **Periodicidade:** Diária (Decisão do COPOM)
* **Documentação/Referência:** [SGS BCB](https://www3.bcb.gov.br/sgspub/)
* **Justificativa:** Taxa básica de juros da economia brasileira definida pelo Banco Central. É o principal instrumento de política monetária nacional e dita o rendimento da renda fixa local. Alterações na Selic afetam diretamente a atratividade do Real para investidores estrangeiros e o fluxo de capitais no país.

### 3. Federal Funds Effective Rate (FRED)
* **Fonte:** Federal Reserve Economic Data | **Series ID:** `FEDFUNDS` | **Periodicidade:** Mensal
* **Documentação/Referência:** [FRED FEDFUNDS](https://fred.stlouisfed.org/series/FEDFUNDS)
* **Justificativa:** Taxa básica de juros estabelecida pelo Federal Reserve nos Estados Unidos. Como os títulos americanos são a referência de menor risco no mundo, aumentos nessa taxa atraem liquidez global para os EUA, fortalecendo o Dólar em relação a moedas de países emergentes como o Brasil.

### 4. Consumer Price Index - CPI (FRED)
* **Fonte:** Federal Reserve Economic Data | **Series ID:** `CPIAUCSL` | **Periodicidade:** Mensal
* **Documentação/Referência:** [FRED CPIAUCSL](https://fred.stlouisfed.org/series/CPIAUCSL)
* **Justificativa:** Principal indicador de inflação dos Estados Unidos, mensurando a variação dos preços ao consumidor. Funciona como o termômetro fundamental para antecipar movimentos do Federal Reserve sobre a taxa de juros (`FEDFUNDS`), conectando as pressões inflacionárias americanas com as oscilações globais do câmbio.

### Resumo das séries

| Indicador (`indicators.id`) | Provedor / código externo | Frequência | Unidade | Requer API key |
| :--- | :--- | :--- | :--- | :--- |
| `USD_BRL` (Dólar PTAX venda) | BCB SGS `1` | Diária (dias úteis) | `CURRENCY` | Não |
| `SELIC` (Selic meta) | BCB SGS `432` | Diária (COPOM) | `PERCENTAGE` | Não |
| `FEDFUNDS` (Fed Funds) | FRED `FEDFUNDS` | Mensal | `PERCENTAGE` | Sim (`FRED_API_KEY`) |
| `CPI_US` (CPI) | FRED `CPIAUCSL` | Mensal | `INDEX` | Sim (`FRED_API_KEY`) |

Referências de partida (confirmar endpoints/parâmetros na documentação vigente): [BCB Dados Abertos](https://dadosabertos.bcb.gov.br/), [BCB Olinda/PTAX](https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/swagger-ui3/), [BCB SGS](https://www3.bcb.gov.br/sgspub/), [FRED portal](https://fred.stlouisfed.org/), [FRED API docs](https://fred.stlouisfed.org/docs/api/fred/), [FRED API keys](https://fredaccount.stlouisfed.org/apikeys).

## Regras de variação e janela de histórico (por tipo de série)

Implementação de referência: `apps/api/src/domain/services/VariationCalculator.ts` + `apps/api/src/use-cases/SyncExternalIndicatorsUseCase.ts` + `apps/api/src/use-cases/GetIndicatorDetailUseCase.ts`.

* **Último valor** = observação mais recente válida já persistida (`observations`, ordenada por `reference_date desc`).
* **Data de referência** = data dessa observação (exposta como `referenceDate`; não é a hora da consulta).
* **Fórmula (denominador explícito):** `variation = ((V_atual - V_anterior) / V_anterior) * 100`. Se `V_anterior === 0`, a variação é `0` (evita divisão por zero).
* **N fixo:** `N = 1` observação anterior válida, para os dois tipos de série:
  * **Séries diárias (FX: `USD_BRL`, `SELIC`):** último fechamento vs dia útil anterior com dado disponível.
  * **Séries mensais (macro: `FEDFUNDS`, `CPI_US`):** último mês vs mês anterior com dado publicado.
* **Justificativa do N:** regra simples, honesta e sem interpolação; usa apenas dados reais persistidos, o que evita distorcer séries financeiras com valores inventados em fins de semana/feriados. A leitura do dashboard é O(1), pois `last_value`/`variation` são recalculados no sync e gravados em `indicators`.
* **Consistência:** dashboard e detalhe consomem os mesmos campos (`lastValue`, `variation`, `referenceDate`); o cálculo ocorre uma única vez no `SyncExternalIndicatorsUseCase`.
* **Janela de histórico no detalhe:** `DAILY` retorna as últimas **30** observações; `MONTHLY` retorna as últimas **12** (`GetIndicatorDetailUseCase`: `limit = frequency === 'DAILY' ? 30 : 12`).
* **Calendário / lacunas:** fins de semana, feriados e dias sem cotação simplesmente não geram registro — a comparação pula automaticamente para o dado anterior existente. Valores do FRED iguais a `"."` (dado ainda não publicado/revisado) são filtrados no `FredApiProvider` antes de persistir. O BCB retorna datas em `DD/MM/YYYY` e o provider converte para ISO antes de gravar.

## Sincronização (política de atualização)

* **Incremental:** para cada indicador, o sync parte da última observação persistida (`findLatest`) ou de `2025-01-01` (carga inicial); os providers recebem `startDate` e pedem apenas o delta (`dataInicial` no BCB, `observation_start` no FRED).
* **Paralela e tolerante a falhas:** os 4 indicadores são buscados com `Promise.all`; erro em um não aborta os demais (registrado em `items[].error`).
* **Idempotente:** `observations` tem constraint `UNIQUE(indicator_id, reference_date)` e a escrita usa `createMany({ skipDuplicates: true })` — re-execuções não duplicam (`ON CONFLICT DO NOTHING`).
* **Metadados recalculados:** após persistir, as 2 observações mais recentes definem `last_value`/`variation`/`updated_at` em `indicators`.
* **Sync inicial na criação do container:** o CMD da imagem (`apps/api/Dockerfile`) executa, nesta ordem, `prisma migrate deploy` → `node dist/main/run-initial-sync.js` → `node dist/index.js`. O runner (`apps/api/src/main/run-initial-sync.ts`, compilado pelo build padrão) popula os 4 indicadores logo na primeira subida, sem aguardar o cron. Falha no sync inicial **não** impede a API de subir (`|| true`); para dados completos do FRED, exporte `FRED_API_KEY` antes do `docker-compose up -d` (repassada ao serviço `api` via compose).
* **Agendamento:** cron diário às 19:00 (`0 19 * * *`, `startSyncScheduler`). Horário pós-fechamento do mercado, evitando chamadas redundantes às APIs externas.
* **Endpoint admin:** `POST /admin/sync` protegido por `x-admin-key` (`ADMIN_API_KEY`):

```bash
curl -X POST http://localhost:3333/admin/sync \
  -H "x-admin-key: $ADMIN_API_KEY"
```

## Endpoints da API

| Método | Rota | Descrição |
| :--- | :--- | :--- |
| `GET` | `/health` | Health check (`{ status: 'ok', timestamp }`). |
| `GET` | `/indicators` | Lista todos os indicadores (cards do dashboard). |
| `GET` | `/indicators/favorites` | Lista apenas os favoritos. |
| `GET` | `/indicators/:id` | Detalhe + série temporal (janela por frequência). Retorna 404 se o id não existir. |
| `POST` | `/indicators/:id/favorite` | Alterna favorito (`{ isFavorite: boolean }`). Retorna 404 se o id não existir. |
| `POST` | `/admin/sync` | Executa sincronização (requer `x-admin-key`). |

## 🗄️ Modelagem de Dados & Decisões de Arquitetura (PostgreSQL + Prisma)

### 1. Estrutura e Diagrama do Banco de Dados

Para garantir **normalização**, **alta performance em consultas** e **idempotência na sincronização de dados**, a base PostgreSQL foi estruturada em três tabelas fundamentais:

| Tabela | Função no Domínio | Chave Primária | Relacionamentos |
| :--- | :--- | :--- | :--- |
| **`indicators`** | Catálogo fixo de séries temporais suportadas (metadados como código externo, provedor, unidade e periodicidade). | `id` (VARCHAR) | Possui $N$ observações (`observations`) e $0..1$ registro em favoritos (`favorites`). |
| **`observations`** | Série temporal de leituras históricas coletadas das APIs externas (BCB e FRED)[cite: 1]. | `id` (UUID) | Pertence a $1$ indicador (`indicators`). |
| **`favorites`** | Persistência real da funcionalidade "Meus Indicadores"[cite: 1]. | `indicator_id` (FK/PK) | Aponta para $1$ indicador (`indicators`). |

#### Destaques de Engenharia na Modelagem:
* **Desacoplamento de Metadados (`indicators` vs `observations`):** Evita redundância massiva de strings na base (nomes, unidades, provedores) a cada leitura diária. A listagem de cartões no frontend consome diretamente a tabela `indicators`, evitando a necessidade de derivar metadados a partir do histórico de observações e simplificando as consultas do dashboard.
* **Idempotência e Integridade (`observations`):** A restrição única `UNIQUE(indicator_id, reference_date)` garante que re-execuções da rotina de sincronização não dupliquem registros, utilizando a estratégia `ON CONFLICT DO NOTHING`.
* **Persistência de Favoritos Sem Overengineering (`favorites`):** Como o escopo do MVP não exige autenticação de usuários, a tabela de favoritos funciona em modelo *single-tenant* global, persistindo preferências com chave primária e estrangeira vinculada à tabela `indicators` e remoção em cascata (`ON DELETE CASCADE`).

---

### 2. Escolha do ORM: Prisma ORM

Para a camada de persistência e gerenciamento do esquema PostgreSQL, foi selecionado o **Prisma ORM**.

#### Justificativa da Escolha & Trade-offs:
1. **Produtividade no Prazo do MVP:** A sintaxe declarativa no `schema.prisma` e a geração automática de rotinas de migração via `prisma migrate` viabilizam entregas rápidas e confiáveis dentro do prazo de 3 dias estipulado no desafio.
2. **Type-Safety End-to-End:** O Prisma gera automaticamente definições de tipos TypeScript a partir do esquema do banco de dados, reduzindo falhas em tempo de compilação na comunicação entre a API e a persistência.
3. **Migrations Versionadas:** Atende diretamente ao requisito de entregar *migrations* PostgreSQL versionadas.

#### Estratégia de Desacoplamento (Repository Pattern & SOLID):
Para evitar que as regras de negócio fiquem dependentes do cliente do Prisma, aplicou-se o princípio da **Inversão de Dependência (D do SOLID)**:
* **Entidades e Contratos puros no Domínio:** As entidades de negócio e as interfaces dos repositórios (`IIndicatorRepository`, `IObservationRepository`) residem no coração da aplicação (camada de *Domain*), sem nenhuma importação do pacote `@prisma/client`.
* **Adapters na Infraestrutura:** A implementação concreta (`PrismaIndicatorRepository`, etc.) fica isolada na camada de *Infrastructure*, atuando apenas como um adaptador que converte os dados do banco para os objetos puros de domínio da aplicação.

### 3. Outras decisões e trade-offs

* **Clean Architecture na API** (`domain/` sem dependências externas, `use-cases/`, `infra/`, `main/` com factories e setup Express): testabilidade e troca de adapters sem tocar em regra de negócio.
* **Monorepo NPM workspaces** (`apps/api`, `apps/web`): um único repositório Git com frontend, backend e artefatos compartilhados, conforme preferência do briefing.
* **React Query no web** (`staleTime` de 5 min + optimistic update no toggle de favorito): menos chamadas à API e UX responsiva; sincronização pesada fica no backend.
* **Nginx servindo o build Vite** com fallback para `index.html` (SPA + React Router).
* **Favoritos single-tenant global** (sem auth): suficiente para o MVP; documentado como decisão consciente, não como falta.

## Como rodar o frontend web

```bash
npm install
npm run dev:web     # vite dev na porta 5173 (consome VITE_API_URL ou http://localhost:3333)
npm run build:web   # tsc -b && vite build
```

Preview do build de produção:

```bash
npm run build:web
npx vite preview --workspace=@pulse-fx/web
# ou dentro de apps/web: npm run preview
```

Rotas: `/` (dashboard), `/indicators/:id` (detalhe), `/favorites` (meus indicadores).

## Como rodar testes e lint

API (vitest, 15 arquivos `*.test.ts`):

```bash
cd apps/api
npx vitest run        # execução única (CI)
npm test              # modo watch (desenvolvimento)
```

Cobertura por categoria:

* Domínio (3): `Indicator.test.ts`, `Observation.test.ts`, `VariationCalculator.test.ts`
* Use cases (5): `GetAllIndicators`, `GetFavoriteIndicators`, `GetIndicatorDetail`, `ToggleFavorite`, `SyncExternalIndicators`
* Providers externos (2): `BcbSgsProvider`, `FredApiProvider`
* HTTP/controllers (5): `indicators`, `favorites`, `favorite-toggle`, `indicator-detail`, `admin-sync`

Web (ESLint; sem suite de testes no frontend):

```bash
cd apps/web
npm run lint
```

Atalhos na raiz: `npm run test:api`, `npm run build`, `npm run dev`.

## Migrations PostgreSQL versionadas

* Schema: `apps/api/prisma/schema.prisma` (tabelas `indicators`, `observations`, `favorites`; unique em `(indicator_id, reference_date)`; FKs com `ON DELETE CASCADE`).
* Migrations: `apps/api/prisma/migrations/` (ex.: `20260922210437_init/migration.sql`).
* Aplicar: `npx prisma migrate deploy` (já executado automaticamente no CMD do container da API).
* Cliente gerado em caminho não padrão: `apps/api/src/infrastructure/database/prisma/generated` (ver `prisma.config.ts` / `schema.prisma`).

## Estrutura do monorepo e portas

```text
Pulse FX/
├── apps/api/    # @pulse-fx/api — Express + TypeScript (Clean Architecture)
├── apps/web/    # @pulse-fx/web — React 19 + Vite + Tailwind + Recharts
├── docker-compose.yml
└── readme.md
```

| Serviço | Porta |
| :--- | :--- |
| API | 3333 (dev e Docker) |
| Web | 5173 (dev) / 80 (Docker/nginx) |
| PostgreSQL | 5432 |

## Fora de escopo e limitações conhecidas

Fora de escopo (conforme briefing): trading, ordens, conta bancária, pagamentos, KYC, recomendação de investimento, streaming tick-by-tick, multi-tenant enterprise.

Limitações dos dados (também exibidas na tela de detalhe): PTAX/Selic só existem em dias úteis; FRED pode publicar com atraso e revisar valores (`"."` é descartado); cotações do BCB podem ser revisadas; Selic documentada é a meta do COPOM, não a over.
