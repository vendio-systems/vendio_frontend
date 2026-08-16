"use client";

import { useState, useEffect } from "react";
import styles from "./Navbar.module.css";

interface NavbarProps {
  onOpenTrial: () => void;
}

export default function Navbar({ onOpenTrial }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}>
      <div className={`container ${styles.navContainer}`}>
        <a href="#" className={styles.brand}>
          <div className={styles.logoIcon}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 7L12 3L20 7V17L12 21L4 17V7Z" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 3V21" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4 7L12 12L20 7" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className={styles.brandText}>
            Vendio<span className={styles.brandDot}>.</span>
          </span>
        </a>

        {/* Desktop Nav Links */}
        <nav className={styles.desktopNav}>
          <a href="#recursos" className={styles.navLink}>Recursos</a>
          <a href="#como-funciona" className={styles.navLink}>Como Funciona</a>
          <a href="#economia" className={styles.navLink}>Simulador de ROI</a>
          <a href="#precos" className={styles.navLink}>Planos</a>
          <a href="#faq" className={styles.navLink}>Dúvidas</a>
        </nav>

        {/* Desktop CTA */}
        <div className={styles.navActions}>
          <button 
            type="button" 
            onClick={onOpenTrial}
            className={styles.loginBtn}
          >
            Entrar
          </button>
          <button 
            type="button" 
            onClick={onOpenTrial}
            className="btn btn-primary"
          >
            Começar Grátis
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          type="button"
          aria-label="Abrir menu"
          className={styles.hamburger}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span className={`${styles.bar} ${mobileMenuOpen ? styles.bar1Open : ""}`}></span>
          <span className={`${styles.bar} ${mobileMenuOpen ? styles.bar2Open : ""}`}></span>
          <span className={`${styles.bar} ${mobileMenuOpen ? styles.bar3Open : ""}`}></span>
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className={styles.mobileDrawer}>
          <nav className={styles.mobileNavLinks}>
            <a href="#recursos" onClick={() => setMobileMenuOpen(false)}>Recursos</a>
            <a href="#como-funciona" onClick={() => setMobileMenuOpen(false)}>Como Funciona</a>
            <a href="#economia" onClick={() => setMobileMenuOpen(false)}>Simulador de ROI</a>
            <a href="#precos" onClick={() => setMobileMenuOpen(false)}>Planos</a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)}>Dúvidas</a>
            <div className={styles.mobileDrawerCtas}>
              <button 
                type="button" 
                onClick={() => { setMobileMenuOpen(false); onOpenTrial(); }}
                className="btn btn-primary"
                style={{ width: "100%" }}
              >
                Testar 14 Dias Grátis
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
