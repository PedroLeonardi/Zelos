"use client";

import React, { useState } from "react";
import styles from "./page.module.css";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useRouter } from "next/navigation";

// Componente para o spinner de carregamento
const LoadingSpinner = () => <div className={styles.spinner}></div>;

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/auth/login";

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Falha na autenticação. Verifique suas credenciais.");
      }

      // --- ALTERAÇÃO APLICADA AQUI ---
      // 1. Salva o token recebido da API no localStorage.
      // 2. Salva o ID do usuário também no localStorage.
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('id', data.user.id); // Salvando o ID do usuário
      // --- FIM DA ALTERAÇÃO ---

      const userRole = data.user.funcao;

      localStorage.setItem("id_usuario", data.user_id);

      // Redireciona com base na função do usuário
      switch (userRole) {
        case "Administrador":
          router.push("/admin");
          break;
        case "Técnico":
          router.push("/tecnico");
          break;
        case "Usuário":
          router.push("/usuario");
          break;
        default:
          throw new Error("Tipo de usuário desconhecido. Contate o suporte.");
      }

    } catch (err) {
      console.error("Erro no login:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={styles.container}>
      <a href="https://sp.senai.br/" target="_blank" rel="noopener noreferrer" className={styles.logoContainer}>
        <img
          src="/SENAI_São_Paulo_logo.png"
          alt="Logo SENAI São Paulo"
          className={styles.logo}
          draggable="false"
        />
      </a>

      <section className={styles.bannerArea}>
        <div className={styles.banner}>
          <h2>Zelos</h2>
          <p>Painel de requisições e gerenciamento de chamados técnicos.</p>
        </div>
      </section>

      <section className={styles.loginArea}>
        <form className={styles.loginForm} onSubmit={handleSubmit} noValidate>
          <h1 className={styles.title}>Entrar</h1>

          {error && (
            <p className={styles.errorMessage} aria-live="polite">
              {error}
            </p>
          )}

          <div className={styles.inputGroup}>
            <label htmlFor="username" className={styles.label}>
              ID de Usuário
            </label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Digite seu ID"
              required
              className={`${styles.input} ${error ? styles.inputError : ""}`}
              autoComplete="username"
              maxLength={12}
              value={formData.username}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              Senha
            </label>
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="••••••••••"
                required
                className={`${styles.input} ${error ? styles.inputError : ""}`}
                autoComplete="current-password"
                maxLength={20}
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={styles.eyeBtn}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                disabled={isLoading}
              >
                {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
              </button>
            </div>
          </div>

          <button type="submit" className={styles.btn} disabled={isLoading}>
            {isLoading ? <LoadingSpinner /> : "Entrar"}
          </button>
        </form>
      </section>
    </main>
  );
}