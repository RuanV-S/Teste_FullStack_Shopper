# Usando a imagem oficial do Node.js
FROM node:16.15-alpine

WORKDIR /app

# Copiar arquivos do backend
COPY ./backend/package.json ./backend/package-lock.json ./
RUN npm install

# Copiar o código-fonte do backend
COPY ./backend ./

# Rodar a aplicação na porta 8080
EXPOSE 8080
CMD ["npm", "start"]
