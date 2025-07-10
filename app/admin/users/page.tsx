"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { UserRegisterModal } from "@/components/modals/user-register-modal"
import { RefreshCw, Trash2 } from "lucide-react"

interface User {
  id: string
  nome: string
  email: string
  created_at: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  // Carregar usuários ao montar o componente
  useEffect(() => {
    fetchUsers()
  }, [])

  // Buscar usuários do Supabase
  const fetchUsers = async () => {
    setIsLoading(true)

    try {
      const { data, error } = await supabase.from("usuarios").select("*").order("nome", { ascending: true })

      if (error) {
        throw new Error(error.message)
      }

      setUsers(data || [])
    } catch (error) {
      console.error("Erro ao buscar usuários:", error)
      toast({
        title: "Erro ao buscar usuários",
        description: error instanceof Error ? error.message : "Ocorreu um erro inesperado",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Excluir usuário
  const deleteUser = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este usuário?")) return

    setIsLoading(true)

    try {
      // 1. Excluir da tabela usuarios
      const { error: userError } = await supabase.from("usuarios").delete().eq("id", id)

      if (userError) {
        throw new Error(userError.message)
      }

      // 2. Excluir da autenticação (opcional, dependendo da configuração do Supabase)
      // Isso pode exigir uma função RPC ou uma função serverless

      toast({
        title: "Usuário excluído",
        description: "O usuário foi excluído com sucesso.",
      })

      // Atualizar a lista de usuários
      fetchUsers()
    } catch (error) {
      console.error("Erro ao excluir usuário:", error)
      toast({
        title: "Erro ao excluir usuário",
        description: error instanceof Error ? error.message : "Ocorreu um erro inesperado",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Formatar data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gerenciamento de Usuários</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchUsers} disabled={isLoading} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Atualizar
          </Button>
          <UserRegisterModal />
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Data de Cadastro</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  {isLoading ? "Carregando..." : "Nenhum usuário encontrado"}
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.nome}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{formatDate(user.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => deleteUser(user.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Toaster />
    </div>
  )
}
