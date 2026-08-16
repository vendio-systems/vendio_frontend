"use client";

import { useState } from "react";
import styles from "./Pricing.module.css";

interface PricingProps {
  onOpenTrial: () => void;
}

export default function Pricing({ onOpenTrial }: PricingProps) {
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      name: "Começo",
      desc: "Perfeito para quem está formalizando o negócio ou tem uma operação inicial enxuta.",
      priceMonthly: 89,
      priceAnnual: 69,
      featured: false,
      badge: null,
      features: [
        "1 Usuário de Acesso",
        "PDV Balcão Ágil Ilimitado",
        "Controle de Estoque Básico",
        "Emissão de NFC-e / Cupom Fiscal",
        "Relatório Simples de Vendas",
        "Suporte por Chat e E-mail"
      ],
      buttonText: "Começar Teste Grátis",
      buttonVariant: "btn-secondary"
    },
    {
      name: "Crescimento",
      desc: "O plano favorito. Unifica seu ERP com a Loja Virtual para escalar sem dor de cabeça.",
      priceMonthly: 179,
      priceAnnual: 139,
      featured: true,
      badge: "MAIS POPULAR",
      features: [
        "Até 4 Usuários simultâneos",
        "ERP Completo + Loja Virtual Integrada",
        "Estoque Multicanal com Alertas de Compra",
        "DRE em Tempo Real & Margem por Produto",
        "Emissor Fiscal Completo (NF-e, NFC-e, NFS-e)",
        "Controle de Contas a Pagar e Receber",
        "Suporte Prioritário via WhatsApp"
      ],
      buttonText: "Testar Crescimento Grátis",
      buttonVariant: "btn-primary"
    },
    {
      name: "Escala",
      desc: "Para empresas consolidadas, franquias ou negócios com múltiplas filiais e depósitos.",
      priceMonthly: 349,
      priceAnnual: 279,
      featured: false,
      badge: null,
      features: [
        "Usuários Ilimitados",
        "Multi-empresas e Multi-depósitos",
        "Conciliação Bancária Automática (OFX/API)",
        "Relatórios Avançados de Performance",
        "Acesso à API & Webhooks",
        "Gerente de Sucesso Dedicado"
      ],
      buttonText: "Falar com Consultor",
      buttonVariant: "btn-secondary"
    }
  ];

  return (
    <section id="precos" className={styles.section}>
      <div className="container">
        <div className="section-tag">
          <span className="badge badge-primary">Planos e Preços</span>
        </div>
        <h2 className="section-title">Preço simples, transparente e sem surpresas</h2>
        <p className="section-subtitle">
          Teste qualquer plano por 14 dias sem compromisso e sem precisar cadastrar cartão de crédito.
        </p>

        {/* Annual / Monthly Toggle */}
        <div className={styles.toggleWrapper}>
          <button
            type="button"
            className={`${styles.toggleOption} ${!isAnnual ? styles.toggleActive : ""}`}
            onClick={() => setIsAnnual(false)}
          >
            Mensal
          </button>
          <button
            type="button"
            className={`${styles.toggleOption} ${isAnnual ? styles.toggleActive : ""}`}
            onClick={() => setIsAnnual(true)}
          >
            Anual
            <span className={styles.discountBadge}>Economize 20%</span>
          </button>
        </div>

        {/* Pricing Cards Grid */}
        <div className={styles.pricingGrid}>
          {plans.map((plan, idx) => {
            const currentPrice = isAnnual ? plan.priceAnnual : plan.priceMonthly;

            return (
              <div
                key={idx}
                className={`${styles.card} ${plan.featured ? styles.cardFeatured : ""}`}
              >
                {plan.badge && (
                  <div className={styles.featuredBadge}>{plan.badge}</div>
                )}

                <div className={styles.cardTop}>
                  <h3 className={styles.planName}>{plan.name}</h3>
                  <p className={styles.planDesc}>{plan.desc}</p>
                </div>

                <div className={styles.priceContainer}>
                  <span className={styles.currency}>R$</span>
                  <span className={styles.priceNumber}>{currentPrice}</span>
                  <span className={styles.period}>/mês</span>
                </div>
                {isAnnual && (
                  <span className={styles.billedAnnualNote}>
                    Faturado anualmente (R$ {currentPrice * 12}/ano)
                  </span>
                )}

                <button
                  type="button"
                  onClick={onOpenTrial}
                  className={`btn ${plan.buttonVariant}`}
                  style={{ width: "100%", margin: "1.5rem 0" }}
                >
                  {plan.buttonText}
                </button>

                <div className={styles.featuresList}>
                  <span className={styles.featuresTitle}>O que está incluso:</span>
                  {plan.features.map((feat, fIdx) => (
                    <div key={fIdx} className={styles.featureItem}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
