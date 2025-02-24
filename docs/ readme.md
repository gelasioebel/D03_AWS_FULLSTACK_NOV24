# D03_AWS_FULLSTACK_NOV24

## README.md

# Sistema de Lojas de Plantas - Deploy AWS
**Nome:** [Seu Nome Completo]

**Informações de Acesso:**
- URL da aplicação: http://plants-frontend-[seu-nome].s3-website-[região].amazonaws.com
- Usuário de teste: admin
- Senha de teste: admin123

---

## api-instancia.md

# Criação da Instância EC2 para API

### 1. Acessando o AWS Console
1. Abra seu navegador e acesse o console AWS: https://aws.amazon.com
2. Faça login com suas credenciais
3. Você será direcionado para o dashboard AWS

![AWS Console Login](imagens/aws-console.png)

### 2. Navegação para EC2
1. No campo de busca superior, digite "EC2"
2. Selecione "EC2" nos resultados da pesquisa

![Busca por EC2](imagens/busca-ec2.png)

### 3. Criando a Instância
1. Na dashboard do EC2, clique no botão laranja "Launch Instance"

![Launch Instance](imagens/launch-instance.png)

2. Em "Name and tags", digite "plants-api"

![Nome da Instância](imagens/instance-name.png)

3. Em "Application and OS Images":
    - Mantenha "Amazon Linux 2023 AMI" selecionado
    - Verifique se mostra "Free tier eligible"

![Seleção de AMI](imagens/ami-selection.png)

4. Em "Instance type":
    - Selecione "t2.micro"
    - Verifique se mostra "Free tier eligible"

![Tipo de Instância](imagens/instance-type.png)

5. Em "Key pair":
    - Clique em "Create new key pair"
    - Nome: plants-api-key
    - Tipo: RSA
    - Formato: .pem
    - Clique em "Create key pair"
    - O arquivo .pem será baixado automaticamente - guarde-o em local seguro!

![Criação de Key Pair](imagens/key-pair.png)

6. Em "Network settings":
    - Mantenha a VPC padrão
    - Auto-assign public IP: Enable

7. Configure "Firewall (security groups)":
    - Selecione "Create security group"
    - Security group name: plants-api-sg
    - Description: "Security group for Plants API"

8. Configure Inbound Rules (regras de entrada):
    - Mantenha a regra SSH (porta 22)
    - Clique em "Add security group rule" para adicionar:

      a) HTTP:
        - Type: HTTP
        - Source: Anywhere-IPv4

      b) API:
        - Type: Custom TCP
        - Port range: 3000
        - Source: Anywhere-IPv4
        - Description: "API port"

![Security Group](imagens/security-group.png)

9. Em "Configure storage":
    - Mantenha 8 GB (padrão)
    - Tipo: gp2

10. Revise todas as configurações e clique em "Launch instance"

11. Após a criação, clique em "View all instances"

### 4. Acessando a Instância
1. Na lista de instâncias, encontre a "plants-api"
2. Aguarde até o "Instance State" mostrar "Running"
3. Copie o "Public IPv4 address" exibido

![IP da Instância](imagens/instance-ip.png)

---

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

## deploy_frontend.md

# Deploy do Frontend React no S3

### 1. Criando o Bucket S3

1. No Console AWS, procure por "S3"
2. Clique em "Create bucket"

![S3 Dashboard](imagens/s3-dashboard.png)

3. Configure o bucket:
    - Bucket name: `plants-frontend-[seu-nome]`
    - AWS Region: mesma região da sua EC2
    - Desmarque "Block all public access"
    - Marque a caixa de confirmação abaixo

![S3 Configuração](imagens/s3-config.png)

4. Mantenha as demais configurações padrão e clique em "Create bucket"

### 2. Configurando o Bucket para Website Estático

1. Clique no bucket recém-criado
2. Vá para a aba "Properties"
3. Role até encontrar "Static website hosting"
4. Clique em "Edit"

![S3 Static Web](imagens/s3-static-web.png)

