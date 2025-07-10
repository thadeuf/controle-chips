"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { SimpleBarChart } from "./simple-bar-chart"
import { DeviceAllocationChart } from "./device-allocation-chart"
import { BarChart } from "lucide-react"
import { differenceInDays, parseISO } from "date-fns"

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
}

interface ChartsModalProps {
  data: WhatsAppNumber[]
}

export function ChartsModal({ data }: ChartsModalProps) {
  const [open, setOpen] = useState(false)

  // Processar dados para o gráfico de desconexão
  const disconnectionData = useMemo(() => {
    const today = new Date()

    return data
      .filter((item) => item.desconectado_em !== null)
      .map((item) => {
        let days = 0

        if (item.desconectado_em) {
          try {
            const date = item.desconectado_em.includes("T")
              ? new Date(item.desconectado_em)
              : parseISO(item.desconectado_em)

            days = differenceInDays(today, date)
          } catch (error) {
            console.error("Erro ao calcular dias:", error)
          }
        }

        return {
          label: `Chip ${item.contato}`, // Usando o número do chip (contato) em vez do número de telefone
          value: days,
        }
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, 15) // Mostrar até 15 itens para melhor visualização
  }, [data])

  // Processar dados para o gráfico de alocação de aparelhos
  const deviceAllocationData = useMemo(() => {
    const deviceCount: Record<string, number> = {}

    // Contar quantos números estão alocados para cada aparelho
    data.forEach((item) => {
      if (item.aparelho) {
        deviceCount[item.aparelho] = (deviceCount[item.aparelho] || 0) + 1
      }
    })

    // Converter para o formato do gráfico e ordenar por quantidade (decrescente)
    return Object.entries(deviceCount)
      .map(([device, count]) => ({
        label: device,
        value: count,
      }))
      .sort((a, b) => b.value - a.value)
  }, [data])

  // Dados de fallback caso não haja dados reais
  const fallbackData = [
    { label: "Chip 1", value: 30 },
    { label: "Chip 2", value: 25 },
    { label: "Chip 3", value: 20 },
    { label: "Chip 4", value: 15 },
    { label: "Chip 5", value: 10 },
  ]

  const fallbackDeviceData = [
    { label: "Aparelho 1", value: 15 },
    { label: "Aparelho 2", value: 12 },
    { label: "Aparelho 3", value: 8 },
    { label: "Aparelho 4", value: 5 },
    { label: "Aparelho 5", value: 3 },
  ]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <BarChart className="h-4 w-4" />
          Mostrar Gráficos
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gráficos e Visualizações</DialogTitle>
          <DialogDescription>Visualize dados importantes sobre os números de WhatsApp.</DialogDescription>
        </DialogHeader>

        <div className="mt-6 space-y-8">
          {/* Gráfico existente - Dias desde a desconexão */}
          <div>
            <h3 className="text-lg font-medium mb-4">Dias desde a desconexão</h3>
            <SimpleBarChart
              data={disconnectionData.length > 0 ? disconnectionData : fallbackData}
              title="Dias desde a desconexão"
              color="#8884d8"
            />

            {disconnectionData.length === 0 && (
              <div className="text-center text-gray-500 mt-4">
                Não há dados de desconexão disponíveis. Adicione datas de desconexão aos números para visualizar este
                gráfico.
              </div>
            )}
          </div>

          {/* Novo gráfico - Alocação por aparelho */}
          <div>
            <h3 className="text-lg font-medium mb-4">Alocação por aparelho</h3>
            <DeviceAllocationChart
              data={deviceAllocationData.length > 0 ? deviceAllocationData : fallbackDeviceData}
              title="Quantidade de números por aparelho"
              color="#6366f1"
            />

            {deviceAllocationData.length === 0 && (
              <div className="text-center text-gray-500 mt-4">
                Não há dados de aparelhos disponíveis. Adicione aparelhos aos números para visualizar este gráfico.
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
