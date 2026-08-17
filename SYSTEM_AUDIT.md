# Auditoria técnica do sistema Vendio

## Problemas encontrados

- Usuários, produtos e pedidos estavam apenas em memória e desapareciam ao reiniciar.
- A landing page autenticava, mas não navegava para o dashboard.
- O Proxy verificava somente a presença de um cookie.
- Todas as telas usavam uma única rota catch-all com conteúdo genérico.
- Vários botões eram decorativos e o CSV continha valores estáticos.
- Não existia isolamento persistente por loja nem auditoria durável.

## Correções implementadas

- SQLite persistente com WAL, chaves estrangeiras, índices, restrições e queries parametrizadas.
- Transações para cadastro, dados iniciais, produtos e movimentos de estoque.
- Persistência de lojas, usuários, sessões, produtos, clientes, pedidos e seus itens, estoque, fornecedores, financeiro, notificações, cupons, entregas, integrações e auditoria.
- JWT vinculado a sessão no banco, com hash do token, expiração e revogação.
- Cookies seguros, CSRF em mutações e rate limit na autenticação.
- Validação de sessão no layout protegido e isolamento por `store_id`.
- Cadastro/login redirecionando para `/dashboard`.
- Lista fechada de rotas; módulos desconhecidos retornam 404.
- Formulários para produtos, estoque, pedidos, clientes, financeiro, compras, fornecedores, cupons, entregas, loja e integrações.
- Busca global e nas tabelas, notificações marcáveis como lidas e CSVs de vendas, estoque e financeiro derivados do banco.
- Loja pública com carrinho e checkout transacional, atualização de clientes, baixa e restauração de estoque.
- Fluxo validado de status dos pedidos, lançamento financeiro ao receber e auditoria das transições.
- Gestão de equipe protegida por matriz de cargos e bloqueio de Visitante no dashboard.

## Rotas da interface

`/`, `/loja/[slug]`, `/dashboard`, `/dashboard/produtos`, `/dashboard/estoque`, `/dashboard/pedidos`, `/dashboard/clientes`, `/dashboard/financeiro`, `/dashboard/metricas`, `/dashboard/compras`, `/dashboard/relatorios`, `/dashboard/notificacoes`, `/dashboard/fornecedores`, `/dashboard/cupons`, `/dashboard/entregas`, `/dashboard/loja`, `/dashboard/equipe`, `/dashboard/integracoes`, `/dashboard/seguranca`.

## Rotas da API

`POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/session`, `GET|POST /api/erp/products`, `DELETE /api/erp/products/[id]`, `GET|POST /api/erp/inventory/movements`, `GET /api/erp/orders`, `PATCH /api/erp/orders/[id]`, `POST /api/erp/team`, `POST /api/erp/actions/[screen]`, `POST /api/erp/notifications/read-all`, `POST /api/reports/{sales,stock,finance}.csv`, `POST /api/store/[slug]/checkout`.

## Validação executada

- Cadastro retornando HTTP `201`.
- Login navegando para `/dashboard`.
- Logout revogando sessão e novo login com o mesmo usuário.
- Reinício do servidor mantendo conta, sessão e dados.
- Cadastro de produto e entrada de estoque refletidos na interface.
- Novo pedido aparecendo no módulo de pedidos.
- Checkout público gravando itens, cliente, pedido, notificação e baixa de estoque.
- Mudança válida de status criando lançamento financeiro e auditoria.
- Notificações alteradas para lidas.
- Todas as 16 rotas de módulos verificadas no navegador.
- TypeScript, `eslint` e build de produção concluídos.

## Limites de implantação

Esta versão é uma aplicação local demonstrável. Para múltiplas instâncias, migre SQLite para PostgreSQL, rate limit para Redis, arquivos para object storage e use integrações reais de e-mail, pagamento e logística. Segurança exige revisão e atualização contínuas.
