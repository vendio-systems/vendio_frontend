# Análise e arquitetura ERP Vendio

## Referências e conclusão

ERPs voltados a pequenas empresas organizam a operação em módulos conectados: cadastro mestre, vendas, compras, estoque, finanças e relacionamento. A estrutura segue a divisão de módulos do SAP Business One — vendas, compras, parceiros, estoque, financeiro e administração — e o ciclo de compras ponta a ponta (pedido, recebimento e pagamento). [SAP Business One](https://help.sap.com/docs/SAP_BUSINESS_ONE/68a2e87fb29941b5bf959a184d9c6727/4510027ecf465d7ae10000000a11466f.html) descreve esses módulos e o planejamento que cruza pedidos, estoque e previsões. Para estoque, a referência inclui depósitos, localizações, unidades, reposição e rastreabilidade; para financeiro, partidas dobradas, contas a receber/pagar, reconciliação e relatórios em tempo real. [Odoo Supply Chain](https://www.odoo.com/documentation/18.0/applications/inventory_and_mrp.html) e [Odoo Accounting](https://www.odoo.com/documentation/18.0/applications/finance/accounting.html) documentam esses fluxos.

## Módulos implementados na base

| Módulo | Entidades | Fluxo essencial |
|---|---|---|
| Cadastro mestre | loja, usuário, cliente, fornecedor, produto | criar, validar, arquivar e auditar |
| Vendas | orçamento, pedido, item, pagamento, entrega | pedido → pago → separado → enviado → concluído |
| Compras | fornecedor, solicitação, pedido de compra, recebimento | necessidade → compra → recebimento → conta a pagar |
| Estoque | depósito, localização, saldo, movimento, lote | entrada/saída/transferência com motivo e saldo resultante |
| Financeiro | conta, lançamento, conta a pagar/receber, conciliação | evento operacional → lançamento financeiro → baixa/conciliação |
| CRM | cliente, segmento, histórico, campanha | captura → compra → relacionamento → recorrência |
| Gestão | KPI, relatório, exportação, notificações | evento → notificação → indicador → decisão |
| Governança | papel, sessão, auditoria | autorização → ação → evento imutável de auditoria |

## Regras de negócio essenciais

1. Todo dado operacional pertence a uma loja (`storeId`).
2. Produto tem SKU único por loja; preço e custo são valores decimais no banco real.
3. Movimento de estoque é imutável; ajustes criam um novo movimento.
4. Saídas não podem deixar saldo negativo sem permissão explícita.
5. Pedido pago reserva ou baixa estoque conforme a política da loja.
6. Cancelamento reverte reserva/saída por novo movimento, nunca apagando o histórico.
7. Pedido de compra recebido cria entrada; pagamento gera baixa financeira separada.
8. Lançamentos financeiros aprovados não são editados: são estornados por contralançamento.
9. Mudanças de preço, permissões e exclusões devem gerar auditoria.
10. Exportações exigem sessão, permissão e CSRF.

## Próxima camada de produção

Substituir o repositório demonstrativo por PostgreSQL. O esquema mínimo inclui `stores`, `users`, `memberships`, `products`, `warehouses`, `stock_movements`, `orders`, `order_items`, `payments`, `suppliers`, `purchase_orders`, `ledger_entries`, `notifications` e `audit_events`. Todas as consultas devem filtrar `store_id`, usar transações para estoque/financeiro e queries parametrizadas.
