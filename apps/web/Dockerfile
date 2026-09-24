# --- ESTÁGIO 1: Build do Frontend com Vite ---
FROM node:20-alpine AS builder

WORKDIR /app

# Copia os manifestos de workspaces
COPY package.json package-lock.json ./
COPY apps/web/package.json ./apps/web/

RUN npm install

# Copia todo o código fonte
COPY . .

# Recebe a URL da API como argumento no build do Docker
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

WORKDIR /app/apps/web
RUN npm run build

# --- ESTÁGIO 2: Servindo com Nginx (Alta Performance) ---
FROM nginx:alpine

# Copia os arquivos gerados pelo Vite para o diretório padrão do Nginx
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

# Configuração de redirecionamento para SPAs (React Router)
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]