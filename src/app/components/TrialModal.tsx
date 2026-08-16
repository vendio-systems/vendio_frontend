"use client";

import { useState } from "react";
import styles from "./TrialModal.module.css";

interface TrialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TrialModal({ isOpen, onClose }: TrialModalProps) {
  const [step, setStep] = useState<"form" | "success">("form");
  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    whatsapp: "",
    email: "",
    businessType: "ambos"
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("success");
  };

  const handleReset = () => {
    setStep("form");
    onClose();
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          aria-label="Fechar"
          className={styles.closeBtn}
          onClick={onClose}
        >
          ✕
        </button>

        {step === "form" ? (
          <div>
            <div className={styles.modalHeader}>
              <div className={styles.logoBadge}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2">
                  <path d="M4 7L12 3L20 7V17L12 21L4 17V7Z"/>
                  <path d="M12 3V21"/>
                  <path d="M4 7L12 12L20 7"/>
                </svg>
              </div>
              <h3 className={styles.modalTitle}>Comece seu teste de 14 dias</h3>
              <p className={styles.modalSubtitle}>
                Acesso completo a todos os recursos. Sem cartão de crédito.
              </p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Seu Nome Completo</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: João da Silva"
                  className={styles.input}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Nome da sua Loja ou Empresa</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Studio Moda Urbana"
                  className={styles.input}
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                />
              </div>

              <div className={styles.rowTwo}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>WhatsApp com DDD</label>
                  <input
                    type="tel"
                    required
                    placeholder="(11) 99999-9999"
                    className={styles.input}
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>E-mail de Acesso</label>
                  <input
                    type="email"
                    required
                    placeholder="voce@empresa.com"
                    className={styles.input}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Qual é o formato do seu negócio?</label>
                <select
                  className={styles.select}
                  value={formData.businessType}
                  onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                >
                  <option value="ambos">Loja Física + Loja Virtual (Ambos)</option>
                  <option value="fisica">Apenas Loja Física / Balcão</option>
                  <option value="online">Apenas Loja Virtual / E-commerce</option>
                  <option value="comecando">Estou abrindo meu negócio agora</option>
                </select>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: "100%", padding: "0.85rem", marginTop: "0.5rem" }}
              >
                Liberar Acesso Imediato
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>

              <p className={styles.securityNote}>
                🔒 Seus dados estão 100% seguros. Não compartilhamos informações com terceiros.
              </p>
            </form>
          </div>
        ) : (
          <div className={styles.successWrapper}>
            <div className={styles.successIcon}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 className={styles.successTitle}>Tudo pronto, {formData.name || "parceiro"}!</h3>
            <p className={styles.successDesc}>
              Sua conta na **Vendio** para a loja **{formData.companyName || "seu negócio"}** foi pré-configurada com sucesso.
            </p>
            <div className={styles.trialInfoBox}>
              <div>✨ <strong>Período de Teste:</strong> 14 dias grátis ativos</div>
              <div>⚡ <strong>Módulos liberados:</strong> ERP + PDV + E-commerce + Financeiro</div>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="btn btn-primary"
              style={{ width: "100%" }}
            >
              Acessar Meu Painel Agora
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
