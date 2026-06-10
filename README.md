# Plataforma de Cursos

## Descrição do Projeto

Este projeto consiste em uma plataforma de cursos online desenvolvida em um ciclo de 3 Sprints, com foco em funcionalidades essenciais para o gerenciamento de usuários, cursos e conformidade com a Lei Geral de Proteção de Dados (LGPD). A plataforma permite o cadastro e login de usuários, listagem e inscrição em cursos, acompanhamento de progresso, edição de dados pessoais, além de funcionalidades de consentimento de marketing e auditoria de autenticação.

## Funcionalidades

As funcionalidades foram desenvolvidas em três Sprints, conforme detalhado abaixo:

### Sprint 1

*   **Cadastro de Usuário (HU01):** Permite que visitantes se cadastrem na plataforma com nome, e-mail e senha, para acessar os cursos.
*   **Login (HU02):** Permite que usuários façam login com e-mail e senha para acessar suas contas com segurança.
*   **Listagem de Cursos (HU05):** Exibe os cursos disponíveis para que os usuários possam escolher o que estudar.

### Sprint 2
*   **Edição de Dados do Usuário (HU03):** Permite que usuários atualizem seus dados pessoais (nome, e-mail).
*   **Exclusão de Conta (HU04):** Permite que usuários excluam suas contas, removendo ou anonimizando seus dados da plataforma.
*   **Inscrição em Cursos (HU06):** Permite que usuários se inscrevam em cursos para começar a estudar.
*   **Acompanhamento de Progresso (HU07):** Permite que usuários visualizem seu progresso nos cursos para acompanhar sua evolução.

### Sprint 3

*   **Consentimento para Marketing (HU08):** Permite que usuários autorizem o uso de seu e-mail para marketing, com consentimento opcional e registrado.
*   **Revogação de Consentimento (HU09):** Permite que usuários cancelem o consentimento de marketing de forma imediata.
*   **Gerenciamento de Dados Pessoais (HU10):** Permite que usuários visualizem, corrijam e excluam seus dados pessoais, exercendo seus direitos previstos na LGPD.
*   **Armazenamento Seguro de Senha (HU11):** O sistema armazena senhas utilizando hash seguro para proteger credenciais.
*   **Registro de Logs de Autenticação (HU12):** O sistema registra eventos de login e logout para permitir auditoria básica, incluindo ID do usuário, data/hora e endereço IP.

## Tecnologias Utilizadas

*   **Frontend:** HTML, JavaScript
*   **Backend:** Node.js
*   **Banco de Dados:** MySQL (utilizando `mysql2`)
*   **Segurança:** `bcrypt` para hash de senhas, `cors` para controle de acesso.

## Estrutura do Projeto

O repositório contém os seguintes arquivos principais:

*   `.gitignore`: Arquivo para ignorar arquivos e diretórios específicos do controle de versão.
*   `cursos.html`: Página para listagem e gerenciamento de cursos.
*   `login.html`: Página de login de usuários.
*   `logs.html`: Página para visualização de logs de autenticação.
*   `package.json`: Define as dependências do projeto e scripts (Node.js).
*   `package-lock.json`: Garante que as dependências instaladas sejam as mesmas em diferentes ambientes.
*   `perfil.html`: Página para gerenciamento do perfil do usuário e dados pessoais.
*   `server.js`: Servidor backend Node.js que lida com as requisições da aplicação.

## Como Rodar o Projeto

Para configurar e executar o projeto localmente, siga os passos abaixo:

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/nicol8bit/plataforma-de-cursos.git
    cd plataforma-de-cursos
    ```

2.  **Instale as dependências do Node.js:**
    ```bash
    npm install
    ```

3.  **Configure o banco de dados MySQL:**
    *   Crie um banco de dados MySQL.
    *   Atualize as credenciais de conexão no arquivo `server.js` (ou crie um arquivo de configuração de ambiente, se preferir).

4.  **Inicie o servidor:**
    ```bash
    node server.js
    ```

5.  **Acesse a aplicação:**
    Abra seu navegador e acesse `http://localhost:3000` (ou a porta configurada no `server.js`).

## Gerenciamento do Projeto

O projeto foi gerenciado utilizando a metodologia Scrum, dividido em 3 Sprints de aproximadamente uma semana cada. O Jira foi a ferramenta utilizada para o gerenciamento do backlog e das Sprints. Ao final de cada Sprint, foram realizadas apresentações para demonstrar o progresso e as funcionalidades desenvolvidas.

## Conformidade com a LGPD

Um dos pilares do desenvolvimento desta plataforma foi a conformidade com a Lei Geral de Proteção de Dados (LGPD). Todas as funcionalidades relacionadas ao tratamento de dados pessoais, como cadastro, edição, exclusão, consentimento de marketing e logs de autenticação, foram implementadas considerando os princípios e direitos estabelecidos pela lei, garantindo a segurança e a privacidade dos dados dos usuários.
