"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session) {
          // Não há sessão, redirecionar para login
          router.replace("/login")
          return
        }

        // Verificar se o token ainda é válido
        const { error } = await supabase.auth.getUser()

        if (error) {
          console.error("Token inválido:", error)
          // Token inválido, fazer logout e redirecionar
          await supabase.auth.signOut()
          router.replace("/login")
          return
        }

        // Usuário autenticado
        setIsAuthenticated(true)
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error)
        setIsAuthenticated(false)
        router.replace("/login")
      }
    }

    // Verificar autenticação ao montar o componente
    checkAuth()

    // Configurar listener para mudanças na autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        router.replace("/login")
      }
    })

    // Limpar listener ao desmontar
    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [router, supabase])

  // Mostrar nada enquanto verifica autenticação
  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  // Se não estiver autenticado, não mostrar nada (redirecionamento já foi iniciado)
  if (!isAuthenticated) {
    return null
  }

  // Se estiver autenticado, mostrar o conteúdo
  return <>{children}</>
}
