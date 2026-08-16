import styles from "./Comparison.module.css";

export default function Comparison() {
  const oldWay = [
    {
      title: "Sistemas fragmentados",
      desc: "Um software pro PDV, uma plataforma para a loja virtual, outro para emitir nota e 3 planilhas do Excel para tentar fechar o mês."
    },
    {
      title: "Venda sem estoque (Furo de estoque)",
      desc: "Você vende a última peça no balcão e 10 minutos depois alguém compra online. Resultado: cliente insatisfeito e cancelamento."
    },
    {
      title: "Dias perdidos calculando lucro",
      desc: "Você só sabe se o negócio deu lucro semanas após o fechamento do mês, somando notas e extratos bancários manualmente."
    },
    {
      title: "Cadastro em duplicidade",
      desc: "Cadastra fotos, preço e descrição no e-commerce e depois precisa digitar tudo de novo no sistema de gestão de estoque."
    }
  ];

  const vendioWay = [
    {
      title: "Tudo em um único lugar",
      desc: "Controle de caixa, emissão fiscal, catálogo virtual e CRM unificados sob uma única tela simples e rápida."
    },
    {
      title: "Estoque sincronizado em tempo real",
      desc: "Vendeu na loja física? O saldo da loja online atualiza no mesmo segundo. Zero riscos de vender o que não tem."
    },
    {
      title: "DRE e Lucratividade Instantânea",
      desc: "Veja a margem real de cada item vendido no momento da compra, com fluxo de caixa projetado automaticamente."
    },
    {
      title: "Cadastro único e inteligente",
      desc: "Cadastre seu produto uma única vez. Ele já fica disponível para venda no PDV e na sua vitrine online instantaneamente."
    }
  ];

  return (
    <section className={styles.section}>
      <div className="container">
        <div className="section-tag">
          <span className="badge badge-primary">Comparativo Direto</span>
        </div>
        <h2 className="section-title">Por que pequenos negócios escolhem a Vendio?</h2>
        <p className="section-subtitle">
          Entenda a diferença entre manter ferramentas soltas e adotar uma gestão verdadeiramente unificada.
        </p>

        <div className={styles.comparisonGrid}>
          {/* Old Way Card */}
          <div className={styles.cardOld}>
            <div className={styles.cardHeaderOld}>
              <div className={styles.cardIconOld}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </div>
              <div>
                <h3 className={styles.cardTitleOld}>O Jeito Antigo</h3>
                <span className={styles.cardSubtitleOld}>Planilhas soltas & softwares isolados</span>
              </div>
            </div>

            <div className={styles.pointsList}>
              {oldWay.map((item, idx) => (
                <div key={idx} className={styles.pointItem}>
                  <div className={styles.pointIconOld}>✕</div>
                  <div>
                    <strong className={styles.pointTitleOld}>{item.title}</strong>
                    <p className={styles.pointDesc}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vendio Way Card */}
          <div className={styles.cardVendio}>
            <div className={styles.badgePopular}>✨ A Escolha Inteligente</div>
            <div className={styles.cardHeaderVendio}>
              <div className={styles.cardIconVendio}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div>
                <h3 className={styles.cardTitleVendio}>Com a Vendio</h3>
                <span className={styles.cardSubtitleVendio}>ERP e E-commerce 100% integrados</span>
              </div>
            </div>

            <div className={styles.pointsList}>
              {vendioWay.map((item, idx) => (
                <div key={idx} className={styles.pointItem}>
                  <div className={styles.pointIconVendio}>✓</div>
                  <div>
                    <strong className={styles.pointTitleVendio}>{item.title}</strong>
                    <p className={styles.pointDescVendio}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
