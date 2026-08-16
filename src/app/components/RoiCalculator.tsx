"use client";

import { useState } from "react";
import styles from "./RoiCalculator.module.css";

interface RoiCalculatorProps {
  onOpenTrial: () => void;
}

export default function RoiCalculator({ onOpenTrial }: RoiCalculatorProps) {
  const [ordersPerMonth, setOrdersPerMonth] = useState<number>(350);
  const [ticketAverage, setTicketAverage] = useState<number>(120);

  // Calculations
  // Average time spent per manual order (inventory check + spreadsheet + NF) ~ 8 minutes without unified ERP
  // With Vendio ~ 1 minute
  // Time saved in hours per month = (orders * 7 min) / 60
  const hoursSavedPerMonth = Math.round((ordersPerMonth * 7) / 60);

  // Financial waste avoided (stock rupture, rework, errors) estimated at ~ 3% of revenue
  const monthlyRevenue = ordersPerMonth * ticketAverage;
  const estimatedSavings = Math.round(monthlyRevenue * 0.035 + hoursSavedPerMonth * 25);

  return (
    <section id="economia" className={styles.section}>
      <div className="container">
        <div className="section-tag">
          <span className="badge badge-emerald">Simulador de ROI</span>
        </div>
        <h2 className="section-title">Quanto tempo e dinheiro seu negócio vai economizar?</h2>
        <p className="section-subtitle">
          Arraste os controles abaixo para simular o impacto direto da unificação da Vendio na sua operação mensal.
        </p>

        <div className={styles.calculatorCard}>
          {/* Controls Side */}
          <div className={styles.controlsSide}>
            {/* Slider 1 */}
            <div className={styles.controlGroup}>
              <div className={styles.controlLabelRow}>
                <label htmlFor="ordersSlider" className={styles.controlLabel}>
                  Vendas / Pedidos por mês
                </label>
                <span className={styles.controlValue}>{ordersPerMonth} pedidos/mês</span>
              </div>
              <input
                id="ordersSlider"
                type="range"
                min="50"
                max="2000"
                step="25"
                value={ordersPerMonth}
                onChange={(e) => setOrdersPerMonth(Number(e.target.value))}
                className={styles.rangeInput}
              />
              <div className={styles.rangeLimits}>
                <span>50 pedidos</span>
                <span>2.000+ pedidos</span>
              </div>
            </div>

            {/* Slider 2 */}
            <div className={styles.controlGroup}>
              <div className={styles.controlLabelRow}>
                <label htmlFor="ticketSlider" className={styles.controlLabel}>
                  Ticket Médio por venda
                </label>
                <span className={styles.controlValue}>
                  {ticketAverage.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </span>
              </div>
              <input
                id="ticketSlider"
                type="range"
                min="30"
                max="600"
                step="10"
                value={ticketAverage}
                onChange={(e) => setTicketAverage(Number(e.target.value))}
                className={styles.rangeInput}
              />
              <div className={styles.rangeLimits}>
                <span>R$ 30,00</span>
                <span>R$ 600,00</span>
              </div>
            </div>

            <div className={styles.featuresIncluded}>
              <div className={styles.includedItem}>
                <span className={styles.checkIcon}>✓</span>
                Zero retrabalho de estoque entre balcão e internet
              </div>
              <div className={styles.includedItem}>
                <span className={styles.checkIcon}>✓</span>
                Emissão fiscal em 1 clique integrada
              </div>
              <div className={styles.includedItem}>
                <span className={styles.checkIcon}>✓</span>
                Fechamento de caixa instantâneo sem erros manuais
              </div>
            </div>
          </div>

          {/* Results Side */}
          <div className={styles.resultsSide}>
            <div className={styles.resultsHeader}>
              <span className={styles.resultsBadge}>Resultado Estimado</span>
              <h3 className={styles.resultsTitle}>Seu ganho mensal com a Vendio</h3>
            </div>

            <div className={styles.resultItem}>
              <div className={styles.resultBigNumber}>
                <span className={styles.timeSavedValue}>{hoursSavedPerMonth}h</span>
                <span className={styles.unitText}>/mês</span>
              </div>
              <p className={styles.resultDesc}>
                Economia em tarefas manuais, conciliações e cadastros duplicados.
              </p>
            </div>

            <div className={styles.resultItem}>
              <div className={styles.resultBigNumber}>
                <span className={styles.moneySavedValue}>
                  {estimatedSavings.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </span>
                <span className={styles.unitText}>/mês</span>
              </div>
              <p className={styles.resultDesc}>
                Economizados em perdas por rupturas de estoque, erros de precificação e tempo de equipe.
              </p>
            </div>

            <button 
              type="button" 
              onClick={onOpenTrial}
              className="btn btn-primary"
              style={{ width: "100%", marginTop: "1rem" }}
            >
              Começar a Economizar Agora
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
