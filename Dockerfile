FROM node:15.14.0-slim as base
RUN apt-get update && apt-get install libssl-dev ca-certificates -y

FROM base as builder
WORKDIR /build

COPY package*.json ./
COPY ./prisma/ ./prisma
RUN npm ci --silent

COPY ./src/ ./src
COPY tsconfig*.json ./
RUN npm run db:generate
RUN npm run build
RUN npm prune --production

FROM base as prod
WORKDIR /app
USER node

COPY --from=builder --chown=node:node /build/dist .
COPY --from=builder --chown=node:node /build/node_modules ./node_modules

ARG PORT=3000
ENV PORT=$PORT

EXPOSE $PORT

CMD ["node", "./infra/http/server.js"]
