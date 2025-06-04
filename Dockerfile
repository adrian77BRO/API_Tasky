# Etapa 1: Build
FROM node:18-slim AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY prisma ./prisma
COPY src ./src

RUN apt-get update && apt-get install -y openssl libssl3

RUN npm install
RUN npm run build

# Etapa 2: Producción
FROM node:18-slim

WORKDIR /app

RUN apt-get update && apt-get install -y openssl libssl3

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma/dev.db ./prisma/dev.db

# Copia tsconfig y vuelve a generar Prisma Client con binarios correctos
COPY tsconfig.json ./
RUN npx prisma generate

ENV DATABASE_URL="file:/app/prisma/dev.db"

EXPOSE 8080
CMD ["npm", "run", "start"]