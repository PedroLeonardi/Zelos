// /src/app/layout.js

import './globals.css';
import Sidebar from './components/Sidebar/Sidebar';

// Metadata pode ser adicionada aqui
export const metadata = {
  title: 'Dashboard SENAI',
  description: 'Sistema de Gerenciamento de Chamados',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <div style={{ display: 'flex' }}>
          <Sidebar />
          <main style={{ flexGrow: 1, padding: '2rem' }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}