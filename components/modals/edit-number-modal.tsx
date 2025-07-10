"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Interface para os valores do formulário
interface EditFormValues {
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

// Interface para o número WhatsApp
interface WhatsAppNumber {
  id: string
  contato: string | number
  numero: string | null
  cpf: string | null
  ativado_em: string | null
  reativado_em: string | null
  aparelho: string | null
  api: string | number | null
  desconectado_em: string | null
  recuperacao: string | null
  recarregar_em: string | null
  created_at: string
  quedas?: number | null
  aquecendo?: boolean
  tipo_whats?: string | null // Corrigido: whats_tipo -> tipo_whats
}

interface EditNumberModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  selectedNumber: WhatsAppNumber | null
  onSaveEdit: (values: EditFormValues) => Promise<void>
  isLoading: boolean
}

export function EditNumberModal({ isOpen, onOpenChange, selectedNumber, onSaveEdit, isLoading }: EditNumberModalProps) {
  // Estado local para os valores do formulário
  const [formValues, setFormValues] = useState<EditFormValues>({
    contato: "",
    numero: "",
    cpf: "",
    ativado_em: "",
    reativado_em: "",
    aparelho: "",
    api: "",
    desconectado_em: "",
    recarregar_em: "",
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

  // Atualizar o formulário quando o número selecionado mudar
  useEffect(() => {
    if (selectedNumber) {
      // Formatar o CPF se existir
      const formattedCPF = selectedNumber.cpf ? formatCPF(selectedNumber.cpf) : ""

      setFormValues({
        contato: selectedNumber.contato?.toString() || "",
        numero: selectedNumber.numero || "",
        cpf: formattedCPF,
        ativado_em: selectedNumber.ativado_em || "",
        reativado_em: selectedNumber.reativado_em || "",
        aparelho: selectedNumber.aparelho || "",
        api: selectedNumber.api?.toString() || "",
        desconectado_em: selectedNumber.desconectado_em || "",
        recarregar_em: selectedNumber.recarregar_em || "",
        tipo_whats: selectedNumber.tipo_whats || "whats", // Corrigido: whats_tipo -> tipo_whats
      })
    }
  }, [selectedNumber])

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
      await onSaveEdit(formValues)
      // O fechamento do modal é gerenciado pelo componente pai
    } catch (error) {
      console.error("Erro ao editar número:", error)
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
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Editar Número</DialogTitle>
          <DialogDescription>Edite os dados do número WhatsApp.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="edit-contato" className="text-sm font-medium">
                Chip
              </label>
              <Input id="edit-contato" name="contato" value={formValues.contato} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <label htmlFor="edit-numero" className="text-sm font-medium">
                Número
              </label>
              <Input id="edit-numero" name="numero" value={formValues.numero} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <label htmlFor="edit-cpf" className="text-sm font-medium">
                CPF
              </label>
              <Input
                id="edit-cpf"
                name="cpf"
                value={formValues.cpf}
                onChange={handleChange}
                placeholder="111.111.111-11"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="edit-aparelho" className="text-sm font-medium">
                Aparelho
              </label>
              <Input id="edit-aparelho" name="aparelho" value={formValues.aparelho} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <label htmlFor="edit-ativado_em" className="text-sm font-medium">
                Ativado em
              </label>
              <Input
                id="edit-ativado_em"
                name="ativado_em"
                type="date"
                value={formValues.ativado_em}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="edit-api" className="text-sm font-medium">
                API
              </label>
              <Input id="edit-api" name="api" value={formValues.api} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <label htmlFor="edit-desconectado_em" className="text-sm font-medium">
                Desconectado em
              </label>
              <Input
                id="edit-desconectado_em"
                name="desconectado_em"
                type="date"
                value={formValues.desconectado_em}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="edit-recarregar_em" className="text-sm font-medium">
                Recarregar em
              </label>
              <Input
                id="edit-recarregar_em"
                name="recarregar_em"
                type="date"
                value={formValues.recarregar_em}
                onChange={handleChange}
              />
            </div>
          </div>

          <DialogFooter className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="whats"
                  name="tipo_whats"
                  value="whats"
                  checked={formValues.tipo_whats === "whats"}
                  onChange={() => handleWhatsTypeChange("whats")}
                  className="sr-only"
                />
                <label
                  htmlFor="whats"
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
                  id="wduall"
                  name="tipo_whats"
                  value="wduall"
                  checked={formValues.tipo_whats === "wduall"}
                  onChange={() => handleWhatsTypeChange("wduall")}
                  className="sr-only"
                />
                <label
                  htmlFor="wduall"
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
                  id="wbusiness"
                  name="tipo_whats"
                  value="wbusiness"
                  checked={formValues.tipo_whats === "wbusiness"}
                  onChange={() => handleWhatsTypeChange("wbusiness")}
                  className="sr-only"
                />
                <label
                  htmlFor="wbusiness"
                  className={`flex items-center justify-center w-12 h-12 rounded-full cursor-pointer border-2 ${
                    formValues.tipo_whats === "wbusiness" ? "border-purple-500" : "border-gray-200"
                  }`}
                  title="WhatsApp Business"
                >
                  <img src="/images/wbusiness.png" alt="WhatsApp Business" className="w-8 h-8" />
                </label>
              </div>
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
