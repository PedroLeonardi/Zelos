// src/middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('authToken')?.value;

  const url = request.nextUrl.pathname;

  const rotas = ['/admin', '/tecnico', '/usuario'];
  const tentativaUrl = rotas.some(quarto => url.startsWith(quarto));

  if (tentativaUrl && !token) {
    const urlDaVila = new URL('/', request.url);
    return NextResponse.redirect(urlDaVila);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/tecnico/:path*', '/usuario/:path*'],
};