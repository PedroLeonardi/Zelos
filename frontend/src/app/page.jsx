"use client";

import React, { useState } from "react";
import styles from "./page.module.css";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState(""); // Estado para armazenar e exibir mensagens de erro

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Limpa erros anteriores ao tentar fazer login novamente

    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        // Se a resposta não for OK (status 2xx), lança um erro com a mensagem do backend
        throw new Error(data.message || "Falha no login. Verifique suas credenciais.");
      }

      // **AQUI A MÁGICA ACONTECE**
      // Supondo que o seu backend retorne um objeto com a propriedade "role" ou "cargo".
      // Adapte a linha abaixo conforme a resposta real da sua API. Ex: data.user.role, data.tipo, etc.
      const userRole = data.role; 

      // Redireciona o usuário com base no seu "role"
      if (userRole === "admin") {
        router.push("/admin");
      } else if (userRole === "tecnico") {
        router.push("/tecnico");
      } else if (userRole === "usuario") {
        router.push("/usuario");
      } else {
        // Caso o "role" não seja nenhum dos esperados, exibe um erro.
        throw new Error("Tipo de usuário desconhecido. Contate o suporte.");
      }

    } catch (err) {
      console.error("Erro no login:", err);
      // Define a mensagem de erro para ser exibida na tela
      setError(err.message);
    }
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

          {/* Componente para exibir a mensagem de erro */}
          {error && <p className={styles.errorMessage}>{error}</p>}

          {/* Campo ID */}
          <label htmlFor="username" className={styles.label}>
            ID
          </label>
          <input
            type="text"
            id="username" // É uma boa prática o 'htmlFor' do label corresponder ao 'id' do input
            name="username"
            placeholder="••••••••"
            required
            className={styles.input}
            autoComplete="username"
            maxLength={12}
            value={formData.username}
            onChange={handleChange}
          />

          {/* Campo Senha */}
          <label htmlFor="password" className={styles.label}>
            Senha
          </label>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              id="password" // É uma boa prática o 'htmlFor' do label corresponder ao 'id' do input
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

          <button type="submit" className={styles.btn}>Entrar</button>

        </form>
      </section>
    </main>
  );
}