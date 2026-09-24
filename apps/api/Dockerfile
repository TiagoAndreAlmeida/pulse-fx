# --- ESTÁGIO 1: Build do Backend e Monorepo ---
FROM node:20-alpine AS builder

WORKDIR /app

# Copia os manifestos para configurar os workspaces do monorepo
COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/

RUN npm install

# Copia todo o código fonte da raiz
COPY . .

# Entra na pasta da API, gera o Prisma Client e compila o TypeScript
WORKDIR /app/apps/api
RUN npx prisma generate
RUN npm run build

# --- ESTÁGIO 2: Imagem Final de Execução ---
FROM node:20-alpine

WORKDIR /app

# Copia apenas o necessário para rodar em produção
COPY --from=builder /app/apps/api/package.json ./
COPY --from=builder /app/apps/api/prisma.config.ts ./
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules
# O builder instala as deps do workspace localmente em apps/api/node_modules
# (é lá que mora o CLI `prisma`); sem esta cópia o migrate não roda na imagem.
# (Instrução COPY não interpreta shell, por isso nada de `2>/dev/null || :` aqui.)
COPY --from=builder /app/apps/api/node_modules ./apps/api/node_modules
ENV PATH="/app/apps/api/node_modules/.bin:${PATH}"
# O CLI carrega /app/prisma.config.ts e resolve os imports dela (`prisma/config`)
# a partir de /app; o pacote `prisma` mora em apps/api/node_modules, então um
# symlink o torna visível para o Node sem duplicar arquivos.
RUN ln -s ../apps/api/node_modules/prisma /app/node_modules/prisma

EXPOSE 3333

# Migrations (idempotente) -> seed dos 4 indicadores (upsert, idempotente) ->
# sync inicial (tolerante a falha, ex.: FRED sem chave) -> API.
# O bloco { ... || true; } garante que a API suba mesmo se o sync inicial falhar;
# as atualizações seguintes são feitas pelo scheduler (cron diário) ou via POST /admin/sync.
CMD ["sh", "-c", "prisma migrate deploy && node dist/infrastructure/database/seeds/seed.js && { node dist/main/run-initial-sync.js || true; } && node dist/index.js"]