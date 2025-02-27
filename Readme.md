# Sistema de Lojas de Plantas - Deploy AWS

**Nome:** Gelasio Ebel Junior github.com/gelasioebel 

**Informações de Acesso:**
- URL da aplicação:http://d03frontend.s3-website.us-east-2.amazonaws.com/
- Usuário de teste: admin
- Senha de teste: admin123

## Sobre o Projeto

Este projeto implementa um sistema de loja online de plantas com:
- Frontend React hospedado no S3
- Backend Node.js/Express em uma instância EC2
- Banco de dados SQLite no mesmo servidor do backend
- Deploy automatizado usando GitHub Actions

## Arquitetura

![Arquitetura de Deployment](docs/imagens/deployment-architecture.png)

A aplicação consiste em:
- **Frontend (S3)**: Interface React com Vite
- **Backend (EC2)**: API REST em Node.js/Express
- **Banco de Dados**: SQLite no mesmo servidor EC2
- **CI/CD**: GitHub Actions para deploy automático

## Documentação

Para a configuração e deploy completos, consulte:

1. [Criação da Instância EC2 para API](docs/api-instancia.md)
2. [Deploy da API Node.js](docs/deploy_backend.md)
3. [Deploy do Frontend React no S3](docs/deploy_frontend.md)

## Funcionalidades Principais

- Visualização de catálogo de plantas
- Detalhes de cada planta
- Cadastro de novas plantas
- Carrinho de compras (em desenvolvimento)
- Filtro por categoria e preço
- Promoções e descontos

## Tecnologias Utilizadas

### Frontend
- React 18
- TypeScript
- Vite
- React Router
- Clerk (autenticação)
- Axios

### Backend
- Node.js
- Express
- TypeScript
- SQLite (via better-sqlite3)
- PM2 (gerenciamento de processos)

### DevOps
- AWS S3 (hosting de frontend)
- AWS EC2 (hosting de backend)
- GitHub Actions (CI/CD)

## Execução Local

### Pré-requisitos
- Node.js 18.x ou superior
- npm 8.x ou superior
- Git

### Passos para execução

1. Clone o repositório:
```bash
git clone https://github.com/[seu-usuario]/D03_AWS_FULLSTACK_NOV24.git
cd D03_AWS_FULLSTACK_NOV24
```

2. Execute o backend:
```bash
cd backend
npm install
npm run dev
```

3. Em outro terminal, execute o frontend:
```bash
cd frontend
npm install
npm build
```

4. Acesse o aplicativo em http://localhost:5173

## Estrutura do Projeto

```
📦 D03_AWS_FULLSTACK_NOV24
 ┣ 📂 .github
 ┃ ┗ 📂 workflows
 ┃   ┣ 📜 deploy-backend.yml
 ┃   ┗ 📜 deploy-frontend.yml
 ┣ 📂 backend
 ┃ ┣ 📂 src
 ┃ ┃ ┣ 📂 controller
 ┃ ┃ ┣ 📂 database
 ┃ ┃ ┣ 📂 middlewares
 ┃ ┃ ┗ 📂 routes
 ┃ ┣ 📜 server.ts
 ┃ ┗ 📜 package.json
 ┣ 📂 database
 ┃ ┣ 📜 plantasDB.sql
 ┃ ┗ 📜 plantasDBInserts.sql
 ┣ 📂 docs
 ┃ ┣ 📂 imagens
 ┃ ┣ 📜 api-instancia.md
 ┃ ┣ 📜 deploy_backend.md
 ┃ ┗ 📜 deploy_frontend.md
 ┣ 📂 frontend
 ┃ ┣ 📂 components
 ┃ ┣ 📂 layouts
 ┃ ┣ 📂 pages
 ┃ ┣ 📂 types
 ┃ ┣ 📂 utils
 ┃ ┣ 📜 index.html
 ┃ ┣ 📜 main.tsx
 ┃ ┗ 📜 package.json
 ┗ 📜 README.md
```

## Deploy e CI/CD

O projeto utiliza GitHub Actions para deploy automático:

1. Quando há um push na branch main que afeta o frontend, o workflow `deploy-frontend.yml` é acionado, fazendo build e implantação no S3

2. Quando há um push na branch main que afeta o backend, o workflow `deploy-backend.yml` é acionado, implantando a API na instância EC2

Para configuração detalhada, consulte a documentação em `/docs`.

## Acessando a Aplicação

Frontend: http://d03frontend.s3-website.us-east-2.amazonaws.com/

API: http://[IP-DA-SUA-EC2]:3000/api

## Avaliação e Apresentação

Durante a avaliação, será necessário:
1. Demonstrar o console AWS com os serviços em execução
2. Realizar um novo deploy usando apenas a documentação como referência
3. Mostrar as funcionalidades da aplicação em funcionamento

## Contato

Para dúvidas ou problemas relacionados a este projeto, entre em contato através do e-mail [seu-email@exemplo.com].
