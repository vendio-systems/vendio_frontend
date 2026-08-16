"use client";

import styles from "./Footer.module.css";

interface FooterProps {
  onOpenTrial: () => void;
}

export default function Footer({ onOpenTrial }: FooterProps) {
  return (
    <footer className={styles.footer}>
      {/* Bottom CTA Banner */}
      <div className="container">
        <div className={styles.ctaBanner}>
          <div className={styles.ctaGlow} />
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>
              Pronto para ter total controle do seu negócio?
            </h2>
            <p className={styles.ctaSubtitle}>
              Junte-se a mais de 1.200 pequenos lojistas e empreendedores que vendem mais e gerenciam melhor com a Vendio.
            </p>
            <div className={styles.ctaActions}>
              <button
                type="button"
                onClick={onOpenTrial}
                className="btn btn-primary btn-lg"
              >
                Começar Teste de 14 Dias Grátis
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className={styles.footerMain}>
          <div className={styles.brandCol}>
            <a href="#" className={styles.brand}>
              <div className={styles.logoIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 7L12 3L20 7V17L12 21L4 17V7Z" stroke="white" strokeWidth="2.2"/>
                  <path d="M12 3V21" stroke="white" strokeWidth="2.2"/>
                  <path d="M4 7L12 12L20 7" stroke="white" strokeWidth="2.2"/>
                </svg>
              </div>
              <span className={styles.brandText}>
                Vendio<span className={styles.brandDot}>.</span>
              </span>
            </a>
            <p className={styles.brandBio}>
              A plataforma SaaS que unifica ERP e e-commerce para descomplicar as vendas, estoque e finanças de pequenos negócios no Brasil.
            </p>
            <div className={styles.socialBadges}>
              <span>🇧🇷 Feito com carinho para o empreendedor brasileiro</span>
            </div>
          </div>

          <div className={styles.linksGrid}>
            <div className={styles.linkGroup}>
              <h4 className={styles.linkGroupTitle}>Produto</h4>
              <a href="#recursos">Recursos do ERP</a>
              <a href="#como-funciona">Estoque Sincronizado</a>
              <a href="#como-funciona">Frente de Caixa (PDV)</a>
              <a href="#como-funciona">Loja Virtual Nativa</a>
              <a href="#economia">Calculadora de ROI</a>
            </div>

            <div className={styles.linkGroup}>
              <h4 className={styles.linkGroupTitle}>Planos & Suporte</h4>
              <a href="#precos">Tabela de Preços</a>
              <a href="#faq">Perguntas Frequentes</a>
              <a href="#faq">Emissão de NF-e e NFC-e</a>
              <a href="#faq">Migração de Planilhas</a>
              <a href="#" onClick={(e) => { e.preventDefault(); onOpenTrial(); }}>Falar com Especialista</a>
            </div>

            <div className={styles.linkGroup}>
              <h4 className={styles.linkGroupTitle}>Segurança & Legal</h4>
              <a href="#">Termos de Uso</a>
              <a href="#">Política de Privacidade</a>
              <a href="#">Segurança & LGPD</a>
              <a href="#">Certificado SSL 256-bit</a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className={styles.copyrightRow}>
          <p>© {new Date().getFullYear()} Vendio Tecnologia Ltda. Todos os direitos reservados.</p>
          <p>CNPJ: 00.000.000/0001-00 • São Paulo, SP</p>
        </div>
      </div>
    </footer>
  );
}
