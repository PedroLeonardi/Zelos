'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import './header.css';

// Ícone SVG como um componente para reutilização e clareza
const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);

export default function Header({ username = 'Usuário' }) {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Lógica para fechar o dropdown ao clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lógica para fechar com a tecla ESC
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const handleLogout = () => {
    // Idealmente, aqui você limparia a sessão/token do usuário
    console.log('Limpando dados locais...');
    localStorage.removeItem('id_usuario');
    localStorage.removeItem('authToken');
    console.log('Logging out...');
    router.push('/');
  };

  const getUserInitials = (name) => {
    const nameParts = name.split(' ');
    if (nameParts.length > 1) {
      return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <header className="app-header">
      <div className="logo-container" onClick={() => router.push('/dashboard')}>
        <img src="/SENAI_São_Paulo_logo.png" alt="Logo SENAI" className="logo" />
      </div>

      <div className="profile-container" ref={dropdownRef}>
        <button
          className="profile-button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          aria-haspopup="true"
          aria-expanded={isDropdownOpen}
        >
          <div className="user-avatar">{getUserInitials(username)}</div>
          <span className="user-name">Olá, {username}</span>
        </button>

        {isDropdownOpen && (
          <div className="profile-dropdown">
            <button onClick={handleLogout} className="dropdown-item dropdown-item--logout">
              <span>Sair</span>
              <LogoutIcon />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}