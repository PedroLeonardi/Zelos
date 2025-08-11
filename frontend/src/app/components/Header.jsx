'use client'; 

import { useRouter } from 'next/navigation'; // pra redirecionar na lata 

export default function Header() { 
  const router = useRouter(); 

  const handleLogout = () => { 
    // Se quiser limpar token ou o que for, faz aqui 

    router.push('/'); // redireciona pra /login 
  }; 

  return ( 
    <header style={styles.header}> 
      <div style={styles.logoContainer}> 
        {/* Coloque aqui sua logo do SENAI */} 
        <img 
          src="/SENAI_São_Paulo_logo.png" // seu arquivo da logo tem que estar na pasta public 
          alt="Logo SENAI" 
          style={styles.logo} 
        /> 
      </div> 

      <button onClick={handleLogout} style={styles.logoutButton} aria-label="Sair da conta"> 
        {/* Ícone de logout (flat icon) */} 
        <img 
          src="/logout.png" // o ícone que você já tem, coloque na pasta public 
          alt="Sair" 
          style={styles.logoutIcon} 
        /> 
      </button> 
    </header> 
  ); 
} 

const styles = { 
  header: { 
    backgroundColor: '#d32f2f', // vermelho SENAI 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: '0.5rem 1rem', 
    height: '60px', 
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)', 
  }, 
  logoContainer: { 
    display: 'flex', 
    alignItems: 'center', 
  }, 
  logo: { 
    height: '40px', 
    objectFit: 'contain', 
  }, 
  logoutButton: { 
    background: 'transparent', 
    border: 'none', 
    cursor: 'pointer', 
    padding: 0, 
  }, 
  logoutIcon: { 
    height: '28px', 
    width: '28px', 
  }, 
};