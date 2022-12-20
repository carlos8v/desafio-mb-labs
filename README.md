# Desafio [MB Labs](https://www.linkedin.com/company/mblabs/)

### Como testar 🔧️
Clone o projeto e instale as dependências:
```bash
# com npm
npm install

# com yarn
yarn install
```

**Testes unitários:**
```bash
# com npm
npm run test:unit

# com yarn
yarn test:unit
```

**Testes _end-to-end_:**

Você precisará de um banco de dados _postgres_, seja local ou na nuvem, disponível para poder rodas os testes.

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

Execute o comando:
```bash
# com npm
npm run test:e2e

# com yarn
yarn test:e2e
```
