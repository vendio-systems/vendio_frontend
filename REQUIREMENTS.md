# Requisitos da Vendio

## Funcionais

1. Visitante visualiza loja pública. 2. Visitante pesquisa catálogo. 3. Visitante filtra produtos. 4. Visitante vê produto. 5. Visitante adiciona ao carrinho. 6. Visitante inicia checkout. 7. Usuário cadastra conta. 8. Usuário faz login. 9. Usuário encerra sessão. 10. Usuário recupera senha. 11. Cliente altera perfil. 12. Cliente altera nome da loja. 13. Cliente envia logo. 14. Cliente configura domínio. 15. Cliente cadastra produtos. 16. Cliente edita produtos. 17. Cliente arquiva produtos. 18. Cliente controla variações. 19. Cliente registra entradas. 20. Cliente ajusta estoque. 21. Cliente recebe alerta de estoque baixo. 22. Cliente vê histórico de estoque. 23. Cliente cria pedidos. 24. Cliente atualiza status do pedido. 25. Cliente emite comprovante. 26. Cliente cadastra clientes. 27. Cliente consulta histórico do comprador. 28. Cliente lança receita. 29. Cliente lança despesa. 30. Cliente categoriza lançamentos. 31. Cliente concilia pagamentos. 32. Cliente visualiza fluxo de caixa. 33. Cliente emite relatórios. 34. Cliente exporta relatórios. 35. Cliente configura meios de pagamento. 36. Cliente configura entrega. 37. Cliente cria cupons. 38. Cliente configura notificações. 39. Administrador lista lojas. 40. Administrador bloqueia lojas. 41. Administrador gerencia clientes. 42. Administrador gerencia visitantes. 43. Administrador consulta auditoria. 44. Administrador atende chamados. 45. Administrador gerencia planos. 46. Desenvolvedor gerencia papéis. 47. Desenvolvedor gerencia integrações. 48. Desenvolvedor vê logs técnicos. 49. Desenvolvedor remove recursos autorizados. 50. Dono possui acesso total.

## Não funcionais

51. JWT usa assinatura HMAC SHA-256. 52. Sessão é armazenada em cookie HttpOnly. 53. Cookie usa Secure em produção. 54. Cookie usa SameSite=Lax. 55. Tokens expiram em oito horas. 56. Senhas usam scrypt com salt aleatório. 57. Comparação de hashes é timing-safe. 58. Senhas exigem maiúscula, minúscula e número. 59. Login retorna mensagem genérica para credenciais inválidas. 60. Entradas passam por validação no servidor. 61. Campos de texto têm limites de tamanho. 62. Texto é sanitizado contra HTML básico. 63. APIs retornam JSON consistente. 64. Erros retornam status HTTP adequado. 65. Banco usa queries parametrizadas. 66. Nunca concatenar SQL com entrada do usuário. 67. Acesso é validado no servidor. 68. Proxy apenas faz redirecionamento otimista. 69. RBAC é centralizado. 70. Ações destrutivas geram auditoria. 71. Exclusões críticas exigem confirmação. 72. Dados são isolados por loja. 73. IDs não são previsíveis. 74. Segredos ficam somente em variáveis de ambiente. 75. JWT_SECRET tem no mínimo 32 caracteres em produção. 76. HTTPS é obrigatório em produção. 77. CSP deve ser configurada em produção. 78. Rate limit protege login e cadastro. 79. CAPTCHA é habilitável após tentativas suspeitas. 80. Reset de senha expira. 81. Tokens de reset são de uso único. 82. Uploads validam tipo e tamanho. 83. Uploads usam armazenamento privado. 84. Logs não incluem senhas ou tokens. 85. Backups são criptografados. 86. LGPD: consentimento e privacidade são registrados. 87. LGPD: exportação de dados é possível. 88. LGPD: exclusão respeita retenção legal. 89. Aplicação responde em telas móveis. 90. Interface é navegável por teclado. 91. Campos têm labels acessíveis. 92. Contraste atende WCAG AA. 93. Datas usam fuso configurável. 94. Valores monetários usam decimal no banco. 95. Estoque não pode ficar negativo sem permissão. 96. Operações financeiras são transacionais. 97. Testes cobrem validações e permissões. 98. CI executa lint e build. 99. Monitoramento alerta erros críticos. 100. Documentação de API acompanha cada versão.

## Matriz de acesso

| Papel | Escopo |
|---|---|
| Visitante | Loja pública e checkout |
| Cliente | Sua própria loja, produtos, pedidos e financeiro |
| Administrador | Lojas, clientes, visitantes e operação |
| Desenvolvedor | Todos os papéis, integrações e recursos técnicos |
| Dono | Acesso irrestrito, inclusive configurações críticas |

## Produção

A versão local usa SQLite persistente, transações, chaves estrangeiras e queries parametrizadas. Antes de operar em múltiplas instâncias, migre o banco para PostgreSQL, o rate limit para Redis e configure `JWT_SECRET`, e-mail transacional, armazenamento de arquivos, observabilidade, backups e migrações versionadas.
