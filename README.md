# Vendio Frontend 🛍️

Plataforma frontend moderna desenvolvida em **Next.js** para o ecossistema **Vendio** — um SaaS completo de e-commerce, gestão de vendas, produtos, clientes e vitrines personalizadas para lojistas.

---

## 📌 Sobre o Projeto

O **Vendio** é uma solução completa para lojistas e empreendedores que buscam gerenciar suas operações de vendas online e físicas de forma simplificada, elegante e eficiente. 

Este repositório contém a aplicação web frontend construída com **Next.js (App Router)** e **TypeScript**, responsável pelas interfaces administrativas da plataforma, área do cliente e vitrines públicas de lojas.

---

## ✨ Principais Funcionalidades

- **📊 Dashboard Administrativo**: Visão consolidada de desempenho, métricas de vendas, faturamento e atividades recentes.
- **📦 Gestão de Produtos**: Cadastro de itens, controle de estoque, preços e categorização.
- **💳 Gestão de Vendas & Financeiro**: Histórico de pedidos, status de pagamento, relatórios financeiros e fluxo de caixa.
- **👥 Gestão de Clientes**: CRM integrado para gerenciamento da base de compradores e histórico de consumo.
- **🛍️ Storefront Publica (`/loja/[slug]`)**: Vitrine personalizada e responsiva para que cada lojista exiba e venda seus produtos diretamente aos clientes.
- **🚚 Área do Cliente ("Minhas Compras")**: Espaço para compradores finais acompanharem o status de seus pedidos e histórico de compras.
- **⚙️ Configurações & Suporte**: Personalização da loja, preferências da conta e canal de atendimento.

---

## 🛠️ Tecnologias Utilizadas

- **Framework**: [Next.js](https://nextjs.org/) (App Router, React 19)
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
- **Estilização**: CSS Vanilla / CSS Modules
- **Linter & Formatador**: ESLint
- **Integração Backend**: Supabase / APIs REST ([Vendio Backend](https://github.com/gustaaxz/vendio))

---

## 🚀 Como Executar o Projeto

### Pré-requisitos

- **Node.js**: `v18.x` ou superior instalado
- **npm** (ou `pnpm` / `yarn` / `bun`)

### Passos para execução

1. **Clonar o repositório:**
   ```bash
   git clone https://github.com/vendio-systems/vendio_frontend.git
   cd vendio-front_end
   ```

2. **Instalar as dependências:**
   ```bash
   npm install
   ```

3. **Iniciar o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

4. Abrir [http://localhost:3000](http://localhost:3000) no navegador para visualizar a aplicação.

---

## 📜 Scripts Disponíveis

No arquivo `package.json`, estão disponíveis os seguintes comandos:

| Comando | Descrição |
| :--- | :--- |
| `npm run dev` | Inicia o servidor de desenvolvimento do Next.js |
| `npm run build` | Cria a versão otimizada de produção da aplicação |
| `npm run start` | Inicia o servidor Node.js com o build de produção |
| `npm run lint` | Executa a verificação estática de código com ESLint |

---

## 📁 Estrutura do Projeto

```text
vendio-front_end/
├── src/
│   └── app/               # Rotas e páginas do Next.js (App Router)
│       ├── layout.tsx     # Root layout da aplicação
│       ├── page.tsx       # Página inicial
│       └── globals.css    # Estilos globais
├── public/                # Arquivos estáticos (imagens, ícones)
├── package.json           # Dependências e scripts do projeto
├── tsconfig.json          # Configuração do TypeScript
├── LICENSE                # Licença do projeto (MIT)
└── README.md              # Documentação do projeto
```

---

## 🔗 Repositórios Relacionados

- **Backend / Plataforma Base**: [gustaaxz/vendio](https://github.com/gustaaxz/vendio)

---

## ⚖️ MIT License

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Este projeto está licenciado sob a **[MIT License](LICENSE)** — veja o arquivo [`LICENSE`](LICENSE) para mais detalhes.

Desenvolvido para o ecossistema **Vendio Systems**.