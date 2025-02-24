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