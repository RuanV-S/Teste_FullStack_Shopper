# Imagem base do Node.js
FROM node:18-alpine

# Definir o diretório de trabalho no container
WORKDIR /.

# Copiar o package.json e o package-lock.json (ou yarn.lock)
COPY package*.json ./

# Instalar as dependências
RUN npm install

# Copiar todos os arquivos da aplicação
COPY . .

RUN npm run build

# Expor a porta 80 para o frontend
EXPOSE 80

# Expor a porta 8080 para o backend
EXPOSE 8080

# Rodar a aplicação Next.js em modo de produção
CMD ["npm", "run", "start"]
