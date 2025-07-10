import { createClient } from "@/lib/supabase/server"
import Dashboard from "@/components/dashboard"
import ProtectedRoute from "./protected-route"

// Forçar que a página seja dinâmica e não seja cacheada
export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function Home() {
  try {
    const supabase = createClient()

    // Fetch WhatsApp numbers data
    let whatsappNumbers = []
    try {
      const { data, error } = await supabase
        .from("celulares_whatsapp")
        .select("*")
        .order("contato", { ascending: true })

      if (!error && data) {
        whatsappNumbers = data
      }
    } catch (fetchError) {
      console.error("Failed to fetch WhatsApp numbers:", fetchError)
      // Continuar mesmo se houver erro na busca de dados
    }

    return (
      <ProtectedRoute>
        <main className="container mx-auto py-6 px-4">
          <Dashboard initialData={whatsappNumbers} />
        </main>
      </ProtectedRoute>
    )
  } catch (error) {
    // Em caso de erro, mostrar uma mensagem amigável
    console.error("Error in Home component:", error)
    return (
      <main className="container mx-auto py-6 px-4">
        <div className="bg-red-50 text-red-500 p-4 rounded-md">
          <p>Ocorreu um erro ao carregar o dashboard.</p>
          <p>Por favor, tente novamente mais tarde ou contate o suporte.</p>
        </div>
      </main>
    )
  }
}
