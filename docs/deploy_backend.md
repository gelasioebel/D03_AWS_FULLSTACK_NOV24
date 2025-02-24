## deploy_backend.md

# Deploy da API Node.js

### 1. Preparando o Ambiente na EC2

1. Conecte-se à instância via SSH:
```bash
# Ajuste as permissões do arquivo .pem
chmod 400 plants-api-key.pem

# Conecte à instância (substitua o IP)
ssh -i "plants-api-key.pem" ec2-user@[SEU-IP-AQUI]
```

![Conexão SSH](imagens/ssh-connection.png)

2. Atualize o sistema:
```bash
sudo yum update -y
```

3. Instale o Node.js via NVM:
```bash
# Instale o NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Ative o NVM
source ~/.bashrc

# Instale Node.js
nvm install 16

# Verifique a instalação
node --version
npm --version
```

![Instalação Node.js](imagens/nodejs-install.png)

4. Instale o PM2 para gerenciar o processo:
```bash
npm install -g pm2
```

5. Prepare o diretório para aplicação e banco SQLite:
```bash
# Crie os diretórios
mkdir -p ~/app/database

# Ajuste permissões para o SQLite
chmod 777 ~/app/database
```

### 2. Deploy Manual (para testes iniciais)

1. Clone seu repositório na instância:
```bash
cd ~
git clone https://github.com/[seu-usuario]/[seu-repositorio].git app
cd app
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
# Crie o arquivo .env
cat > .env << EOF
DATABASE_URL=sqlite:///database/database.sqlite
PORT=3000
EOF
```

4. Inicie a aplicação com PM2:
```bash
pm2 start npm --name "plants-api" -- start
```

5. Configure o PM2 para iniciar com o sistema:
```bash
pm2 startup
# Execute o comando que será exibido
pm2 save
```

![PM2 Running](imagens/pm2-running.png)

### 3. Configuração do Deploy Automático

1. No GitHub, vá para Settings > Secrets and variables > Actions
2. Adicione os seguintes secrets:
    - `SSH_PRIVATE_KEY`: Conteúdo completo do arquivo .pem
    - `HOST`: IP público da sua instância
    - `USERNAME`: ec2-user

![GitHub Secrets](imagens/github-secrets.png)

3. Crie o arquivo de workflow `.github/workflows/deploy.yml`:

```yaml
name: Deploy to EC2

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
          
      - name: Install Dependencies
        run: npm install
        
      - name: Create SSH key
        run: |
          mkdir -p ~/.ssh/
          echo "${{ secrets.SSH_PRIVATE_KEY }}" > ~/.ssh/deploy.key
          chmod 600 ~/.ssh/deploy.key
          ssh-keyscan -H ${{ secrets.HOST }} >> ~/.ssh/known_hosts
          
      - name: Deploy to EC2
        run: |
          # Stop any running application
          ssh -i ~/.ssh/deploy.key ${{ secrets.USERNAME }}@${{ secrets.HOST }} 'pm2 delete plants-api || true'
          
          # Create app directory if it doesn't exist
          ssh -i ~/.ssh/deploy.key ${{ secrets.USERNAME }}@${{ secrets.HOST }} 'mkdir -p /home/ec2-user/app/database && chmod 777 /home/ec2-user/app/database'
          
          # Copy files
          scp -i ~/.ssh/deploy.key -r ./* ${{ secrets.USERNAME }}@${{ secrets.HOST }}:/home/ec2-user/app
          
          # Install and start
          ssh -i ~/.ssh/deploy.key ${{ secrets.USERNAME }}@${{ secrets.HOST }} 'cd /home/ec2-user/app && npm install && pm2 start npm --name "plants-api" -- start'
```

4. Faça commit e push desse arquivo para seu repositório.

### 4. Testando o Deploy Automático

1. Faça alterações no código no seu ambiente local
2. Commit e push para a branch main
3. Observe a execução do workflow em GitHub > Actions
4. Verifique se as mudanças foram aplicadas na EC2

![GitHub Actions Running](imagens/github-actions.png)

### 5. Verificando a API

1. Teste a API usando curl ou navegador:
```bash
curl http://[SEU-IP]:3000/health
```

2. Para verificar logs da aplicação:
```bash
ssh -i "plants-api-key.pem" ec2-user@[SEU-IP]
pm2 logs plants-api
```

---