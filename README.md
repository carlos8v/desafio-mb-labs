# Desafio [MB Labs](https://www.linkedin.com/company/mblabs/)

### Projeto 🚀

Desenvolver aplicação backend completa utilizando typescript. A aplicação deve possuir validação de erros e deve ser possível realizar deploy com _docker_.

- Prazo de entrega e apresentação: **27/12/2022 às 17:00**

**Headline**:
> "Olá, tudo bem? Estou procurando uma empresa para desenvolver um app de gestão de eventos, a ideia é ter algo que as pessoas possam utilizar para buscar e comprar ingressos para eventos de empresas e universidades. Qual nosso próximo passo?".

---

### Requisitos funcionais 🎯

- [x] Usuário pode criar conta na aplicação
- [x] Usuário pode realizar login na aplicação
- [x] Usuários podem criar eventos com as seguintes informações:
	- Título
	- Subtítulo
	- Descrição
	- Data
	- Valor da inscrição
	- Preço
	- Localização (opicional)
	- Link da reunião (opicional)
- [x] Usuários podem listar todos os eventos por data
- [x] Usuários podem pesquisar eventos por nome
- [x] Usuários podem visualizar informações de evento por identificador único
- [x] Usuários podem visualizar inscrições de eventos que criaram
- [x] Usuários podem listar todas as incrições submetidas

### Como testar 🔧️
Clone o projeto e instale as dependências:
```bash
# com npm
npm install

# com yarn
yarn install
```

Você precisará de um banco de dados _postgres_, seja local ou na nuvem, disponível para poder executar a aplicação.

Se você usa _docker_ então é possível copiar o arquivo `docker-compose.example.yml`.
Com docker, execute o comando:

```bash
docker-compose up -d db
```

Crie um arquivo `.env` seguindo o exemplo do `.env.example`:

```env
PORT=
JWT_SECRET=
DATABASE_URL=postgresql://mb-labs:mb-labs@localhost:5432/mb-labs?schema=public
```

Execute as migrações para o banco de dados com o comando:
```bash
# com npm
npm run db:migrate

# com yarn
yarn db:migrate
```

Para iniciar localmente o servidor rode o comando:

```bash
# com npm
npm run dev

# com yarn
yarn dev
```

Se você utiliza _docker_ rode os seguintes comandos para iniciar localmente a aplicação:

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

Crie um arquivo `.env` seguindo o formato:
```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=mb-labs
DATABASE_USER=mb-labs
DATABASE_PASS=mb-labs
```

> Lembre-se de iniciar seu banco antes de exexutar esses testes

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
