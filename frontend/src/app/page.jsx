import React from "react";
import styles from "./page.module.css";

export default function LoginPage() {
  return (
    <main className={styles.container}>
      {/* Logo SENAI no topo direito */}
      <div className={styles.logoContainer}>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/SENAI_S%C3%A3o_Paulo_logo.png/1200px-SENAI_S%C3%A3o_Paulo_logo.png" // coloca a logo aí no public/senai-logo.png
          alt="Logo SENAI"
          className={styles.logo}
          draggable={false}
        />
      </div>

      <section className={styles.bannerArea}>
        <div className={styles.banner}>
          <h2>Zelos</h2>
          <p>Painel de requisições de chamados </p>
        </div>
      </section>

      <section className={styles.loginArea}>
        <form className={styles.loginForm} noValidate>
          <h1 className={styles.title}>Entrar</h1>

          <label htmlFor="email" className={styles.label}>
            E-mail
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="seuemail@exemplo.com"
            required
            className={styles.input}
          />

          <label htmlFor="password" className={styles.label}>
            Senha
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="••••••••"
            required
            className={styles.input}
          />

          <button type="submit" className={styles.btn}>
            Entrar
          </button>
        </form>
      </section>
    </main>
  );
}
