# Etapa 1: Build
FROM node:18-slim AS builder

WORKDIR /app

# Copiamos archivos necesarios
COPY package*.json ./
COPY tsconfig.json ./
COPY prisma ./prisma
COPY src ./src
COPY .env .env

# Instalamos OpenSSL (para Prisma)
RUN apt-get update && apt-get install -y openssl libssl3

# Instalación de dependencias y compilación
RUN npm install
RUN npm run build
RUN npx prisma generate

# Etapa 2: Producción
FROM node:18-slim

WORKDIR /app

# Instalamos OpenSSL también en producción
RUN apt-get update && apt-get install -y openssl libssl3

# Copiamos lo necesario desde la etapa de build
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma/dev.db ./prisma/dev.db
COPY --from=builder /app/.env ./.env
COPY --from=builder /app/.prisma ./.prisma

# Exponemos el puerto
EXPOSE 8080

# Comando para ejecutar la app
CMD ["npm", "run", "start"]