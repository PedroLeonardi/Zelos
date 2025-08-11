// /src/app/layout.js

import './globals.css';

// Metadata pode ser adicionada aqui
export const metadata = {
  title: 'Dashboard SENAI',
  description: 'Sistema de Gerenciamento de Chamados',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <main style={{ padding: '' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
