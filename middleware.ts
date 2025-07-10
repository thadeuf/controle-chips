import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Desativar o middleware para evitar conflitos com a autenticação no lado do cliente
export function middleware(request: NextRequest) {
  return NextResponse.next()
}

// Configurar em quais caminhos o middleware deve ser executado
export const config = {
  matcher: [],
}
