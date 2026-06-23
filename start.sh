#!/bin/sh

echo "Executando migrações do Prisma..."
npx prisma migrate deploy

echo "Iniciando a aplicação..."
exec node dist/src/main.js