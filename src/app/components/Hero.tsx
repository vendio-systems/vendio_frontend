"use client";

import styles from "./Hero.module.css";

interface HeroProps {
  onOpenTrial: () => void;
}

export default function Hero({ onOpenTrial }: HeroProps) {
  return (
    <section className={styles.heroSection}>
      {/* Background Decorative Glow */}
      <div className={styles.glowIndigo} />
      <div className={styles.glowCyan} />

      <div className={`container ${styles.heroContainer}`}>
        {/* Top Badge */}
        <div className={styles.badgeWrapper}>
          <div className="badge badge-primary">
            <span className={styles.pulseDot} />
            ERP + E-commerce Unificados para Pequenos Negócios
          </div>
        </div>

        {/* Main Headline */}
        <h1 className={styles.heroTitle}>
          Centralize suas vendas, estoque e finanças em{" "}
          <span className={styles.gradientText}>um único sistema</span>
        </h1>

        {/* Subtitle */}
        <p className={styles.heroSubtitle}>
          Diga adeus ao caos das planilhas desconectadas e vendas sem controle. 
          A Vendio sincroniza sua loja física e sua loja virtual em tempo real para você 
          ter clareza financeira e vender muito mais.
        </p>

        {/* CTAs */}
        <div className={styles.ctaGroup}>
          <button 
            type="button" 
            onClick={onOpenTrial}
            className="btn btn-primary btn-lg"
          >
            Experimentar 14 Dias Grátis
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
          
          <a href="#como-funciona" className="btn btn-secondary btn-lg">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polygon points="10 8 16 12 10 16 10 8" fill="currentColor"/>
            </svg>
            Ver Demonstração
          </a>
        </div>

        {/* Trust Badges */}
        <div className={styles.trustItems}>
          <div className={styles.trustItem}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <span>Sem necessidade de cartão</span>
          </div>
          <div className={styles.trustDivider}>•</div>
          <div className={styles.trustItem}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <span>Configuração em 5 minutos</span>
          </div>
          <div className={styles.trustDivider}>•</div>
          <div className={styles.trustItem}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <span>Suporte WhatsApp em minutos</span>
          </div>
        </div>
      </div>
    </section>
  );
}
