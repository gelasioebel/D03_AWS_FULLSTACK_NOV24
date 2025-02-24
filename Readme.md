# Squard-Desafio2-[Blumen]

Este repositório contém o desafio 2 da semana 8, onde recriamos um site para uma loja fictícia de plantas chamada Blumen, utilizando **React**, **TypeScript**. O projeto é composto por dois subprojetos: **Backend** (API) e **Frontend** (Web).

---

## **Sobre o Projeto**

O objetivo do desafio é criar uma aplicação que implemente uma loja virtual de plantas. A aplicação contém funcionalidades como registro de plantas, exibição em carrosséis na página inicial, validação de dados, e um sistema completo de rotas protegidas com integração de autenticação usando **Clerk**. O design é totalmente responsivo e segue o padrão fornecido no **Figma**.

Requisitos implementados:
- Design responsivo, fiel ao mockup.
- Rotas protegidas e navegação usando React Router.
- Persistência de dados em um banco de dados SQLite.
- Manipulação de formulários com validação com **Yup**.
- Integração do sistema de autenticação com **Clerk**.

---

## **Estrutura do Repositório**

O repositório possui dois subprojetos organizados da seguinte forma:

```plaintext
├── backend       # API Backend
│   ├── src
│   ├── database            # Banco de dados (SQLite com Sequelize)
│   ├── routes              # Rotas da aplicação
│   ├── controllers         # Controladores das requisições
│   ├── middlewares         # Middleware para validação de dados
│   └── app.ts              # Configuração principal do Express
│
├── database       # Arquivos Sqlite
│   ├── plantas.db           # Banco de dados SQLite com as tabelas de plantas e categorias.
│   ├── plantasDB.sql        # Script para criação das tabelas no banco de dados.
│   └── plantasDBInserts.sql # Script para inserção de dados iniciais no banco de dados.
├── frontend/       # Frontend do site
│   ├── src
│   │   ├── assets          # Imagens e arquivos estáticos
│   │   ├── components      # Componentes reutilizáveis do site
│   │   ├── hooks           # Hooks personalizados
│   │   ├── pages           # Páginas do site (Home, About, Register)
│   │   ├── router          # Configuração do React Router
│   │   ├── services        # Comunicação com a API
│   │   └── app.tsx         # Arquivo principal da aplicação
│   └── public              # Arquivos públicos do Vite
│
├── README.md               # Este arquivo
├── LICENSE                 # Licença do repositório
└── .gitignore              # Arquivos ignorados no Git
```

---

## **Tecnologias Utilizadas**

### **Frontend**
- **React 18** com **TypeScript**: Criação da interface do usuário.
- **Splide.js**: Carrossel para exibição de plantas.


### **Backend**
- **Node.js** com **Express**: Criação da API.
- **Sequelize**: ORM para SQLite.
- **Yup**/**Zod**: Validação dos dados.
- **TS-Node**: Execução de TypeScript no ambiente Node.js.

### **Ambas as Partes**
- **Vite**: Ferramenta de build rápido para o Frontend.
- **Eslint**: Linter e boa organização do código.

---

## **Funcionalidades**

### Requisitos Obrigatórios
1. **Header e Footer**
    - Ícone de perfil importado do Clerk.
    - Links de navegação (Home, Register, About Us).
    - Responsividade.

2. **Rotas Protegidas**
    - Using Clerk para autenticação.
    - Rotas protegidas para acesso apenas por usuários autenticados.

3. **Página Home**
    - Dois carrosséis:
        - Plantas normais.
        - Plantas em promoção (cálculo de desconto automático).
    - Atualização em tempo real ao cadastrar uma planta.

4. **Página Register**
    - Formulário validado com campos obrigatórios.
    - Envio das informações diretamente para o banco de dados.
    - Registro de novos tipos de plantas.

5. **Página About Us**
    - Informações sobre os desenvolvedores, seguindo o padrão de design do Figma.

6. **Banco de Dados**
    - Estrutura JSON para plantas:
      ```json
      {
        "id": 1,
        "name": "Echinocereus Cactus",
        "subtitle": "A Majestic Addition to Your Plant Collection",
        "label": ["indoor", "cactus"],
        "price": "$139.99",
        "isInSale": true,
        "discountPercentage": 20,
        "features": "Species: Echinocereus spp., Size: Varies, Bloom: ...",
        "description": "Ladyfinger cactus (Echinocereus pentalophus)...",
        "imgUrl": "./assets/plant.png"
      }
      ```
    - Tabela separada para tipos de plantas.

7. **Validações**
    - Todos os campos do formulário de registro.
    - Salvamento dos dados com validação via middleware.

---

## **Passos para Executar**

### **Pré-requisitos**
- **Node.js v18** ou superior.
- **NPM** ou **Yarn** para gerenciar pacotes.

### **Clonando o Repositório**
```bash
git clone https://github.com/adriannparanhos/-squad-desafio2-blumen.git
cd https://github.com/adriannparanhos/-squad-desafio2-blumen.git
```

### **Executando o Backend**
1. Navegue até o diretório do backend:
   ```bash
   cd backend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor:
   ```bash
   npm start
   ```

### **Executando o Frontend**
1. Navegue até o diretório do frontend:
   ```bash
   cd frontend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

---

## **Colaboradores**
- Estudantes:
- - Adriann Postigo Paranhos
- - Gelasio Ebel Junior
- - Thomas Henrique de Souza Santos
- - Rodrigo Soares Prazeres
- Intrutores:
- - Ariel Souza
- - Gilberto Medeiros
- - Lucas Gauto
- - Raul Rosa