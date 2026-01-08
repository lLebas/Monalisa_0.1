#!/bin/bash

# Script para rodar ambos os projetos em desenvolvimento com pnpm

echo "🚀 Iniciando Frontend e Backend..."

# Rodar frontend em background
cd frontend
pnpm dev &
FRONTEND_PID=$!
cd ..

# Rodar backend em background
cd backend
pnpm start:dev &
BACKEND_PID=$!
cd ..

echo "✅ Frontend rodando (PID: $FRONTEND_PID)"
echo "✅ Backend rodando (PID: $BACKEND_PID)"
echo ""
echo "Pressione Ctrl+C para parar ambos os serviços"

# Aguardar sinais de interrupção
trap "kill $FRONTEND_PID $BACKEND_PID; exit" INT TERM

# Manter o script rodando
wait
