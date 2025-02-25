# Deploy do Frontend React no S3

Este guia descreve como realizar o deploy do frontend React do sistema de plantas em um bucket S3 da AWS.

## 1. Criando o Bucket S3

1. No Console AWS, pesquise por "S3" e clique no serviço
2. Clique no botão "Create bucket"

![S3 Dashboard](imagens/s3-dashboard.png)

3. Configure o bucket:
   - Bucket name: `plants-frontend-[seu-nome]` (nomes de bucket devem ser globalmente únicos)
   - AWS Region: escolha a mesma região da sua instância EC2
   - Desmarque "Block all public access" (pois queremos que o site seja público)
   - Marque a caixa de confirmação abaixo reconhecendo que o bucket será público

![S3 Configuração](imagens/s3-config.png)

4. Mantenha as demais configurações padrão e clique em "Create bucket"

## 2. Configurando o Bucket para Website Estático

1. Clique no bucket recém-criado
2. Vá para a aba "Properties"
3. Role até encontrar "Static website hosting"
4. Clique em "Edit"

![S3 Static Web](imagens/s3-static-web.png)

5. Configure:
   - Static website hosting: Enable
   - Hosting type: Host a static website
   - Index document: index.html
   - Error document: index.html (para permitir que o React Router funcione corretamente)
   - Clique em "Save changes"

6. Volte à aba "Properties" e encontre o "Static website hosting"
7. Copie o "Bucket website endpoint" - esse será o URL da sua aplicação

## 3. Configurando a Política do Bucket

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

## 4. Criando Usuário IAM para Deploy

Para permitir que o GitHub Actions faça deploy em seu bucket, criaremos um usuário IAM:

1. No Console AWS, pesquise por "IAM" e clique no serviço
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

## 5. Configurando o GitHub Actions para Deploy

1. No seu repositório GitHub, vá para Settings > Secrets and variables > Actions
2. Adicione os seguintes secrets:
   - `AWS_ACCESS_KEY_ID`: Access Key que você recebeu
   - `AWS_SECRET_ACCESS_KEY`: Secret Key que você recebeu
   - `AWS_REGION`: Região que você escolheu (ex: us-east-1)
   - `S3_BUCKET`: plants-frontend-[seu-nome]
   - `REACT_APP_API_URL`: http://[IP-DA-SUA-EC2]:3000/api

![GitHub Frontend Secrets](imagens/github-frontend-secrets.png)

3. Crie o arquivo `.github/workflows/deploy-frontend.yml`:

```yaml
name: Deploy Frontend to S3

on:
  push:
    branches: [ master, main ]
    paths:
      - 'frontend/**'
      - '.github/workflows/deploy-frontend.yml'

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install Dependencies
        run: |
          cd frontend
          npm install
      
      - name: Build Frontend
        run: |
          cd frontend
          # Create .env file with API URL
          echo "VITE_API_URL=${{ secrets.REACT_APP_API_URL }}" > .env
          npm run build
      
      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ secrets.AWS_REGION }}
      
      - name: Deploy to S3
        run: |
          cd frontend
          aws s3 sync dist/ s3://${{ secrets.S3_BUCKET }} --delete
```

4. Faça commit e push desse arquivo para seu repositório

## 6. Deploy Manual Inicial (Opcional)

Se quiser fazer um deploy inicial manual:

1. No seu ambiente local:
```bash
cd frontend

# Crie um arquivo .env com a URL da API
echo "VITE_API_URL=http://[IP-DA-SUA-EC2]:3000/api" > .env

# Build do projeto
npm run build
```

2. Instale a AWS CLI e configure com suas credenciais:
```bash
# Instalar AWS CLI (se ainda não tiver)
pip install awscli --upgrade --user

# Configurar credenciais
aws configure
# Digite Access Key, Secret Key, Region quando solicitado
```

3. Faça upload para o S3:
```bash
aws s3 sync dist/ s3://plants-frontend-[seu-nome] --delete
```

## 7. Testando o Frontend

1. Acesse a URL do seu bucket S3:
   - http://plants-frontend-[seu-nome].s3-website-[região].amazonaws.com

2. Verifique se o frontend consegue se comunicar com a API backend:
   - Verifique se as plantas estão sendo carregadas
   - Tente registrar uma nova planta
   - Verifique se o login/registro está funcionando

## 8. Solução de Problemas Comuns

### 8.1. O frontend não carrega

Verifique se:
- A política do bucket está correta e permite acesso público
- O hosting de site estático está habilitado
- O documento de índice está configurado como "index.html"

### 8.2. Erro de CORS

Se o frontend não conseguir acessar a API devido a erros de CORS:
1. Verifique a configuração CORS no backend
2. Certifique-se de que a API está aceitando solicitações do domínio do S3
3. Verifique se a URL da API está correta no arquivo `.env`

### 8.3. Problemas no GitHub Actions

Se o deploy automático falhar:
1. Verifique os logs do GitHub Actions para identificar o problema
2. Confirme se os secrets estão configurados corretamente
3. Verifique se o arquivo YAML está formatado corretamente

### 8.4. Arquivos não atualizados no S3

Se os arquivos não forem atualizados após um novo deploy:
1. Verifique se o cache do navegador não está mostrando uma versão antiga
2. Confirme se o deploy foi bem-sucedido no GitHub Actions
3. Verifique se os arquivos foram atualizados no console do S3

## 9. Invalidação de Cache CloudFront (Opcional)

Se você decidir usar o CloudFront para melhorar a performance de entrega do seu site:

1. Configure uma distribuição CloudFront apontando para seu bucket S3
2. Adicione um passo adicional em seu workflow para invalidar o cache após o deploy:

```yaml
- name: Invalidate CloudFront
  run: |
    aws cloudfront create-invalidation --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} --paths "/*"
```

Seu frontend React agora está hospedado no S3 e configurado para deploy automático via GitHub Actions!
