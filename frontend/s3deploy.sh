#!/bin/bash

# Script para fazer deploy de uma aplicação React em um bucket S3
# Autor: Claude
# Data: 26/02/2025

# Configurações
BUCKET_NAME="plants-frontend-gelasioebel"
PROJECT_DIR="/home/ec2-user/app/frontend"
BUILD_DIR="$PROJECT_DIR/dist"
AWS_REGION="us-east-2" # Altere para sua região

# Cores para saída
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # Sem cor

# Funções
check_command() {
  if ! command -v $1 &> /dev/null; then
    echo -e "${RED}Erro: $1 não está instalado.${NC}"
    exit 1
  fi
}

log_step() {
  echo -e "${YELLOW}[$(date +"%T")] $1${NC}"
}

log_success() {
  echo -e "${GREEN}[$(date +"%T")] $1${NC}"
}

log_warning() {
  echo -e "${BLUE}[$(date +"%T")] AVISO: $1${NC}"
}

log_error() {
  echo -e "${RED}[$(date +"%T")] ERRO: $1${NC}"
}

# Verificar pré-requisitos
log_step "Verificando pré-requisitos..."
check_command "aws"

# Criar build da aplicação
log_step "Criando build da aplicação..."
cd "$PROJECT_DIR" || echo -e "${RED}Erro: Não foi possível acessar o diretório de build.${NC}"
echo "echo $PWD"
if ! npm run build; then
  log_error "Falha ao criar o build da aplicação."
  exit 1
fi
for i in {10..1}
do
  echo "*******  BUILDING FRONTEND  ******* ... $i: ..."
  sleep 1
done
echo "Depois de 20 segundos TENTANTADO DAR s3 sync"
cd ~/app/frontend
"echo $PWD"
/usr/local/bin/aws s3 sync ./dist s3://d03frontend --acl public-read
echo "Aguardando mais 10 segundos TENTANTADO DAR s3 sync"
for i in {10..1}
do
  echo "*******  TENTANTADO DAR s3 sync  --- /usr/local/bin/aws s3 sync ./dist s3://d03frontend --acl public-read ---  ******* ... $i: ..."
  sleep 1
done
echo "PASSEI SERA?"
log_success "Build concluído com sucesso!"

exit 0
