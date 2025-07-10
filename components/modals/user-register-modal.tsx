"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { UserPlus } from "lucide-react"

// Interface para os valores do formulário
interface UserFormValues {
  nome: string
  email: string
  senha: string
  confirmarSenha: string
}

export function UserRegisterModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  // Estado local para os valores do formulário
  const [formValues, setFormValues] = useState<UserFormValues>({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
  })

  // Estado para erros de validação
  const [errors, setErrors] = useState<{
    nome?: string
    email?: string
    senha?: string
    confirmarSenha?: string
    geral?: string
  }>({})

  // Função para atualizar os valores do formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Limpar erro do campo quando o usuário digita
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }))
    }
  }

  // Validar o formulário
  const validateForm = (): boolean => {
    const newErrors: typeof errors = {}
    let isValid = true

    if (!formValues.nome.trim()) {
      newErrors.nome = "Nome é obrigatório"
      isValid = false
    }

    if (!formValues.email.trim()) {
      newErrors.email = "Email é obrigatório"
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
      newErrors.email = "Email inválido"
      isValid = false
    }

    if (!formValues.senha) {
      newErrors.senha = "Senha é obrigatória"
      isValid = false
    } else if (formValues.senha.length < 6) {
      newErrors.senha = "A senha deve ter pelo menos 6 caracteres"
      isValid = false
    }

    if (formValues.senha !== formValues.confirmarSenha) {
      newErrors.confirmarSenha = "As senhas não coincidem"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  // Função para lidar com o envio do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // 1. Criar o usuário na autenticação do Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formValues.email,
        password: formValues.senha,
        options: {
          data: {
            nome: formValues.nome,
          },
        },
      })

      if (authError) {
        throw new Error(authError.message)
      }

      if (!authData.user) {
        throw new Error("Erro ao criar usuário")
      }

      // 2. Adicionar os dados adicionais na tabela "usuarios"
      const { error: userError } = await supabase.from("usuarios").insert([
        {
          id: authData.user.id, // Usar o ID gerado pela autenticação
          nome: formValues.nome,
          email: formValues.email,
        },
      ])

      if (userError) {
        throw new Error(userError.message)
      }

      toast({
        title: "Usuário cadastrado com sucesso",
        description: "Verifique seu email para confirmar o cadastro.",
      })

      // Resetar o formulário
      setFormValues({
        nome: "",
        email: "",
        senha: "",
        confirmarSenha: "",
      })

      // Fechar o modal
      setIsOpen(false)
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error)
      setErrors({
        geral: error instanceof Error ? error.message : "Erro ao cadastrar usuário",
      })
      toast({
        title: "Erro ao cadastrar usuário",
        description: error instanceof Error ? error.message : "Ocorreu um erro inesperado",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Cadastrar Usuário
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Cadastrar Novo Usuário</DialogTitle>
          <DialogDescription>Preencha os dados para cadastrar um novo usuário no sistema.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.geral && <div className="text-sm font-medium text-red-500">{errors.geral}</div>}

          <div className="space-y-2">
            <label htmlFor="nome" className="text-sm font-medium">
              Nome
            </label>
            <Input id="nome" name="nome" value={formValues.nome} onChange={handleChange} />
            {errors.nome && <div className="text-sm font-medium text-red-500">{errors.nome}</div>}
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input id="email" name="email" type="email" value={formValues.email} onChange={handleChange} />
            {errors.email && <div className="text-sm font-medium text-red-500">{errors.email}</div>}
          </div>

          <div className="space-y-2">
            <label htmlFor="senha" className="text-sm font-medium">
              Senha
            </label>
            <Input id="senha" name="senha" type="password" value={formValues.senha} onChange={handleChange} />
            {errors.senha && <div className="text-sm font-medium text-red-500">{errors.senha}</div>}
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmarSenha" className="text-sm font-medium">
              Confirmar Senha
            </label>
            <Input
              id="confirmarSenha"
              name="confirmarSenha"
              type="password"
              value={formValues.confirmarSenha}
              onChange={handleChange}
            />
            {errors.confirmarSenha && <div className="text-sm font-medium text-red-500">{errors.confirmarSenha}</div>}
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Cadastrando..." : "Cadastrar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
