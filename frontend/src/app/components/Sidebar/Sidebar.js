'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './sidebar.module.css';

// Ícones são ótimos para sidebars, mas usaremos texto por simplicidade.
const navLinks = [
  { name: 'Painel do Usuário', href: '/usuario' },
  { name: 'Painel do Técnico', href: '/tecnico' },
  { name: 'Painel do Admin', href: '/admin' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className={styles.sidebar}>
      <div className={styles.logo}>
        SENAI
      </div>
      <ul className={styles.navList}>
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <li key={link.name}>
              <Link href={link.href} className={isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
                {link.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}