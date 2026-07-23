#!/bin/bash
# IoTebe — Demonstração
# Clique duas vezes neste arquivo (Mac) para builda r/abrir a demo.
# No Linux, dê permissão de execução uma vez: chmod +x abrir-demo.command
cd "$(dirname "$0")"
if [ ! -d "node_modules" ]; then
  echo "[IoTebe demo] primeira execução: instalando dependências (pode levar alguns minutos)..."
  npm install
fi
npm run demo
