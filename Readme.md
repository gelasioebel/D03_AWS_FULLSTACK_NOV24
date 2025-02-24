# D03_AWS_FULLSTACK_NOV24

## README.md

# Sistema de Lojas de Plantas - Deploy AWS
**Nome:** [Seu Nome Completo]

**Informações de Acesso:**
- URL da aplicação: http://plants-frontend-[seu-nome].s3-website-[região].amazonaws.com
- Usuário de teste: admin
- Senha de teste: admin123

## Sobre o Projeto

Este projeto implementa um sistema de loja de plantas com frontend React hospedado no S3 e backend Node.js em instância EC2. O backend utiliza SQLite para o banco de dados. O deploy é automatizado via GitHub Actions.

## Arquitetura de Deployment

![Arquitetura de Deployment](https://github.com/[seu-usuario]/D03_AWS_FULLSTACK_NOV24/raw/master/docs/images/deployment-architecture.png)

O projeto está organizado da seguinte forma:
- **Frontend (S3)**: Interface de usuário em React
- **Backend (EC2)**: API em Node.js com Express
- **Banco de Dados**: SQLite no mesmo servidor do backend
- **CI/CD**: GitHub Actions para automação do deployment

## Documentação Detalhada

Para informações detalhadas sobre a configuração e o deployment, consulte os seguintes documentos:

1. [Criação da Instância EC2 para API](docs/api-instancia.md)
2. [Deploy da API Node.js](docs/deploy_backend.md)
3. [Deploy do Frontend React no S3](docs/deploy_frontend.md)

## Como Implantar Localmente

### Pré-requisitos
- Node.js 18.x ou superior
- npm 8.x ou superior
- Git

### Passos para execução local

1. Clone o repositório:
```bash
git clone https://github.com/[seu-usuario]/D03_AWS_FULLSTACK_NOV24.git
cd D03_AWS_FULLSTACK_NOV24
```

2. Execute o backend:
```bash
cd backend
npm install
npm start
```

3. Execute o frontend em outro terminal:
```bash
cd frontend
npm install
npm run dev
```

4. Acesse o aplicativo em http://localhost:5173

## Estrutura do Projeto

- `frontend/`: Código fonte do frontend React
- `backend/`: Código fonte da API Node.js
- `database/`: Scripts SQL e arquivo do banco de dados
- `docs/`: Documentação detalhada do deployment
- `.github/workflows/`: Arquivos de configuração do GitHub Actions para CI/CD

## Implantação na AWS

O projeto está atualmente implantado nos seguintes serviços AWS:

- Frontend: [S3 Bucket - URL pública](http://plants-frontend-[seu-nome].s3-website-[região].amazonaws.com)
- Backend: [EC2 Instance - API](http://[IP-DA-SUA-EC2]:3000)

## Notas Adicionais

- O banco de dados SQLite está localizado na mesma instância EC2 que a API por simplicidade
- Os arquivos de configuração do GitHub Actions estão na pasta `.github/workflows/`
- Os secrets necessários para deployment estão configurados no repositório GitHub
