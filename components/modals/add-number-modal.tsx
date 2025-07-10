"use client"

import type React from "react"

import { useState } from "react"
import { format, addDays } from "date-fns"
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
import { Plus } from "lucide-react"

// Atualizar a interface AddFormValues para incluir tipo_whats
interface AddFormValues {
  contato: string
  numero: string
  cpf: string
  ativado_em: string
  reativado_em: string
  aparelho: string
  api: string
  desconectado_em: string
  recarregar_em: string
  tipo_whats: string // Corrigido: whats_tipo -> tipo_whats
}

interface AddNumberModalProps {
  onAddNumber: (values: AddFormValues) => Promise<void>
  isLoading: boolean
}

export function AddNumberModal({ onAddNumber, isLoading }: AddNumberModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Get current date in YYYY-MM-DD format for form defaults
  const today = new Date()
  const formattedToday = format(today, "yyyy-MM-dd")
  const rechargeDate = format(addDays(today, 60), "yyyy-MM-dd")

  // Atualizar o estado inicial para incluir tipo_whats
  const [formValues, setFormValues] = useState<AddFormValues>({
    contato: "",
    numero: "",
    cpf: "",
    ativado_em: formattedToday,
    reativado_em: "",
    aparelho: "",
    api: "",
    desconectado_em: "",
    recarregar_em: rechargeDate,
    tipo_whats: "whats", // Corrigido: whats_tipo -> tipo_whats
  })

  // Função para aplicar máscara ao CPF
  const formatCPF = (value: string): string => {
    // Remove todos os caracteres não numéricos
    const cpfDigits = value.replace(/\D/g, "")

    // Limita a 11 dígitos
    const cpfLimited = cpfDigits.slice(0, 11)

    // Aplica a máscara
    if (cpfLimited.length <= 3) {
      return cpfLimited
    } else if (cpfLimited.length <= 6) {
      return `${cpfLimited.slice(0, 3)}.${cpfLimited.slice(3)}`
    } else if (cpfLimited.length <= 9) {
      return `${cpfLimited.slice(0, 3)}.${cpfLimited.slice(3, 6)}.${cpfLimited.slice(6)}`
    } else {
      return `${cpfLimited.slice(0, 3)}.${cpfLimited.slice(3, 6)}.${cpfLimited.slice(6, 9)}-${cpfLimited.slice(9)}`
    }
  }

  // Função para atualizar os valores do formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    // Se for o campo CPF, aplicar a máscara
    if (name === "cpf") {
      setFormValues((prev) => ({
        ...prev,
        [name]: formatCPF(value),
      }))
    } else {
      setFormValues((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  // Função para lidar com o envio do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await onAddNumber(formValues)

      // Resetar o formulário
      setFormValues({
        contato: "",
        numero: "",
        cpf: "",
        ativado_em: formattedToday,
        reativado_em: "",
        aparelho: "",
        api: "",
        desconectado_em: "",
        recarregar_em: rechargeDate,
        tipo_whats: "whats", // Corrigido: whats_tipo -> tipo_whats
      })

      // Fechar o modal
      setIsOpen(false)
    } catch (error) {
      console.error("Erro ao adicionar número:", error)
    }
  }

  // Adicionar uma função para lidar com a mudança do tipo de WhatsApp
  const handleWhatsTypeChange = (value: string) => {
    setFormValues((prev) => ({
      ...prev,
      tipo_whats: value, // Corrigido: whats_tipo -> tipo_whats
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Adicionar Número
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Número</DialogTitle>
          <DialogDescription>Preencha os dados do novo número WhatsApp.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="contato" className="text-sm font-medium">
                Chip
              </label>
              <Input id="contato" name="contato" value={formValues.contato} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <label htmlFor="numero" className="text-sm font-medium">
                Número
              </label>
              <Input id="numero" name="numero" value={formValues.numero} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <label htmlFor="cpf" className="text-sm font-medium">
                CPF
              </label>
              <Input id="cpf" name="cpf" value={formValues.cpf} onChange={handleChange} placeholder="111.111.111-11" />
            </div>

            <div className="space-y-2">
              <label htmlFor="aparelho" className="text-sm font-medium">
                Aparelho
              </label>
              <Input id="aparelho" name="aparelho" value={formValues.aparelho} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <label htmlFor="ativado_em" className="text-sm font-medium">
                Ativado em
              </label>
              <Input
                id="ativado_em"
                name="ativado_em"
                type="date"
                value={formValues.ativado_em}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="api" className="text-sm font-medium">
                API
              </label>
              <Input id="api" name="api" value={formValues.api} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <label htmlFor="recarregar_em" className="text-sm font-medium">
                Recarregar em
              </label>
              <Input
                id="recarregar_em"
                name="recarregar_em"
                type="date"
                value={formValues.recarregar_em}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-4">
              <p className="text-sm font-medium">Tipo de WhatsApp:</p>

              <div className="flex items-center">
                <input
                  type="radio"
                  id="add-whats"
                  name="tipo_whats"
                  value="whats"
                  checked={formValues.tipo_whats === "whats"}
                  onChange={() => handleWhatsTypeChange("whats")}
                  className="sr-only"
                />
                <label
                  htmlFor="add-whats"
                  className={`flex items-center justify-center w-12 h-12 rounded-full cursor-pointer border-2 ${
                    formValues.tipo_whats === "whats" ? "border-purple-500" : "border-gray-200"
                  }`}
                  title="WhatsApp Padrão"
                >
                  <img src="/images/whats.png" alt="WhatsApp Padrão" className="w-8 h-8" />
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="radio"
                  id="add-wduall"
                  name="tipo_whats"
                  value="wduall"
                  checked={formValues.tipo_whats === "wduall"}
                  onChange={() => handleWhatsTypeChange("wduall")}
                  className="sr-only"
                />
                <label
                  htmlFor="add-wduall"
                  className={`flex items-center justify-center w-12 h-12 rounded-full cursor-pointer border-2 ${
                    formValues.tipo_whats === "wduall" ? "border-purple-500" : "border-gray-200"
                  }`}
                  title="WhatsApp Dual"
                >
                  <img src="/images/wduall.jpeg" alt="WhatsApp Dual" className="w-8 h-8 rounded-full" />
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="radio"
                  id="add-wbusiness"
                  name="tipo_whats"
                  value="wbusiness"
                  checked={formValues.tipo_whats === "wbusiness"}
                  onChange={() => handleWhatsTypeChange("wbusiness")}
                  className="sr-only"
                />
                <label
                  htmlFor="add-wbusiness"
                  className={`flex items-center justify-center w-12 h-12 rounded-full cursor-pointer border-2 ${
                    formValues.tipo_whats === "wbusiness" ? "border-purple-500" : "border-gray-200"
                  }`}
                  title="WhatsApp Business"
                >
                  <img src="/images/wbusiness.png" alt="WhatsApp Business" className="w-8 h-8" />
                </label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
