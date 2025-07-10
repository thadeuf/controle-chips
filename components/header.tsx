"use client"

import { usePathname } from "next/navigation"
import { LogoutButton } from "@/components/logout-button"
import { IframeModal } from "@/components/iframe-modal"
import { Smartphone } from "lucide-react"

export function Header() {
  const pathname = usePathname()
  const isLoginPage = pathname === "/login"

  if (isLoginPage) {
    return null
  }

  return (
    <header className="bg-white border-b shadow-sm py-3">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Smartphone className="h-6 w-6 text-purple-600" />
          <h1 className="text-xl font-bold text-gray-800">WhatsApp Dashboard</h1>
        </div>
        <div className="flex items-center gap-2">
          <IframeModal
            url="https://v0-gerador-de-cpf.vercel.app/"
            title="Gerador de Pessoas Fictícias"
            buttonText="Gerador de CPF"
          />
          <LogoutButton />
        </div>
      </div>
    </header>
  )
}
