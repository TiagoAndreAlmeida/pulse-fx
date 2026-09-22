# --- ESTÁGIO 1: Build do Backend e Monorepo ---
FROM node:20-alpine AS builder

WORKDIR /app

# Copia os manifestos para configurar os workspaces do monorepo
COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/
COPY packages/shared/package.json ./packages/shared/

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

# Executa as migrations do Prisma de forma segura e idempotente antes de subir a API
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]