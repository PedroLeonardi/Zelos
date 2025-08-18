
# Zelos - Sistema de Gestão de Chamados

<div align="center">

![Licença](https://img.shields.io/badge/licen%C3%A7a-MIT-green?style=for-the-badge)![Node.js](https://img.shields.io/badge/Node.js-14%2B-blue?style=for-the-badge&logo=node.js)![Next.js](https://img.shields.io/badge/Next.js-13%2B-lightgrey?style=for-the-badge&logo=next.js)![MySQL](https://img.shields.io/badge/MySQL-8.0-orange?style=for-the-badge&logo=mysql)

</div>

## 📌 Sobre o Projeto

O **Zelos** é um sistema de gerenciamento de chamados desenvolvido para a **Escola SENAI Armando de Arruda Pereira**. O objetivo da plataforma é centralizar e otimizar o controle de solicitações de manutenção, suporte técnico e outros serviços, utilizando o **número de patrimônio** dos itens como principal identificador.

Projetado para substituir controles manuais e descentralizados, o Zelos oferece uma visão completa do ciclo de vida de cada chamado — desde a abertura até a conclusão —, garantindo mais **transparência, eficiência e rastreabilidade** nos processos internos.

---

## 🧭 Índice

1.  [**Sobre o Projeto**](#-sobre-o-projeto)
2.  [**Índice**](#-índice)
3.  [**Demonstração Visual**](#-demonstração-visual)
4.  [**Tecnologias Utilizadas**](#-tecnologias-utilizadas)
5.  [**Estrutura do Projeto**](#-estrutura-do-projeto)
6.  [**Banco de Dados**](#-banco-de-dados)
7.  [**Como Executar o Projeto**](#-como-executar-o-projeto)
    -   [Pré-requisitos](#pré-requisitos)
    -   [Passo a Passo](#passo-a-passo)
8.  [**Autenticação via Active Directory (AD)**](#-autenticação-via-active-directory-ad)
9.  [**Autor**](#-autor)
10. [**Licença**](#-licença)

---

## 🖼️ Demonstração Visual


<p align="center">
  <img src="https://www.inova.unicamp.br/wp-content/uploads/2021/05/SENAI-SP.jpg" alt="Tela de Abertura de Chamados" width="80%">
  <br>
  <em>Tela principal onde os usuários podem abrir novos chamados.</em>
</p>

---

## 🛠️ Tecnologias Utilizadas

O projeto foi construído com as seguintes tecnologias:

| Ferramenta | Descrição |
| :--- | :--- |
| **Frontend** | [![Next.js][Next.js-badge]][Next.js-url] |
| **Backend** | [![Node.js][Node.js-badge]][Node.js-url] com [![Express.js][Express.js-badge]][Express.js-url] |
| **Banco de Dados** | [![MySQL][MySQL-badge]][MySQL-url] |
| **Driver Node.js** | `mysql2` |

[Next.js-badge]: https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white
[Next.js-url]: https://nextjs.org/
[Node.js-badge]: https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white
[Node.js-url]: https://nodejs.org/
[Express.js-badge]: https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white
[Express.js-url]: https://expressjs.com/
[MySQL-badge]: https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white
[MySQL-url]: https://www.mysql.com/

---

## 📂 Estrutura do Projeto

O projeto é um monorepo com os diretórios `frontend` e `backend` claramente separados.

```sh
Zelos/
├── 📁 backend/            # Aplicação Node.js/Express
│   ├── src/
│   └── database.sql    # Script de criação do banco
├── 📁 frontend/           # Aplicação Next.js
│   ├── public/         # Arquivos estáticos
│   ├── app/            # Estrutura de rotas e páginas
│   │   ├── admin/
│   │   ├── tecnico/
│   │   └── usuario/
│   ├── components/     # Componentes reutilizáveis
│   └── utils/          # Funções utilitárias
└── 📄 README.md
```

---

## 🗃️ Banco de Dados

O banco de dados utiliza **MySQL** e é estruturado com as seguintes tabelas principais:

| Tabela | Descrição |
| :--- | :--- |
| `usuarios` | Armazena dados de login e perfis de usuário (admin, técnico, comum). |
| `servicos` | Cataloga os tipos de serviços disponíveis (manutenção, suporte, etc.). |
| `patrimonio` | Contém o registro dos bens da escola, identificados por patrimônio. |
| `chamados` | Registra as solicitações, vinculando patrimônio, serviço e usuário. |
| `apontamentos` | Guarda os logs de trabalho dos técnicos (início, fim, duração). |
| `especialidades`| Associa técnicos aos serviços que estão aptos a executar. |

✨ Para facilitar a geração de relatórios, o banco também conta com a **`View_Chamados`**, uma visão que consolida informações relevantes.

---

## 🚀 Como Executar o Projeto

### Pré-requisitos

-   **Node.js**: `v14.x` ou superior.
-   **MySQL**: Servidor instalado e em execução.

### Passo a Passo

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/Paivs/Zelos.git
    cd Zelos
    ```

2.  **Instale as dependências** do frontend e do backend:
    ```bash
    # Instalar dependências do frontend
    cd frontend && npm install && cd ..

    # Instalar dependências do backend
    cd backend && npm install && cd ..
    ```

3.  **Configure o Banco de Dados:**
    -   Acesse seu cliente MySQL e crie o banco de dados:
        ```sql
        CREATE DATABASE zelos;
        ```
    -   Importe a estrutura das tabelas usando o script `database.sql`:
        ```bash
        mysql -u seu_usuario -p zelos < backend/database.sql
        ```        *(Substitua `seu_usuario` pelo seu usuário do MySQL).*

4.  **Execute a Aplicação:**
    -   Você precisará de **dois terminais** abertos simultaneamente.

    ```bash
    # No primeiro terminal, inicie o backend (porta 3001)
    cd backend && npm run dev
    ```

    ```bash
    # No segundo terminal, inicie o frontend (porta 3000)
    cd frontend && npm run dev
    ```

5.  **Acesse a aplicação** no seu navegador: [`http://localhost:3000`](http://localhost:3000).

---

## 🔐 Autenticação via Active Directory (AD)

O backend possui integração nativa com o **Active Directory (AD)** para autenticação.

-   **Endpoint:** `POST /auth/login`
-   **Corpo da Requisição (JSON):**
    ```json
    {
      "username": "seu_usuario_de_rede",
      "password": "sua_senha"
    }
    ```

⚠️ **Atenção:** Esta funcionalidade foi projetada para operar exclusivamente na rede interna da escola (cabeada ou Wi-Fi B07). Modificações no código de autenticação devem ser feitas com cautela para não comprometer a segurança.

---

## 👤 Autor

-   **[Paivs](https://github.com/Paivs)**

---

## 📄 Licença

Este projeto está licenciado sob a **Licença MIT**. Para mais detalhes, consulte o arquivo `LICENSE` no repositório.
```
