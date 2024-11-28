# Etapa de build
FROM node:18 AS build

WORKDIR /app

# Copiar os arquivos de configuração
COPY ./frontend/package.json ./frontend/package-lock.json ./
RUN npm install

# Copiar os arquivos de código
COPY ./frontend ./
RUN npm run build

# Etapa final (para produção)
FROM node:18-slim

WORKDIR /app

# Copiar a build do Next.js da etapa anterior
COPY --from=build /app ./

# Rodar o Next.js na porta 80
EXPOSE 80
CMD ["npm", "start"]
