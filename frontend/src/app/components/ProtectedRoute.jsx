'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProtectedRoute({ children, funcoesPermitidas }) {
  const router = useRouter();
  const [podeEntrar, setPodeEntrar] = useState(false);

  useEffect(() => {
    const meuCracha = localStorage.getItem('funcao');

    if (meuCracha && funcoesPermitidas.includes(meuCracha)) {
      setPodeEntrar(true);
    } else {
      router.push('/');
    }
  }, []); 

  if (!podeEntrar) {
    return <div>Verificando seu crachá...</div>;
  }

  return <>{children}</>;
}