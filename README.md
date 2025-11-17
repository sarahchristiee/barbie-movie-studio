# 💖 Barbie Movie Studio 🎬

## ✨ Sobre o Projeto

O **Barbie Movie Studio** é um sistema completo de catálogo da
filmografia da Barbie, desenvolvido como projeto para formação de um
curso técnico, com foco em demonstrar habilidades em desenvolvimento
**Full Stack**.

A plataforma disponibiliza um **catálogo detalhado** de filmes, com
informações completas sobre cada título. O grande diferencial é o
sistema de **contribuição** e **moderação**:

-   **Usuário Padrão:** pode visualizar todos os filmes e enviar
    **solicitações** de criação de novos filmes ou edição de filmes
    existentes.\
-   **Administrador (Admin):** possui acesso total para **criar, editar
    e excluir filmes**, além de **aprovar ou rejeitar** solicitações
    enviadas pelos usuários.

### 📽️ Informações dos Filmes

Cada filme contém:

-   **Título**
-   **Orçamento**
-   **Ano**
-   **Diretor**
-   **Produtora**
-   **Sinopse**
-   **Link do pôster** (imagem)
-   **Link do trailer do YouTube**

------------------------------------------------------------------------

## 🛠️ Tecnologias Utilizadas

Este projeto é uma aplicação **Full Stack** dividida em duas partes:

  --------------------------------------------------------------------------
  Componente                   Tecnologia                   Detalhe
  ---------------------------- ---------------------------- ----------------
  **Backend**                  **Python**                   Utiliza um HTTP
                                                            Server
                                                            customizado para
                                                            lidar com rotas
                                                            e lógica de
                                                            negócio (CRUD e
                                                            solicitações).

  **Frontend**                 **React (JavaScript)**       Responsável pela
                                                            interface de
                                                            usuário moderna
                                                            e responsiva.

  **Banco de Dados**           **MySQL**                    Persistência dos
                                                            dados de Filmes,
                                                            Usuários e
                                                            Solicitações.
  --------------------------------------------------------------------------

------------------------------------------------------------------------

## 🔑 Credenciais de Acesso (Teste)

Use as credenciais abaixo para acessar o ambiente de testes:

  ----------------------------------------------------------------------------
  Tipo de Usuário       E-mail                Senha         Permissões
  --------------------- --------------------- ------------- ------------------
  **Usuário Padrão**    `user@user.com`       `user123`     Visualizar
                                                            catálogo e enviar
                                                            solicitações.

  **Administrador**     `admin@admin.com`     `admin123`    CRUD completo +
                                                            aprovar/reprovar
                                                            solicitações.
  ----------------------------------------------------------------------------

------------------------------------------------------------------------

## 🚀 Como Executar o Projeto

### 1. ⚙️ Configuração do Banco de Dados

O projeto utiliza um banco de dados **MySQL**.

#### a. Executar o servidor MySQL

Certifique-se de que o MySQL Workbench (ou outro servidor MySQL) esteja
rodando.

#### b. Ajustar credenciais no backend (Python)

``` python
mydb = pymysql.connect(
    host="localhost",
    user="root",       # Ajuste conforme seu MySQL
    password="root",   # Ajuste conforme seu MySQL
    database="filmes",
    charset="utf8mb4",
    cursorclass=pymysql.cursors.DictCursor,
    autocommit=False
)
```

------------------------------------------------------------------------

### 2. 🐍 Execução do Backend (Python)

Acesse o diretório do backend, instale as dependências e inicie o
servidor.

#### a. Instalar dependências

``` bash
cd backend/
pip install -r requirements.txt
```

#### b. Inicializar o banco de dados

Execute os scripts SQL para criar as tabelas e inserir os dados
iniciais, incluindo:

-   credenciais de teste
-   login:`user@user.com` senha: `user123` (acesso de usuário padrão, tem acesso aos filmes e pode enviar solicitações de adiçao e ediçãi)
-   login:`admin@admin.com` senha: `admin123` (acesso admin, pode fazer CRUD e aceitar e recusar solicitação de usuários)


#### c. Rodar o servidor

``` bash
python seu_servidor_principal.py
```

------------------------------------------------------------------------

### 3. ⚛️ Execução do Frontend (React)

Acesse o diretório do frontend, instale as dependências e execute o
projeto:

#### a. Instalar dependências

``` bash
cd ../frontend/
npm install
# ou
yarn install
```

#### b. Rodar o frontend

``` bash
npm start
# ou
yarn start
```

O frontend abrirá automaticamente em:\
👉 **http://localhost:3000**

------------------------------------------------------------------------

## 🔗 Links e Documentação

  ----------------------------------------------------------------------------
  Item                   Descrição                        Link
  ---------------------- -------------------------------- --------------------
  **Figma                Protótipo e sistema de design do \[INSERIR LINK DO
  (Protótipo/Design)**   projeto.                         FIGMA\]

  **Documentação         Documento com contexto,          \[INSERIR LINK DA
  Técnica**              arquitetura e padrões de design. DOCUMENTAÇÃO\]
  ----------------------------------------------------------------------------
