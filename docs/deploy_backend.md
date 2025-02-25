# Deploy da API Node.js no EC2

Este guia descreve como realizar o deploy da API Node.js do sistema de plantas em uma instância EC2 da AWS.

## 1. Preparando o Ambiente na EC2

### 1.1. Conectar-se à instância via SSH

```bash
# Ajuste as permissões do arquivo .pem 
chmod 400 plants-api-key.pem

# Conecte à instância (substitua o IP pelo IP público da sua instância)
ssh -i "plants-api-key.pem" ec2-user@SEU-IP-AQUI
```

### 1.2. Atualizar o sistema

```bash
sudo yum update -y
```

### 1.3. Instalar o Node.js via NVM

```bash
# Instale o NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash

# Ative o NVM
source ~/.nvm/nvm.sh

# Instale Node.js versão 18
nvm install 18

# Defina como versão padrão
nvm alias default 18

# Verifique a instalação
node --version
npm --version
```

### 1.4. Instalar o PM2 para gerenciar o processo

```bash
npm install -g pm2
```

### 1.5. Instalar dependências necessárias para o SQLite

```bash
sudo yum install -y gcc gcc-c++ make
```

### 1.6. Criar estrutura de diretórios para a aplicação

```bash
# Crie os diretórios
mkdir -p ~/app/database

# Ajuste permissões para o SQLite
chmod 777 ~/app/database
```

## 2. Deploy Manual

### 2.1. Clonar o repositório

```bash
cd ~
git clone https://github.com/seu-usuario/seu-repositorio.git app
cd app
```

### 2.2. Instalar dependências

```bash
npm install
```

### 2.3. Configurar as variáveis de ambiente

```bash
# Crie o arquivo .env
cat > .env << EOF
PORT=3000
DATABASE_PATH=database/plants.db
NODE_ENV=production
EOF
```

### 2.4. Iniciar a aplicação com PM2

```bash
pm2 start server.ts --name "plants-api" --interpreter ./node_modules/.bin/ts-node
```

### 2.5. Configurar PM2 para iniciar com o sistema

```bash
pm2 startup
# Execute o comando que será exibido na tela
pm2 save
```

## 3. Deploy Automático com GitHub Actions

### 3.1. Configurar segredos no GitHub

1. No seu repositório GitHub, vá para Settings > Secrets and variables > Actions
2. Adicione os seguintes secrets:
   - `SSH_PRIVATE_KEY`: Conteúdo completo do arquivo .pem
   - `HOST`: IP público da sua instância EC2
   - `USERNAME`: ec2-user

### 3.2. Criar arquivo de workflow

Crie o arquivo `.github/workflows/deploy-backend.yml` no seu repositório:

```yaml
name: Deploy Backend to EC2

on:
  push:
    branches: [ master, main ]
    paths:
      - 'backend/**'
      - 'database/**'
      - '.github/workflows/deploy-backend.yml'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Create SSH key
        run: |
          mkdir -p ~/.ssh/
          echo "${{ secrets.SSH_PRIVATE_KEY }}" > ~/.ssh/deploy.key
          chmod 600 ~/.ssh/deploy.key
          ssh-keyscan -H ${{ secrets.HOST }} >> ~/.ssh/known_hosts
          
      - name: Stop running application
        run: |
          ssh -i ~/.ssh/deploy.key ${{ secrets.USERNAME }}@${{ secrets.HOST }} 'pm2 delete plants-api || true'
      
      - name: Prepare environment
        run: |
          # Create app directory if it doesn't exist
          ssh -i ~/.ssh/deploy.key ${{ secrets.USERNAME }}@${{ secrets.HOST }} '
            mkdir -p ~/app/database
            chmod 777 ~/app/database
          '
      
      - name: Copy backend files
        run: |
          # Copy backend files
          scp -i ~/.ssh/deploy.key -r ./backend/* ${{ secrets.USERNAME }}@${{ secrets.HOST }}:~/app/
          
          # Copy database SQL scripts
          scp -i ~/.ssh/deploy.key -r ./database/*.sql ${{ secrets.USERNAME }}@${{ secrets.HOST }}:~/app/database/
      
      - name: Setup environment variables
        run: |
          ssh -i ~/.ssh/deploy.key ${{ secrets.USERNAME }}@${{ secrets.HOST }} 'cat > ~/app/.env << EOL
          PORT=3000
          DATABASE_PATH=database/plants.db
          NODE_ENV=production
          EOL'
      
      - name: Install dependencies and start application
        run: |
          ssh -i ~/.ssh/deploy.key ${{ secrets.USERNAME }}@${{ secrets.HOST }} '
            cd ~/app
            npm install
            pm2 start server.ts --name "plants-api" --interpreter ./node_modules/.bin/ts-node
            pm2 save
          '
```

### 3.3. Testar deploy automático

1. Faça alterações no código backend no seu ambiente local
2. Commit e push para o branch main
3. Observe a execução do workflow em GitHub > Actions
4. Verifique se as mudanças foram aplicadas na EC2

## 4. Verificando a API

### 4.1. Testar a API

Utilize curl ou um navegador para verificar se a API está funcionando corretamente:

```bash
# Verificar endpoint de saúde
curl http://SEU-IP:3000/api/health

# Listar plantas
curl http://SEU-IP:3000/api/plantas
```

### 4.2. Verificar logs da aplicação

Para verificar os logs da aplicação em caso de problemas:

```bash
# Conectar à instância
ssh -i "plants-api-key.pem" ec2-user@SEU-IP

# Visualizar logs do PM2
pm2 logs plants-api

# Visualizar logs específicos
pm2 log plants-api --lines 100
```

### 4.3. Reiniciar a aplicação

Se for necessário reiniciar a aplicação:

```bash
pm2 restart plants-api
```

## 5. Resolução de Problemas Comuns

### 5.1. API não está acessível

Verifique se:
- A porta 3000 está aberta no Security Group da instância EC2
- O PM2 está executando o processo: `pm2 status`
- O servidor está ouvindo na porta 3000: `netstat -tulpn | grep 3000`
- Não há erros nos logs: `pm2 logs plants-api`

### 5.2. Erro ao conectar ao banco de dados

Verifique se:
- O diretório do banco de dados existe: `ls -la ~/app/database`
- As permissões do diretório são corretas: `chmod 777 ~/app/database`
- O arquivo do banco de dados foi criado: `ls -la ~/app/database/plants.db`

### 5.3. Problemas com dependências

Execute:
```bash
cd ~/app
rm -rf node_modules
npm install
pm2 restart plants-api
```

## 6. Monitoramento da Aplicação

### 6.1. Monitoramento básico com PM2

```bash
# Verificar status da aplicação
pm2 status

# Monitoramento em tempo real
pm2 monit
```

### 6.2. Configuração do PM2 para recuperação automática

O PM2 já reinicia automaticamente processos que falham, mas você pode configurar comportamentos adicionais:

```bash
# Reiniciar a cada 24 horas
pm2 start server.ts --name "plants-api" --interpreter ./node_modules/.bin/ts-node --cron-restart="0 0 * * *"

# Reiniciar se o uso de memória exceder 200MB
pm2 start server.ts --name "plants-api" --interpreter ./node_modules/.bin/ts-node --max-memory-restart 200M
```

Agora sua API Node.js está completamente configurada e rodando em sua instância EC2!