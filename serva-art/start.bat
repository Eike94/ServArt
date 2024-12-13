@echo off
REM Título do terminal
title Iniciando Servidor Serva-Art

REM Configurar variáveis de ambiente
echo Configurando variáveis de ambiente...
set NODE_ENV=development

REM Verificar se o Node.js está instalado
echo Verificando instalação do Node.js...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js não está instalado. Por favor, instale o Node.js e tente novamente.
    pause
    exit /b
)

REM Verificar se as dependências estão instaladas
echo Verificando dependências do projeto...
if not exist "node_modules" (
    echo Dependências não encontradas. Instalando dependências...
    npm install
)

REM Iniciar os servidores em segundo plano
echo Iniciando o servidor em segundo plano...

start /min "" cmd /c "node server.js > server.log 2>&1"
start /min "" cmd /c "npm run dev > dev.log 2>&1"

REM Aguarde alguns segundos para garantir que o servidor foi iniciado
timeout /t 5 >nul

REM Abrir o navegador com o link do run dev
echo Abrindo navegador em http://localhost:5173/
start http://localhost:5173/

REM Mensagem ao encerrar a execução do script
echo Servidores iniciados e navegador aberto. Processos rodando em segundo plano.
exit
