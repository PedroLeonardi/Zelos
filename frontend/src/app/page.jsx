// app/page.jsx
"use client";

import styles from "./page.module.css";
import { ShieldCheck, Wrench, HelpCircle } from "lucide-react";

export default function Home() {
  return (
    <main className={styles.pageContainer}>
      <section className={styles.mainContent}>
        <div className={styles.leftSection}>
          <h1 className={styles.mainTitle}>Zelos</h1>
          <p className={styles.mainSubtitle}>
            Sistema de Chamados da Escola SENAI Armando de Arruda Pereira
          </p>
          <a href="/login" className={styles.primaryButton}>
            Acessar Sistema
          </a>
        </div>
        <div className={styles.rightSection}>
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>
              <Wrench size={28} />
            </div>
            <div className={styles.featureContent}>
              <span className={styles.featureTitle}>Manutenção</span>
              <span className={styles.featureDescription}>
                Solicite suporte para equipamentos com número de patrimônio.
              </span>
            </div>
          </div>
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>
              <ShieldCheck size={28} />
            </div>
            <div className={styles.featureContent}>
              <span className={styles.featureTitle}>Segurança</span>
              <span className={styles.featureDescription}>
                Autenticação segura e dados protegidos com criptografia.
              </span>
            </div>
          </div>
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>
              <HelpCircle size={28} />
            </div>
            <div className={styles.featureContent}>
              <span className={styles.featureTitle}>Suporte Técnico</span>
              <span className={styles.featureDescription}>
                Equipe especializada para resolver problemas técnicos rapidamente.
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
