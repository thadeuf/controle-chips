import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

// Hardcoded values for demonstration purposes
const SUPABASE_URL = "https://coaweadvgkcenjngsedz.supabase.co"
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNvYXdlYWR2Z2tjZW5qbmdzZWR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1NzE2NzksImV4cCI6MjA2MDE0NzY3OX0.WUrx7vNu1doE6zC3wmkZs8Z3kqUl5zc0pknRNYC86FE"

export function createClient() {
  const cookieStore = cookies()

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      get(name) {
        return cookieStore.get(name)?.value
      },
      set(name, value, options) {
        try {
          cookieStore.set({ name, value, ...options })
        } catch (error) {
          // Ignorar erros de cookies em ambientes onde não é possível definir cookies
          console.error(`Error setting cookie ${name}:`, error)
        }
      },
      remove(name, options) {
        try {
          cookieStore.set({ name, value: "", ...options })
        } catch (error) {
          // Ignorar erros de cookies em ambientes onde não é possível remover cookies
          console.error(`Error removing cookie ${name}:`, error)
        }
      },
    },
  })
}
