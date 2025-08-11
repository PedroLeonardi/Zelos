"use client";

import React, { useState } from "react";
import styles from "./page.module.css";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ id: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 🔴🔴🔴 Aqui vai a integração com o backend e banco de dados
    // Exemplo:
    // fetch("/api/login", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(formData)
    // })
    //   .then(res => res.json())
    //   .then(data => console.log(data))
    //   .catch(err => console.error(err));

    console.log("Dados enviados:", formData);
  };

  return (
    <main className={styles.container}>
      {/* Logo SENAI no topo direito */}
      <div className={styles.logoContainer}>
        <img
          src="/SENAI_São_Paulo_logo.png"
          alt="Logo SENAI"
          className={styles.logo}
          draggable="false"
        />
      </div>

      {/* Banner */}
      <section className={styles.bannerArea}>
        <div className={styles.banner}>
          <h2>Zelos</h2>
          <p>Painel de requisições de chamados</p>
        </div>
      </section>

      {/* Formulário de Login */}
      <section className={styles.loginArea}>
        <form className={styles.loginForm} onSubmit={handleSubmit} noValidate>
          <h1 className={styles.title}>Entrar</h1>

          {/* Campo ID */}
          <label htmlFor="id" className={styles.label}>
            ID
          </label>
          <input
            type="text"
            id="id"
            name="id"
            placeholder="••••••••"
            required
            className={styles.input}
            autoComplete="username"
            maxLength={12}
            value={formData.id}
            onChange={handleChange}
          />

          {/* Campo Senha */}
          <label htmlFor="password" className={styles.label}>
            Senha
          </label>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="••••••••"
              required
              className={styles.input}
              autoComplete="current-password"
              maxLength={20}
              value={formData.password}
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={styles.eyeBtn}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontSize: "1.3rem",
                color: "#555"
              }}
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
            </button>
          </div>

          <button type="submit" className={styles.btn}>
            Entrar
          </button>
        </form>
      </section>
    </main>
  );
}
