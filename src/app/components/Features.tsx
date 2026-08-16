import styles from "./Features.module.css";

export default function Features() {
  const features = [
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      ),
      tag: "Vendas & Caixa",
      title: "PDV Ágil de Frente de Caixa",
      desc: "Feche vendas no balcão em menos de 10 segundos com leitor de código de barras, PIX dinâmico na tela e fechamento de caixa cego seguro."
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      ),
      tag: "Estoque",
      title: "Estoque Inteligente e Reposição",
      desc: "Controle variações de tamanho e cor, calcule o custo médio exato e receba alertas automáticos de quando é a hora ideal de comprar com fornecedores."
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
      tag: "Financeiro & Fiscal",
      title: "Finanças com DRE e Emissão Fiscal",
      desc: "Emita NF-e, NFC-e e NFS-e em segundos. Tenha controle total de contas a pagar, a receber e conciliação bancária sem precisar ser contador."
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
      ),
      tag: "E-commerce Nativo",
      title: "Sua Loja Virtual Pronta em Minutos",
      desc: "Sua vitrine online integrada ao mesmo banco de dados do seu ERP. Sem plugins lentos ou bugs de sincronização que quebram a loja."
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      tag: "CRM & Clientes",
      title: "Histórico de Clientes & Fidelização",
      desc: "Identifique seus melhores clientes, veja o ticket médio por comprador e envie promoções direcionadas por WhatsApp para reativar vendas."
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
          <line x1="12" y1="18" x2="12.01" y2="18" />
        </svg>
      ),
      tag: "Mobilidade",
      title: "Acesse de Onde Estiver",
      desc: "100% em nuvem. Acompanhe as vendas da sua loja pelo celular, tablet ou computador, mesmo quando estiver em viagem ou de folga."
    }
  ];

  return (
    <section id="recursos" className={styles.section}>
      <div className="container">
        <div className="section-tag">
          <span className="badge badge-primary">Recursos Essenciais</span>
        </div>
        <h2 className="section-title">Tudo o que seu pequeno negócio precisa</h2>
        <p className="section-subtitle">
          Criado pensando na rotina do lojista moderno: sem menus complicados, sem termos técnicos difíceis e pronto para usar.
        </p>

        <div className={styles.grid}>
          {features.map((feat, idx) => (
            <div key={idx} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.iconWrapper}>{feat.icon}</div>
                <span className={styles.tag}>{feat.tag}</span>
              </div>
              <h3 className={styles.cardTitle}>{feat.title}</h3>
              <p className={styles.cardDesc}>{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
