'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import './header.css'; // vamos usar CSS externo pra hover animado

export default function Header({ username = 'Usuário' }) {
  const router = useRouter();
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    // Limpa token ou sessão se precisar
    router.push('/'); // redireciona pra login
  };

  return (
    <header className="app-header">
      <div className="logo-container">
        <img
          src="/SENAI_São_Paulo_logo.png"
          alt="Logo SENAI"
          className="logo"
        />
        {windowWidth > 480 && (
          <span className="username">Olá, {username}</span>
        )}
      </div>

      <button
        onClick={handleLogout}
        className="logout-button"
        aria-label="Sair da conta"
        title="Sair"
      >
        <img
          src="/logout.png"
          alt="Sair"
          className="logout-icon"
        />
      </button>
    </header>
  );
}
