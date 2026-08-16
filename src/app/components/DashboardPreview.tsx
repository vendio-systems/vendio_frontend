"use client";

import { useState } from "react";
import styles from "./DashboardPreview.module.css";

interface ProductItem {
  id: string;
  name: string;
  category: string;
  stockPhysical: number;
  stockOnline: number;
  price: number;
  status: "ok" | "low" | "critical";
}

export default function DashboardPreview() {
  const [activeTab, setActiveTab] = useState<"inventory" | "orders" | "finances">("inventory");
  const [products, setProducts] = useState<ProductItem[]>([
    {
      id: "PRD-01",
      name: "Camiseta Algodão Egípcio Minimal",
      category: "Vestuário",
      stockPhysical: 14,
      stockOnline: 18,
      price: 129.90,
      status: "ok"
    },
    {
      id: "PRD-02",
      name: "Tênis Street Runner Branco",
      category: "Calçados",
      stockPhysical: 2,
      stockOnline: 3,
      price: 349.00,
      status: "low"
    },
    {
      id: "PRD-03",
      name: "Mochila Couro Sintético Executiva",
      category: "Acessórios",
      stockPhysical: 8,
      stockOnline: 12,
      price: 219.50,
      status: "ok"
    },
    {
      id: "PRD-04",
      name: "Boné Aba Curva Street Preto",
      category: "Acessórios",
      stockPhysical: 1,
      stockOnline: 0,
      price: 79.90,
      status: "critical"
    }
  ]);

  const [orders, setOrders] = useState([
    {
      id: "#VEN-4092",
      customer: "Mariana Souza",
      channel: "Loja Virtual",
      items: "1x Camiseta Algodão Egípcio",
      total: "R$ 129,90",
      status: "Separando Pedido",
      time: "Há 2 min"
    },
    {
      id: "#VEN-4091",
      customer: "Carlos Eduardo",
      channel: "PDV Balcão (Físico)",
      items: "1x Mochila Couro Sintético",
      total: "R$ 219,50",
      status: "Concluído (PIX)",
      time: "Há 14 min"
    },
    {
      id: "#VEN-4090",
      customer: "Fernanda Lima",
      channel: "Loja Virtual",
      items: "1x Tênis Street Runner",
      total: "R$ 349,00",
      status: "Nota Emitida",
      time: "Há 41 min"
    }
  ]);

  const [notification, setNotification] = useState<string | null>(null);

  // Interactive demo action: Simulate a sale
  const handleSimulateSale = () => {
    setProducts((prev) =>
      prev.map((item, index) => {
        if (index === 0 && item.stockOnline > 0) {
          return { ...item, stockOnline: item.stockOnline - 1 };
        }
        return item;
      })
    );

    const newOrder = {
      id: `#VEN-${Math.floor(4093 + Math.random() * 50)}`,
      customer: "Cliente Instantâneo",
      channel: "Loja Virtual",
      items: "1x Camiseta Algodão Egípcio",
      total: "R$ 129,90",
      status: "Estoque Sincronizado!",
      time: "Agora mesmo"
    };

    setOrders((prev) => [newOrder, ...prev.slice(0, 3)]);
    setNotification("⚡ Nova venda simulada! Estoque virtual e físico recalculados instantaneamente.");
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <section id="como-funciona" className={styles.section}>
      <div className="container">
        <div className="section-tag">
          <span className="badge badge-primary">Demonstração Interativa</span>
        </div>
        <h2 className="section-title">Veja a mágica da centralização na prática</h2>
        <p className="section-subtitle">
          Alterne entre as abas abaixo para ver como o Vendio integra suas vendas, estoque e finanças sem necessidade de sincronizações manuais.
        </p>

        {/* Dashboard Shell Window */}
        <div className={styles.dashboardCard}>
          {/* Header Bar */}
          <div className={styles.windowHeader}>
            <div className={styles.windowControls}>
              <span className={`${styles.dot} ${styles.dotRed}`} />
              <span className={`${styles.dot} ${styles.dotYellow}`} />
              <span className={`${styles.dot} ${styles.dotGreen}`} />
            </div>

            <div className={styles.windowTitle}>
              <span className={styles.syncIndicator} />
              Vendio Hub • Sistema Unificado (Loja Física + E-commerce)
            </div>

            <button 
              type="button" 
              onClick={handleSimulateSale} 
              className={styles.simulateBtn}
              title="Clique para testar a sincronização em tempo real"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
              Simular Venda ao Vivo
            </button>
          </div>

          {/* KPI Metrics Row */}
          <div className={styles.kpiRow}>
            <div className={styles.kpiCard}>
              <span className={styles.kpiLabel}>Faturamento Hoje</span>
              <div className={styles.kpiValueWrapper}>
                <span className={styles.kpiValue}>R$ 3.842,50</span>
                <span className={styles.kpiGrowth}>+18.4%</span>
              </div>
              <span className={styles.kpiSub}>14 vendas PDV • 9 Loja Virtual</span>
            </div>

            <div className={styles.kpiCard}>
              <span className={styles.kpiLabel}>Estoque Ativo Total</span>
              <div className={styles.kpiValueWrapper}>
                <span className={styles.kpiValue}>1.428 un</span>
                <span className={styles.kpiBadgeOk}>Sincronizado</span>
              </div>
              <span className={styles.kpiSub}>1 produto com alerta crítico</span>
            </div>

            <div className={styles.kpiCard}>
              <span className={styles.kpiLabel}>Lucro Líquido Estimado</span>
              <div className={styles.kpiValueWrapper}>
                <span className={styles.kpiValue}>R$ 1.613,85</span>
                <span className={styles.kpiMargin}>42% margem</span>
              </div>
              <span className={styles.kpiSub}>Custos de produtos e taxas abatidos</span>
            </div>
          </div>

          {/* Interactive Tabs */}
          <div className={styles.tabsContainer}>
            <button
              type="button"
              className={`${styles.tabBtn} ${activeTab === "inventory" ? styles.activeTab : ""}`}
              onClick={() => setActiveTab("inventory")}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              </svg>
              1. Controle de Estoque Unificado
            </button>

            <button
              type="button"
              className={`${styles.tabBtn} ${activeTab === "orders" ? styles.activeTab : ""}`}
              onClick={() => setActiveTab("orders")}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              2. Pedidos em Tempo Real (PDV + Web)
            </button>

            <button
              type="button"
              className={`${styles.tabBtn} ${activeTab === "finances" ? styles.activeTab : ""}`}
              onClick={() => setActiveTab("finances")}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
              3. Visão Financeira & DRE
            </button>
          </div>

          {/* Notification Toast */}
          {notification && (
            <div className={styles.toast}>
              <span>{notification}</span>
            </div>
          )}

          {/* Tab Content 1: Inventory */}
          {activeTab === "inventory" && (
            <div className={styles.tabPanel}>
              <div className={styles.tableResponsive}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Produto / Código</th>
                      <th>Categoria</th>
                      <th>Estoque Balcão</th>
                      <th>Estoque Loja Virtual</th>
                      <th>Preço Unit.</th>
                      <th>Status de Sincronia</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div className={styles.productName}>{item.name}</div>
                          <span className={styles.productSku}>{item.id}</span>
                        </td>
                        <td>
                          <span className={styles.categoryBadge}>{item.category}</span>
                        </td>
                        <td>
                          <strong>{item.stockPhysical} un</strong>
                        </td>
                        <td>
                          <strong className={item.stockOnline <= 1 ? styles.textRed : ""}>
                            {item.stockOnline} un
                          </strong>
                        </td>
                        <td>
                          {item.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                        </td>
                        <td>
                          {item.status === "ok" && (
                            <span className={styles.statusTagOk}>● Sincronizado</span>
                          )}
                          {item.status === "low" && (
                            <span className={styles.statusTagLow}>▲ Reposição sugerida</span>
                          )}
                          {item.status === "critical" && (
                            <span className={styles.statusTagCrit}>✕ Esgotado na Loja</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className={styles.tabFooterNote}>
                💡 <strong>Dica de ouro:</strong> Quando uma venda ocorre no balcão físico, o estoque na sua loja virtual é decrementado no mesmo segundo, impedindo vendas duplicadas.
              </div>
            </div>
          )}

          {/* Tab Content 2: Orders */}
          {activeTab === "orders" && (
            <div className={styles.tabPanel}>
              <div className={styles.ordersList}>
                {orders.map((order) => (
                  <div key={order.id} className={styles.orderRow}>
                    <div className={styles.orderMain}>
                      <span className={styles.orderCode}>{order.id}</span>
                      <div>
                        <div className={styles.orderCustomer}>{order.customer}</div>
                        <div className={styles.orderItems}>{order.items}</div>
                      </div>
                    </div>

                    <div className={styles.orderMeta}>
                      <span className={`${styles.channelBadge} ${order.channel.includes("PDV") ? styles.channelPdv : styles.channelWeb}`}>
                        {order.channel}
                      </span>
                      <span className={styles.orderPrice}>{order.total}</span>
                      <span className={styles.orderStatusBadge}>{order.status}</span>
                      <span className={styles.orderTime}>{order.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className={styles.tabFooterNote}>
                🚀 <strong>Fila unificada:</strong> Os pedidos de todas as suas frentes de venda entram na mesma esteira com baixa automática e emissão fiscal com 1 clique.
              </div>
            </div>
          )}

          {/* Tab Content 3: Finances */}
          {activeTab === "finances" && (
            <div className={styles.tabPanel}>
              <div className={styles.financesGrid}>
                <div className={styles.financeBox}>
                  <span className={styles.financeBoxTitle}>Entradas do Mês</span>
                  <span className={styles.financeBigValGreen}>R$ 42.890,00</span>
                  <p className={styles.financeBoxDesc}>Faturamento bruto consolidado de vendas online e físicas.</p>
                </div>
                <div className={styles.financeBox}>
                  <span className={styles.financeBoxTitle}>Custo de Mercadoria (CMV)</span>
                  <span className={styles.financeBigValRed}>- R$ 18.240,00</span>
                  <p className={styles.financeBoxDesc}>Cálculo automático baseado no custo real de cada produto vendido.</p>
                </div>
                <div className={styles.financeBox}>
                  <span className={styles.financeBoxTitle}>Lucro Real no Bolso</span>
                  <span className={styles.financeBigValBlue}>R$ 15.650,00</span>
                  <p className={styles.financeBoxDesc}>Resultado líquido real já descontando taxas de pagamento e custos operacionais.</p>
                </div>
              </div>
              <div className={styles.tabFooterNote}>
                📊 <strong>Chega de fechar o mês no escuro:</strong> Você sabe exatamente quanto lucrou em cada venda, sem precisar de planilhas complexas de DRE.
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
