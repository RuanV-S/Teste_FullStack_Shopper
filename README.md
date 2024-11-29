# Fullstack Teste Shopper

Este é um projeto full-stack usando **Next.ts** para o front-end e **Express.ts** para o back-end, com o banco de dados **PostgreSQL** sendo executado em containers Docker. O front-end e o back-end estão configurados para trabalhar juntos em uma rede Docker compartilhada.

## Tecnologias Usadas

- **Frontend**: Next.ts
- **Backend**: Express.ts
- **Banco de Dados**: PostgreSQL
- **Docker**: Containers para o ambiente de desenvolvimento
- **Prisma**: ORM para interação com o banco de dados

## Requisitos

Antes de rodar o projeto, certifique-se de ter os seguintes pré-requisitos instalados:

- [Docker](https://www.docker.com/get-started)
- [Node.js](https://nodejs.org/)
- [Prisma CLI](https://www.prisma.io/docs/getting-started)

## Estrutura do Projeto

- **Frontend**: Implementado com **Next.ts**.
- **Backend**: Implementado com **Express.ts**.
- **Banco de Dados**: Usando **PostgreSQL**, executado em um container Docker.

### Estrutura de Diretórios

```bash
.
├── backend/                   # Código do backend (Express.js)
    ├── .env                        # Arquivo de variáveis de ambiente
├── frontend/                   # Código do frontend (Next.js)
└── docker-compose.yml          # Configuração dos containers Docker
```

## Configuração e Execução

### 1. Clone o Repositório

Clone este repositório para sua máquina local:

```bash
git clone <URL_DO_REPOSITORIO>
cd <diretorio_do_repositorio>
```

### 2. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as variaveis de ambientes do .env_example

Para visualizar banco de dados na pasta backend

```bash
npx prisma studio
```

Essas variáveis são usadas para conectar o backend ao banco de dados PostgreSQL, configurado no Docker.

### 3. Configuração do Docker

Na raiz do projeto, você terá um arquivo `docker-compose.yml` que define os containers para o **frontend**, **backend** e **banco de dados (PostgreSQL)**.

O Docker irá garantir que o ambiente de desenvolvimento seja isolado e configurado corretamente. Para iniciar todos os containers:

```bash
docker-compose up --build ou docker-compose up
```

Isso irá:

- Construir e iniciar o container do **frontend**.
- Construir e iniciar o container do **backend**.
- Iniciar o container do **PostgreSQL**.

### 4. Iniciar a aplicação

Dentro do container do **backend**, você precisa rodar a migração do Prisma para configurar o banco de dados. Execute o seguinte comando:

```bash
docker-compose up --build
```

O frontend estará rodando no container, e você poderá acessá-lo em `http://localhost:80`.
