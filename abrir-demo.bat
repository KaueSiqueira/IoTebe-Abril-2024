@echo off
REM IoTebe — Demonstracao
REM Clique duas vezes neste arquivo (Windows) para buildar/abrir a demo.
cd /d "%~dp0"
if not exist "node_modules" (
  echo [IoTebe demo] primeira execucao: instalando dependencias ^(pode levar alguns minutos^)...
  call npm install
)
call npm run demo
pause
