// src/components/ProtectedRoute.jsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// A Sofia vai "vestir" as suas páginas para protegê-las
export default function ProtectedRoute({ children, funcoesPermitidas }) {
  const router = useRouter();
  const [podeEntrar, setPodeEntrar] = useState(false);

  useEffect(() => {
    // A Sofia olha o seu crachá (a função no localStorage)
    const meuCracha = localStorage.getItem('funcao');

    // Ela vê se o seu crachá está na lista de crachás permitidos para este quarto
    if (meuCracha && funcoesPermitidas.includes(meuCracha)) {
      // Se sim, ela abre a porta!
      setPodeEntrar(true);
    } else {
      // Se não, ela te guia de volta para o saguão principal do castelo.
      router.push('/');
    }
  }, []); // Ela só verifica isso uma vez

  // Enquanto ela verifica, mostramos uma tela de "Carregando..."
  if (!podeEntrar) {
    return <div>Verificando seu crachá...</div>;
  }

  // Se o crachá for o certo, você pode ver o conteúdo do quarto!
  return <>{children}</>;
}