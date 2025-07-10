"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  const handleLogout = async () => {
    setIsLoading(true)

    try {
      await supabase.auth.signOut()

      // Limpar cookies e redirecionar
      document.cookie.split(";").forEach((c) => {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/")
      })

      // Forçar navegação completa
      window.location.href = "/login"
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
      window.location.href = "/login"
    }
  }

  return (
    <Button
      variant="outline"
      onClick={handleLogout}
      disabled={isLoading}
      className="flex items-center gap-2 border-purple-200 hover:bg-purple-50 hover:text-purple-700"
    >
      <LogOut className="h-4 w-4" />
      {isLoading ? "Saindo..." : "Sair"}
    </Button>
  )
}
