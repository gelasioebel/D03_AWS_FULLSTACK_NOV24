#!/bin/bash

# Script para fazer deploy de uma aplicação React em um bucket S3
# Autor: Claude
# Data: 26/02/2025

# Configurações
BUCKET_NAME="plants-frontend-gelasioebel"
PROJECT_DIR="/home/ec2-user/app/frontend"
BUILD_DIR="$PROJECT_DIR/dist"
AWS_REGION="us-east-1" # Altere para sua região

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

# Verificar se AWS CLI está configurado
if ! aws sts get-caller-identity &> /dev/null; then
  log_error "AWS CLI não está configurado corretamente. Execute 'aws configure' primeiro."
  exit 1
fi

# Criar build da aplicação
log_step "Criando build da aplicação..."
cd "$PROJECT_DIR"
if ! npm run build; then
  log_error "Falha ao criar o build da aplicação."
  exit 1
fi
log_success "Build concluído com sucesso!"

# Navegar para o diretório de build
cd "$BUILD_DIR"
if [ ! -f "index.html" ]; then
  log_error "Arquivo index.html não encontrado no diretório de build."
  exit 1
fi

# Sincronizar arquivos com o bucket S3
log_step "Iniciando upload dos arquivos para o bucket S3..."

# Tentar upload usando o comando sync
log_step "Tentando upload usando aws s3 sync..."
if ! AWS_OUTPUT=$(aws s3 sync . s3://$BUCKET_NAME 2>&1); then
  log_warning "Falha ao usar 'aws s3 sync', tentando método alternativo..."
  
  # Método alternativo usando put-object individualmente
  log_step "Fazendo upload dos arquivos individualmente..."
  
  # Para arquivos na raiz
  for file in $(find . -maxdepth 1 -type f); do
    contentType=$(file --mime-type -b "$file")
    echo "Enviando ${file:2}..."
    if ! aws s3api put-object --bucket $BUCKET_NAME --key "${file:2}" --body "$file" --content-type "$contentType" &> /dev/null; then
      log_error "Falha ao enviar arquivo: ${file:2}"
    fi
  done
  
  # Para arquivos na pasta assets
  for file in $(find ./assets -type f 2>/dev/null); do
    contentType=$(file --mime-type -b "$file")
    echo "Enviando ${file:2}..."
    if ! aws s3api put-object --bucket $BUCKET_NAME --key "${file:2}" --body "$file" --content-type "$contentType" &> /dev/null; then
      log_error "Falha ao enviar arquivo: ${file:2}"
    fi
  done
  
  # Para arquivos na pasta images
  for file in $(find ./images -type f 2>/dev/null); do
    contentType=$(file --mime-type -b "$file")
    echo "Enviando ${file:2}..."
    if ! aws s3api put-object --bucket $BUCKET_NAME --key "${file:2}" --body "$file" --content-type "$contentType" &> /dev/null; then
      log_error "Falha ao enviar arquivo: ${file:2}"
    fi
  done
else
  log_success "Upload via sync concluído com sucesso!"
fi

# Configurar website
log_step "Configurando o bucket como website estático..."
AWS_OUTPUT=$(aws s3 website s3://$BUCKET_NAME --index-document index.html --error-document index.html 2>&1)
if [ $? -ne 0 ]; then
  log_error "Falha ao configurar o bucket como website."
  log_error "$AWS_OUTPUT"
  exit 1
fi
log_success "Bucket configurado como website estático!"

# Exibir URL do website
WEBSITE_URL="http://$BUCKET_NAME.s3-website-$AWS_REGION.amazonaws.com"
log_success "Deploy concluído com sucesso!"
echo -e "${GREEN}Seu site está disponível em:${NC}"
echo -e "${GREEN}$WEBSITE_URL${NC}"

# Verificar se a política do bucket permite acesso público
log_step "Verificando política de acesso público do bucket..."
POLICY=$(aws s3api get-bucket-policy --bucket $BUCKET_NAME 2>/dev/null)
if [ $? -ne 0 ]; then
  echo -e "${YELLOW}Aviso: O bucket não tem uma política configurada.${NC}"
  echo -e "${YELLOW}Para tornar o site público, adicione uma política de bucket através do console AWS:${NC}"
  echo -e "{
    \"Version\": \"2012-10-17\",
    \"Statement\": [
        {
            \"Sid\": \"PublicReadGetObject\",
            \"Effect\": \"Allow\",
            \"Principal\": \"*\",
            \"Action\": \"s3:GetObject\",
            \"Resource\": \"arn:aws:s3:::$BUCKET_NAME/*\"
        }
    ]
}"
fi

exit 0
