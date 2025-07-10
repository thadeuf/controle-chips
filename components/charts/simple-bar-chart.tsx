"use client"

import { useEffect, useRef } from "react"

interface DataPoint {
  label: string
  value: number
}

interface SimpleBarChartProps {
  data: DataPoint[]
  title: string
  color?: string
}

export function SimpleBarChart({ data, title, color = "#8884d8" }: SimpleBarChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Limpar o canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Definir dimensões
    const padding = 60
    const chartWidth = canvas.width - padding * 2
    const chartHeight = canvas.height - padding * 2
    const barSpacing = 30
    const barHeight = Math.min(30, (chartHeight - barSpacing * (data.length - 1)) / data.length)

    // Encontrar o valor máximo para escala
    const maxValue = Math.max(...data.map((d) => d.value), 10)

    // Desenhar eixos
    ctx.beginPath()
    ctx.strokeStyle = "#ccc"
    ctx.lineWidth = 1
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, canvas.height - padding)
    ctx.lineTo(canvas.width - padding, canvas.height - padding)
    ctx.stroke()

    // Desenhar título
    ctx.font = "16px Arial"
    ctx.fillStyle = "#333"
    ctx.textAlign = "center"
    ctx.fillText(title, canvas.width / 2, 30)

    // Desenhar barras
    data.forEach((point, index) => {
      const barWidth = (point.value / maxValue) * chartWidth
      const y = padding + index * (barHeight + barSpacing)

      // Desenhar barra
      ctx.fillStyle = color
      ctx.fillRect(padding, y, barWidth, barHeight)

      // Desenhar label
      ctx.fillStyle = "#333"
      ctx.textAlign = "right"
      ctx.font = "12px Arial"
      ctx.fillText(
        point.label.substring(0, 15) + (point.label.length > 15 ? "..." : ""),
        padding - 5,
        y + barHeight / 2 + 4,
      )

      // Desenhar valor
      ctx.textAlign = "left"
      ctx.fillText(`${point.value} dias`, padding + barWidth + 5, y + barHeight / 2 + 4)
    })

    // Desenhar escala X
    for (let i = 0; i <= 5; i++) {
      const x = padding + (chartWidth * i) / 5
      const value = Math.round((maxValue * i) / 5)

      ctx.beginPath()
      ctx.strokeStyle = "#ccc"
      ctx.moveTo(x, canvas.height - padding)
      ctx.lineTo(x, canvas.height - padding + 5)
      ctx.stroke()

      ctx.fillStyle = "#666"
      ctx.textAlign = "center"
      ctx.font = "10px Arial"
      ctx.fillText(value.toString(), x, canvas.height - padding + 15)
    }

    // Título do eixo X
    ctx.fillStyle = "#666"
    ctx.textAlign = "center"
    ctx.font = "12px Arial"
    ctx.fillText("Dias", canvas.width / 2, canvas.height - 15)
  }, [data, title, color])

  return (
    <div className="w-full h-[500px] border rounded-lg p-4 bg-white">
      <canvas ref={canvasRef} width={800} height={500} className="w-full h-full" />
    </div>
  )
}
