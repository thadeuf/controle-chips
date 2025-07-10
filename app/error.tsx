"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error)
  }, [error])

  // Se o erro for de redirecionamento, redirecionar para login
  useEffect(() => {
    if (error.message === "NEXT_REDIRECT" || error.message.includes("Redirect")) {
      window.location.href = "/login"
    }
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h2 className="text-2xl font-bold mb-4">Algo deu errado!</h2>
      <p className="text-red-500 mb-4">{error.message}</p>
      <Button
        onClick={() => {
          reset()
        }}
      >
        Tentar novamente
      </Button>
    </div>
  )
}
