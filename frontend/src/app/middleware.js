// src/middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  // O Bárbaro procura pela Chave Mágica (o cookie 'authToken')
  const chaveMagica = request.cookies.get('authToken')?.value;

  // Ele vê qual porta você está tentando usar (a URL)
  const porta = request.nextUrl.pathname;

  // Ele sabe quais são os quartos secretos que precisam de chave
  const quartosSecretos = ['/admin', '/tecnico', '/usuario'];
  const estaTentandoEntrarEmQuartoSecreto = quartosSecretos.some(quarto => porta.startsWith(quarto));

  // Se você tenta entrar num quarto secreto SEM a chave...
  if (estaTentandoEntrarEmQuartoSecreto && !chaveMagica) {
    // ...O BÁRBARO TE MANDA DE VOLTA PARA A VILA (página de login)!
    const urlDaVila = new URL('/', request.url);
    return NextResponse.redirect(urlDaVila);
  }

  // Se você tiver a chave, ele diz "Pode passar!"
  return NextResponse.next();
}

// Aqui dizemos ao Bárbaro em quais portões ele deve ficar de olho
export const config = {
  matcher: ['/admin/:path*', '/tecnico/:path*', '/usuario/:path*'],
};