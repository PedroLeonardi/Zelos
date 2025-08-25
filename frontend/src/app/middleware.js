// src/middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  const chaveMagica = request.cookies.get('authToken')?.value;

  const porta = request.nextUrl.pathname;

  const quartosSecretos = ['/admin', '/tecnico', '/usuario'];
  const estaTentandoEntrarEmQuartoSecreto = quartosSecretos.some(quarto => porta.startsWith(quarto));

  if (estaTentandoEntrarEmQuartoSecreto && !chaveMagica) {
    const urlDaVila = new URL('/', request.url);
    return NextResponse.redirect(urlDaVila);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/tecnico/:path*', '/usuario/:path*'],
};