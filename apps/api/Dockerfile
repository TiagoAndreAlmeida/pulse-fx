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
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/node_modules ./apps/api/node_modules 2>/dev/null || :

EXPOSE 3333

# Migrations (idempotente) -> sync inicial (tolerante a falha, ex.: FRED sem chave) -> API.
# O bloco { ... || true; } garante que a API suba mesmo se o sync inicial falhar;
# as atualizações seguintes são feitas pelo scheduler (cron diário) ou via POST /admin/sync.
CMD ["sh", "-c", "npx prisma migrate deploy && { node dist/main/run-initial-sync.js || true; } && node dist/index.js"]