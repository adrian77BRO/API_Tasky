# Etapa 1: Build
FROM node:18 AS builder

WORKDIR /app

# Copiamos archivos necesarios
COPY package*.json ./
COPY tsconfig.json ./
COPY prisma ./prisma
COPY src ./src

# Instalamos dependencias y compilamos el código TypeScript
RUN npm install
RUN npx prisma generate
RUN npm run build

# Etapa 2: Producción
FROM node:18-alpine

WORKDIR /app

# Copiamos solo los archivos necesarios desde la etapa de build
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma

# Prisma necesita el cliente generado y el archivo SQLite
COPY --from=builder /app/prisma/dev.db ./prisma/dev.db

# Puerto que expone tu API
EXPOSE 8080

# Comando para iniciar la app
CMD ["npm", "run", "dev"]