5. Configure:
    - Static website hosting: Enable
    - Hosting type: Host a static website
    - Index document: index.html
    - Error document: index.html
    - Clique em "Save changes"

6. Volte à aba "Properties" e encontre o "Static website hosting"
7. Copie o "Bucket website endpoint" - esse será o URL da sua aplicação

### 3. Configurando a Política do Bucket

1. Vá para a aba "Permissions"
2. Role até "Bucket policy"
3. Clique em "Edit"
4. Cole esta política (substitua o nome do seu bucket):

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::plants-frontend-[seu-nome]/*"
        }
    ]
}
```

![S3 Policy](imagens/s3-policy.png)

5. Clique em "Save changes"

### 4. Criando Usuário IAM para Deploy

1. No Console AWS, procure por "IAM"
2. No menu lateral, clique em "Users"
3. Clique em "Add users"

![IAM Add User](imagens/iam-add-user.png)

4. Configure:
    - User name: `github-actions-s3`
    - Selecione "Access key - Programmatic access"
    - Clique em "Next: Permissions"

5. Em "Set permissions":
    - Selecione "Attach existing policies directly"
    - Pesquise e marque "AmazonS3FullAccess"
    - Clique em "Next: Tags"

6. Skip Tags e clique em "Next: Review"
7. Revise e clique em "Create user"
8. **IMPORTANTE**: Salve o "Access key ID" e "Secret access key" mostrados. Você não poderá ver a Secret key novamente!

![IAM Credentials](imagens/iam-credentials.png)

### 5. Configurando o GitHub Actions para Deploy do Frontend

1. No seu repositório GitHub, vá para Settings > Secrets > Actions
2. Adicione os seguintes secrets:
    - `AWS_ACCESS_KEY_ID`: Access Key que você recebeu
    - `AWS_SECRET_ACCESS_KEY`: Secret Key que você recebeu
    - `AWS_REGION`: Região que você escolheu (ex: us-east-1)
    - `S3_BUCKET`: plants-frontend-[seu-nome]
    - `REACT_APP_API_URL`: http://[IP-DA-SUA-EC2]:3000

![GitHub Frontend Secrets](imagens/github-frontend-secrets.png)

3. Crie o arquivo `.github/workflows/deploy-frontend.yml`:

```yaml
name: Deploy Frontend to S3

on:
  push:
    branches: [ main ]
    paths:
      - 'frontend/**'  # Ajuste conforme a estrutura do seu repositório

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      
      - name: Install Dependencies
        run: |
          cd frontend  # Ajuste conforme a estrutura do seu repositório
          npm install
      
      - name: Build
        run: |
          cd frontend  # Ajuste conforme a estrutura do seu repositório
          REACT_APP_API_URL=${{ secrets.REACT_APP_API_URL }} npm run build
      
      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ secrets.AWS_REGION }}
      
      - name: Deploy to S3
        run: |
          cd frontend  # Ajuste conforme a estrutura do seu repositório
          aws s3 sync build/ s3://${{ secrets.S3_BUCKET }} --delete
```

4. Faça commit e push desse arquivo para seu repositório

### 6. Deploy Manual Inicial (Opcional)

Se quiser fazer um deploy inicial manual:

1. No seu ambiente local:
```bash
cd frontend
REACT_APP_API_URL=http://[IP-DA-SUA-EC2]:3000 npm run build
```

2. Instale a AWS CLI e configure com suas credenciais:
```bash
aws configure
# Digite Access Key, Secret Key, Region
```

3. Faça upload para o S3:
```bash
aws s3 sync build/ s3://plants-frontend-[seu-nome] --delete
```

### 7. Testando o Frontend

1. Acesse a URL do seu bucket S3:
    - http://plants-frontend-[seu-nome].s3-website-[região].amazonaws.com

2. Faça login com as credenciais configuradas:
    - Usuário: admin
    - Senha: admin123

3. Verifique se o frontend consegue se comunicar com a API backend