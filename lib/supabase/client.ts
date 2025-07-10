import { createBrowserClient } from "@supabase/ssr"

// Hardcoded values for demonstration purposes
const SUPABASE_URL = "https://coaweadvgkcenjngsedz.supabase.co"
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNvYXdlYWR2Z2tjZW5qbmdzZWR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1NzE2NzksImV4cCI6MjA2MDE0NzY3OX0.WUrx7vNu1doE6zC3wmkZs8Z3kqUl5zc0pknRNYC86FE"

// Criar uma única instância do cliente Supabase
let supabaseClient: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  // Se já existe uma instância, retorná-la
  if (supabaseClient) {
    return supabaseClient
  }

  // Caso contrário, criar uma nova instância
  supabaseClient = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  return supabaseClient
}
