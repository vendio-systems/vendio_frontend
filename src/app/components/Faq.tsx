"use client";

import { useState } from "react";
import styles from "./Faq.module.css";

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Preciso cadastrar cartão de crédito para testar?",
      answer: "Não! O teste de 14 dias é 100% gratuito e livre de compromisso. Você tem acesso a todos os recursos do plano Crescimento e só decide assinar se o sistema realmente transformar sua rotina."
    },
    {
      question: "Consigo importar meus produtos e estoque de planilhas do Excel?",
      answer: "Sim, com toda certeza. A Vendio conta com um importador inteligente onde você sobe sua planilha atual (Excel ou CSV) e o sistema organiza seus produtos, preços e saldos em menos de 2 minutos."
    },
    {
      question: "Como funciona a sincronização entre a loja física e o e-commerce?",
      answer: "É tudo nativo e em tempo real. Quando um produto é vendido no balcão físico pelo PDV, a quantidade na loja virtual é diminuída instantaneamente, impedindo que você venda duas vezes o mesmo item."
    },
    {
      question: "A Vendio emite notas fiscais (NF-e e NFC-e)?",
      answer: "Sim. O sistema emite NFC-e (cupom fiscal de balcão) e NF-e (nota de produto para envios online) com 1 clique, integrando certificado digital modelo A1 e enviando o XML e DANFE automaticamente para seu cliente e contador."
    },
    {
      question: "O sistema funciona em celular ou tablet?",
      answer: "Sim! A Vendio é 100% em nuvem (SaaS). Você pode registrar vendas no caixa do tablet, consultar o estoque no celular enquanto visita fornecedores ou acompanhar o financeiro do seu notebook de onde estiver."
    },
    {
      question: "Como funciona o suporte técnico caso eu tenha dúvidas?",
      answer: "Nossos especialistas estão disponíveis no WhatsApp e no chat integrado para tirar dúvidas com atendimento humano rápido, além de uma central de ajuda com vídeos curtos e diretos ao ponto."
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className={styles.section}>
      <div className="container">
        <div className="section-tag">
          <span className="badge badge-primary">Tire suas Dúvidas</span>
        </div>
        <h2 className="section-title">Perguntas Frequentes</h2>
        <p className="section-subtitle">
          Tudo o que você precisa saber antes de transformar a gestão do seu pequeno negócio.
        </p>

        <div className={styles.faqList}>
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`${styles.faqCard} ${isOpen ? styles.faqOpen : ""}`}
              >
                <button
                  type="button"
                  className={styles.questionBtn}
                  onClick={() => toggleFaq(idx)}
                >
                  <span className={styles.questionText}>{faq.question}</span>
                  <span className={styles.chevronIcon}>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </span>
                </button>

                {isOpen && (
                  <div className={styles.answerWrapper}>
                    <p className={styles.answerText}>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
