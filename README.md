# Vendio

SaaS full-stack em Next.js que unifica loja virtual, pedidos, produtos, estoque, clientes, financeiro, métricas e gestão operacional de pequenos negócios.

## Executar localmente

Requer Node.js 24 ou mais recente, pois a persistência local usa o módulo nativo `node:sqlite`.

```bash
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000), crie uma conta e o sistema abrirá `/dashboard`. Cada cadastro recebe uma loja com dados iniciais e uma vitrine pública em `/loja/[slug]`.

## Módulos

- Dashboard com KPIs, pedidos recentes e estoque crítico.
- Produtos, arquivamento, mapa e movimentações de estoque.
- Pedidos com fluxo validado de status e itens persistidos.
- Clientes, fornecedores, compras, entregas, cupons e integrações.
- Financeiro, métricas, notificações e três exportações CSV.
- Configuração da loja, equipe com RBAC e auditoria.
- Storefront público com sacola e checkout transacional.

## Segurança

- Senhas com `scrypt`, salt individual e comparação timing-safe.
- JWT HS256 de oito horas vinculado a uma sessão revogável no banco.
- Cookies HttpOnly/Secure, CSRF, rate limit, CSP, HSTS e demais headers.
- Queries SQL parametrizadas, transações, constraints e isolamento por `store_id`.
- Matriz de cargos: Visitante, Cliente, Administrador, Desenvolvedor e Dono.

Copie [`.env.example`](./.env.example) e configure um `JWT_SECRET` aleatório com pelo menos 32 caracteres antes de executar em produção.

## Scripts

```bash
npm run dev       # servidor de desenvolvimento
npm run lint      # ESLint
npx tsc --noEmit  # verificação TypeScript
npm run build     # build de produção
npm run start     # servir o build
```

## Persistência e produção

O ambiente local usa `data/vendio.sqlite`, ignorado pelo Git. Para múltiplas instâncias, migre SQLite para PostgreSQL e o rate limit para Redis; configure também provedor de e-mail, pagamentos, logística, arquivos, observabilidade e backups.

Os [100 requisitos](./REQUIREMENTS.md), a [análise ERP](./ERP_BLUEPRINT.md) e a [auditoria técnica](./SYSTEM_AUDIT.md) acompanham o projeto.
