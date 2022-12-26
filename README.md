# Desafio [MB Labs](https://www.linkedin.com/company/mblabs/)

### Como testar 🔧️
Clone o projeto e instale as dependências:
```bash
# com npm
npm install

# com yarn
yarn install
```

Crie um arquivo `.env` seguindo o exemplo do `.env.example`:

```env
PORT=
JWT_SECRET=
DATABASE_URL=postgresql://mb-labs:mb-labs@localhost:5432/mb-labs?schema=public
```

Para iniciar localmente o servidor rode o comando:

```bash
# com npm
npm run dev

# com yarn
yarn dev
```

Se você utiliza _docker_ rode os seguintes comandos para iniciar localmente a aplicação

```bash
docker build . -t carlos8v/desafio-mb-labs
docker run -d \
  --name carlos8v-desafio-mb-labs \
  --env-file .env \
  -p 3000:3000 \
  carlos8v/desafio-mb-labs
```

**Testes unitários:**
```bash
# com npm
npm run test:unit

# com yarn
yarn test:unit
```

**Testes de integração e e2e:**

Você precisará de um banco de dados _postgres_, seja local ou na nuvem, disponível para poder rodar os testes seguintes.

Se você usa _docker_ então é possível copiar o arquivo `docker-compose.example.yml`.
Com docker, execute o comando:

```bash
docker-compose up -d db
```

Crie um arquivo `.env` seguindo o formato:
```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=mb-labs
DATABASE_USER=mb-labs
DATABASE_PASS=mb-labs
```

Execute o comando para os testes de integração:
```bash
# com npm
npm run test:integration

# com yarn
yarn test:integration
```

Execute o comando para os testes e2e:
```bash
# com npm
npm run test:e2e

# com yarn
yarn test:e2e
```
