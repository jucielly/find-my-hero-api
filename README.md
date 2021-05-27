# Find my hero api 🦸‍♀️

Api feita para o projeto [Find my hero](https://github.com/jucielly/find-my-hero) consumindo a [marvel api](https://developer.marvel.com/) para listar os personagens e os quadrinhos assim como suas respctivas informações.

## Como usar essa api

**Modo local**

1. `npm install` **no terminal**: Para baixar todas as dependências.
2. **Configure seu baco de dados no Postgres** 
- não tem um banco de dados?  você pode subir um no [docker](https://www.docker.com/get-started) com este comando `docker run -d --name dev-postgress -e POSTGRES_PASSWORD=xpto -v ${HOME}/postgres-data/:/var/lib/postgresql/data -p 5432:5432 postgres
`
3. **Configure seu .env file**:

- `PORT=` Porta local onde vc vai rodar o projeto.
- `DB_USER=` Nome do user do banco de dados que você vai usar(postgress).
- `DB_PASSWORD=` Senha do seu banco de dados.
- `DB_HOST=` Ip do seu banco de dados, caso seja local use o `localhost`
- `DB_PORT=` Numero da porta do banco de dados.
- `DB_DATABASE=` Nome do banco de dados.
- `SALT_ROUNDS=` Numero de rodadas necessarios para o hash da [marvel api](https://developer.marvel.com/)
- `JWT_SECRET=` Secret para geração de tokens JWT
- `MARVEL_PUBLIC_KEY=`: Chave publica da [marvel api](https://developer.marvel.com/).
- `MARVEL_PRIVATE_KEY` Chave privada da [marvel api](https://developer.marvel.com/).

4. `npm start` **no terminal**: inicia o server local.

## Enpoints da api

[clique aqui](https://www.getpostman.com/collections/21ad061e792b2dc38005) para ver todos os endpoints da api
