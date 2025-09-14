"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Pencil,
  RefreshCw,
  Trash2,
  RotateCcw,
  Check,
  Search,
  Filter,
  X,
  AlertTriangle,
  CheckCircle,
  Clock,
  PhoneCall,
  Flame,
  HelpCircle,
  Activity,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Copy,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { format, differenceInDays, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"
import { ChartsModal } from "./charts/charts-modal"
import { AddNumberModal } from "./modals/add-number-modal"
import { EditNumberModal } from "./modals/edit-number-modal"
// Importações removidas
// import { UserRegisterModal } from "./modals/user-register-modal"
// import { LogoutButton } from "./logout-button"

// Define the WhatsApp number type
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

// Interface para os valores do formulário
interface FormValues {
  contato?: string
  numero: string
  cpf: string
  ativado_em?: string | null
  reativado_em?: string | null
  aparelho: string
  api?: string | null
  desconectado_em?: string | null
  recarregar_em?: string | null
  tipo_whats?: string | null // Corrigido: whats_tipo -> tipo_whats
}

export default function Dashboard({ initialData }: { initialData: WhatsAppNumber[] }) {
  // Ordenar os dados iniciais por contato
  const sortedInitialData = [...initialData].sort((a, b) => {
    const contatoA = Number(a.contato) || 0
    const contatoB = Number(b.contato) || 0
    return contatoA - contatoB
  })

  const [data, setData] = useState<WhatsAppNumber[]>(sortedInitialData)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedNumber, setSelectedNumber] = useState<WhatsAppNumber | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Adicionar estados para busca e filtros após a declaração dos outros estados
  const [searchTerm, setSearchTerm] = useState("")
  const [aparelhoFilter, setAparelhoFilter] = useState<string[]>([])
  const [apiFilter, setApiFilter] = useState<string[]>([])
  const [showRecuperacaoOnly, setShowRecuperacaoOnly] = useState(false) // Estado para filtro de recuperação
  const [showAquecendoOnly, setShowAquecendoOnly] = useState(false) // Novo estado para filtro de aquecimento
  // Adicionar um novo estado para o filtro "Sem Alocação"
  const [showSemAlocacaoOnly, setShowSemAlocacaoOnly] = useState(false)
  // Novo estado para o filtro "Números Ativos"
  const [showAtivosOnly, setShowAtivosOnly] = useState(false)

  // Adicionar os estados de ordenação após os outros estados
  const [sortColumn, setSortColumn] = useState<"contato" | "api" | "dias_ativacao" | "dias_desconexao">("contato")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  // Criar uma única instância do cliente Supabase
  const supabaseRef = useRef(createClient())
  const supabase = supabaseRef.current

  // Get current date in YYYY-MM-DD format for form defaults
  const today = new Date()
  const formattedToday = format(today, "yyyy-MM-dd")

  // Modificar a função getWhatsAppTypeIcon para usar os caminhos corretos das imagens
  // Substituir a função atual por esta:

  // Função para obter o ícone do tipo de WhatsApp
  const getWhatsAppTypeIcon = (type: string | null | undefined) => {
    if (type === null || type === undefined) return null

    switch (type) {
      case "wduall":
        return "/images/wduall.jpeg"
      case "wbusiness":
        return "/images/wbusiness.png"
      case "whats":
        return "/images/whats.png"
      default:
        return null
    }
  }

  // Garantir que os dados estejam ordenados na inicialização
  useEffect(() => {
    // Carregar dados ordenados do Supabase na inicialização
    refreshData()
  }, [])

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-"

    try {
      // Handle different date formats that might come from the database
      let date: Date

      // Check if the date is already in ISO format or needs parsing
      if (dateString.includes("T")) {
        date = new Date(dateString)
      } else {
        // Handle YYYY-MM-DD format
        date = parseISO(dateString)
      }

      // Check if date is valid
      if (isNaN(date.getTime())) return "-"

      return format(date, "dd/MM/yyyy", { locale: ptBR })
    } catch (error) {
      console.error("Error formatting date:", error, "Date string:", dateString)
      return dateString // Return the original string if formatting fails
    }
  }

  // Calculate days between a date and today
  const calculateDays = (dateString: string | null) => {
    if (!dateString) return "-"

    try {
      // Handle different date formats that might come from the database
      let date: Date

      // Check if the date is already in ISO format or needs parsing
      if (dateString.includes("T")) {
        date = new Date(dateString)
      } else {
        // Handle YYYY-MM-DD format
        date = parseISO(dateString)
      }

      // Check if date is valid
      if (isNaN(date.getTime())) return "-"

      const days = differenceInDays(today, date)
      return days.toString()
    } catch (error) {
      console.error("Error calculating days:", error, "Date string:", dateString)
      return "-"
    }
  }

  // Função para verificar se uma string contém o termo de busca
  const containsSearchTerm = (value: string | number | null | undefined, searchTerm: string): boolean => {
    if (value === null || value === undefined) return false
    return value.toString().toLowerCase().includes(searchTerm.toLowerCase())
  }

  // Função para verificar se um número é ativo (tem API numérica, não é EVO nem FIN)
  const isNumeroAtivo = (number: WhatsAppNumber): boolean => {
    // Verificar se tem API
    if (number.api === null || number.api === undefined || number.api.toString().trim() === "") {
      return false
    }

    // Verificar se a API contém EVO ou FIN
    const apiStr = number.api.toString().toUpperCase()
    if (apiStr.includes("EVO") || apiStr.includes("FIN")) {
      return false
    }

    // Verificar se a API é numérica
    // Primeiro remover espaços e verificar se o resultado é um número
    const apiTrimmed = number.api.toString().trim()
    return !isNaN(Number(apiTrimmed))
  }

  // Adicionar a função de ordenação após a função isNumeroAtivo
  const handleSort = (column: "contato" | "api" | "dias_ativacao" | "dias_desconexao") => {
    if (sortColumn === column) {
      // Se já estamos ordenando por esta coluna, alternar a direção
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      // Se estamos mudando de coluna, definir a nova coluna e resetar para ascendente
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  // Função para filtrar os dados com base na busca e filtros
  const filteredData = useMemo(() => {
    // Primeiro filtrar os dados
    const filtered = data.filter((number) => {
      // Filtro de recuperação
      if (showRecuperacaoOnly && !number.recuperacao) {
        return false
      }

      // Filtro de aquecimento
      if (showAquecendoOnly && !number.aquecendo) {
        return false
      }

      // Filtro de sem alocação
      if (showSemAlocacaoOnly) {
        const naoEstaAquecendo = number.aquecendo !== true
        const semApi = number.api === null || number.api === undefined || number.api.toString().trim() === ""
        if (!(naoEstaAquecendo && semApi)) {
          return false
        }
      }

      // Filtro de números ativos
      if (showAtivosOnly && !isNumeroAtivo(number)) {
        return false
      }

      // Filtro de busca geral (número, aparelho, API)
      const matchesSearch =
        searchTerm === "" ||
        containsSearchTerm(number.numero, searchTerm) ||
        containsSearchTerm(number.aparelho, searchTerm) ||
        containsSearchTerm(number.api, searchTerm)

      // Filtro de aparelho
      const matchesAparelhoFilter =
        aparelhoFilter.length === 0 || (number.aparelho && aparelhoFilter.includes(number.aparelho))

      // Filtro de API
      const matchesApiFilter =
        apiFilter.length === 0 || (number.api !== null && apiFilter.includes(number.api.toString()))

      return matchesSearch && matchesAparelhoFilter && matchesApiFilter
    })

    // Depois ordenar os dados filtrados
    return [...filtered].sort((a, b) => {
      if (sortColumn === "contato") {
        const contatoA = Number(a.contato) || 0
        const contatoB = Number(b.contato) || 0
        return sortDirection === "asc" ? contatoA - contatoB : contatoB - contatoA
      } else if (sortColumn === "api") {
        const apiA = a.api?.toString() || ""
        const apiB = b.api?.toString() || ""

        // Tentar converter para números para ordenação numérica
        const numA = Number(apiA)
        const numB = Number(apiB)

        // Se ambos são números válidos, ordenar numericamente
        if (!isNaN(numA) && !isNaN(numB)) {
          return sortDirection === "asc" ? numA - numB : numB - numA
        }

        // Se apenas um é número, colocar números primeiro
        if (!isNaN(numA)) return sortDirection === "asc" ? -1 : 1
        if (!isNaN(numB)) return sortDirection === "asc" ? 1 : -1

        // Caso contrário, ordenar alfabeticamente
        return sortDirection === "asc" ? apiA.localeCompare(apiB) : apiB.localeCompare(apiA)
      } else if (sortColumn === "dias_ativacao") {
        // Ordenação por dias de ativação
        const diasA = a.ativado_em ? (() => {
          try {
            const date = a.ativado_em.includes("T") ? new Date(a.ativado_em) : parseISO(a.ativado_em)
            return isNaN(date.getTime()) ? 0 : differenceInDays(today, date)
          } catch {
            return 0
          }
        })() : 0
        
        const diasB = b.ativado_em ? (() => {
          try {
            const date = b.ativado_em.includes("T") ? new Date(b.ativado_em) : parseISO(b.ativado_em)
            return isNaN(date.getTime()) ? 0 : differenceInDays(today, date)
          } catch {
            return 0
          }
        })() : 0
        
        return sortDirection === "asc" ? diasA - diasB : diasB - diasA
      } else if (sortColumn === "dias_desconexao") {
        // Ordenação por dias de desconexão
        const diasA = a.desconectado_em ? (() => {
          try {
            const date = a.desconectado_em.includes("T") ? new Date(a.desconectado_em) : parseISO(a.desconectado_em)
            return isNaN(date.getTime()) ? 0 : differenceInDays(today, date)
          } catch {
            return 0
          }
        })() : 0
        
        const diasB = b.desconectado_em ? (() => {
          try {
            const date = b.desconectado_em.includes("T") ? new Date(b.desconectado_em) : parseISO(b.desconectado_em)
            return isNaN(date.getTime()) ? 0 : differenceInDays(today, date)
          } catch {
            return 0
          }
        })() : 0
        
        return sortDirection === "asc" ? diasA - diasB : diasB - diasA
      }
      return 0
    })
  }, [
    data,
    searchTerm,
    aparelhoFilter,
    apiFilter,
    showRecuperacaoOnly,
    showAquecendoOnly,
    showSemAlocacaoOnly,
    showAtivosOnly,
    sortColumn,
    sortDirection,
  ])

  // Obter valores únicos para os filtros
  const uniqueAparelhos = useMemo(() => {
    const aparelhos = new Set<string>()
    data.forEach((number) => {
      if (number.aparelho) {
        aparelhos.add(number.aparelho)
      }
    })
    return Array.from(aparelhos).sort()
  }, [data])

  const uniqueApis = useMemo(() => {
    const apis = new Set<string>()
    data.forEach((number) => {
      if (number.api !== null && number.api !== undefined) {
        // Converter para string e verificar se não é NaN
        const apiStr = number.api.toString()
        if (apiStr !== "NaN" && apiStr.toLowerCase() !== "nan") {
          apis.add(apiStr)
        }
      }
    })

    // Converter para array e ordenar
    return Array.from(apis).sort((a, b) => {
      // Tentar converter para números para ordenação numérica
      const numA = Number(a)
      const numB = Number(b)

      // Se ambos são números válidos, ordenar numericamente
      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB
      }

      // Se apenas um é número, colocar números primeiro
      if (!isNaN(numA)) return -1
      if (!isNaN(numB)) return 1

      // Caso contrário, ordenar alfabeticamente
      return a.localeCompare(b)
    })
  }, [data])

  // Adicionar função para limpar filtros
  const clearFilters = () => {
    setSearchTerm("")
    setAparelhoFilter([])
    setApiFilter([])
    setShowRecuperacaoOnly(false)
    setShowAquecendoOnly(false)
    setShowSemAlocacaoOnly(false)
    setShowAtivosOnly(false) // Limpar também o filtro de números ativos
  }

  // Refresh data from Supabase - Ordenado por contato (crescente)
  const refreshData = async () => {
    setIsLoading(true)

    try {
      const { data: whatsappNumbers, error } = await supabase
        .from("celulares_whatsapp")
        .select("*")
        .order("contato", { ascending: true }) // Ordenar por contato em ordem crescente

      if (error) {
        console.error("Error fetching WhatsApp numbers:", error)
        toast({
          title: "Erro ao atualizar dados",
          description: error.message,
          variant: "destructive",
        })
      } else {
        console.log("Data from Supabase:", whatsappNumbers)
        setData(whatsappNumbers || [])

        // Apenas mostrar toast se não for a carga inicial
        if (isLoading) {
          toast({
            title: "Dados atualizados",
            description: "Os dados foram atualizados com sucesso.",
          })
        }
      }
    } catch (error) {
      console.error("Exception during data refresh:", error)
      toast({
        title: "Erro ao atualizar dados",
        description: "Ocorreu um erro inesperado durante a atualização dos dados.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Função para marcar um número como recuperado
  const handleRecovery = async (id: string) => {
    setIsLoading(true)

    try {
      // Buscar o registro atual para obter o valor atual de quedas
      const { data: currentRecord, error: fetchError } = await supabase
        .from("celulares_whatsapp")
        .select("quedas")
        .eq("id", id)
        .single()

      if (fetchError) {
        console.error("Erro ao buscar registro atual:", fetchError)
        toast({
          title: "Erro ao marcar recuperação",
          description: fetchError.message,
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      // Calcular o novo valor de quedas (incrementar em 1)
      const currentQuedas = currentRecord?.quedas || 0
      const newQuedas = currentQuedas + 1

      // Atualizar o campo recuperacao com a data atual e incrementar quedas
      const { error } = await supabase
        .from("celulares_whatsapp")
        .update({
          recuperacao: formattedToday,
          quedas: newQuedas,
        })
        .eq("id", id)

      if (error) {
        console.error("Erro ao marcar número como recuperado:", error)
        toast({
          title: "Erro ao marcar recuperação",
          description: error.message,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Número recuperado",
          description: "O número foi marcado como recuperado com sucesso.",
        })
        refreshData()
      }
    } catch (error) {
      console.error("Exceção durante recuperação:", error)
      toast({
        title: "Erro ao marcar recuperação",
        description: "Ocorreu um erro inesperado durante a operação.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Função para limpar a recuperação de um número
  const handleClearRecovery = async (id: string) => {
    setIsLoading(true)

    try {
      // Atualizar o campo recuperacao para null
      const { error } = await supabase.from("celulares_whatsapp").update({ recuperacao: null }).eq("id", id)

      if (error) {
        console.error("Erro ao limpar recuperação:", error)
        toast({
          title: "Erro ao limpar recuperação",
          description: error.message,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Recuperação removida",
          description: "A marcação de recuperação foi removida com sucesso.",
        })
        refreshData()
      }
    } catch (error) {
      console.error("Exceção durante limpeza de recuperação:", error)
      toast({
        title: "Erro ao limpar recuperação",
        description: "Ocorreu um erro inesperado durante a operação.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Função para alternar o estado de aquecimento
  const toggleAquecendo = async (id: string, currentState: boolean | undefined) => {
    setIsLoading(true)

    try {
      // Atualizar o campo aquecendo para o valor oposto
      const { error } = await supabase.from("celulares_whatsapp").update({ aquecendo: !currentState }).eq("id", id)

      if (error) {
        console.error("Erro ao alternar estado de aquecimento:", error)
        toast({
          title: "Erro ao atualizar aquecimento",
          description: error.message,
          variant: "destructive",
        })
      } else {
        toast({
          title: currentState ? "Aquecimento removido" : "Aquecimento ativado",
          description: currentState
            ? "O número não está mais em aquecimento."
            : "O número foi marcado como em aquecimento.",
        })
        refreshData()
      }
    } catch (error) {
      console.error("Exceção durante alteração de aquecimento:", error)
      toast({
        title: "Erro ao atualizar aquecimento",
        description: "Ocorreu um erro inesperado durante a operação.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Função para adicionar um novo número
  const handleAddNumber = async (values: {
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
  }) => {
    setIsLoading(true)

    try {
      // Garantir que valores numéricos sejam tratados corretamente
      const formattedValues = {
        contato: values.contato ? Number(values.contato) : null,
        numero: values.numero,
        cpf: values.cpf,
        ativado_em: values.ativado_em || null,
        reativado_em: values.reativado_em || null,
        aparelho: values.aparelho,
        api: values.api || null, // Aceitar texto ou número
        desconectado_em: values.desconectado_em || null,
        recuperacao: null, // Sempre null ao adicionar um novo número
        recarregar_em: values.recarregar_em || null,
        quedas: 0, // Inicializar quedas com 0
        aquecendo: false, // Inicializar aquecendo com false
        tipo_whats: values.tipo_whats || "whats", // Corrigido: whats_tipo -> tipo_whats
      }

      console.log("Submitting new values to Supabase:", formattedValues)

      const { error } = await supabase.from("celulares_whatsapp").insert([formattedValues])

      if (error) {
        console.error("Error adding WhatsApp number:", error)
        toast({
          title: "Erro ao adicionar número",
          description: error.message,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Número adicionado",
          description: "O número foi adicionado com sucesso.",
        })
        refreshData()
      }
    } catch (error) {
      console.error("Exception during submission:", error)
      toast({
        title: "Erro ao adicionar número",
        description: "Ocorreu um erro inesperado durante a adição.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Função para editar um número existente
  const handleSaveEdit = async (values: {
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
  }) => {
    if (!selectedNumber) {
      console.error("Nenhum número selecionado para edição")
      return
    }

    setIsLoading(true)
    console.log("Iniciando atualização do registro ID:", selectedNumber.id)

    try {
      // Garantir que valores numéricos sejam tratados corretamente
      const updateData = {
        contato: values.contato ? Number(values.contato) : null,
        numero: values.numero,
        cpf: values.cpf,
        aparelho: values.aparelho,
        api: values.api || null, // Aceitar texto ou número
        ativado_em: values.ativado_em || null,
        reativado_em: values.reativado_em || null,
        desconectado_em: values.desconectado_em || null,
        recarregar_em: values.recarregar_em || null,
        tipo_whats: values.tipo_whats || null, // Corrigido: whats_tipo -> tipo_whats
        // Não incluímos recuperacao e aquecendo para preservar seus valores
      }

      console.log("Dados para atualização:", updateData)

      // Atualizar o registro no Supabase
      const { data, error } = await supabase
        .from("celulares_whatsapp")
        .update(updateData)
        .eq("id", selectedNumber.id)
        .select()

      console.log("Resposta da atualização:", { data, error })

      if (error) {
        console.error("Erro ao atualizar registro:", error)
        toast({
          title: "Erro ao atualizar número",
          description: error.message,
          variant: "destructive",
        })
      } else {
        console.log("Atualização bem-sucedida")
        toast({
          title: "Número atualizado",
          description: "O número foi atualizado com sucesso.",
        })
        setIsEditDialogOpen(false)
        refreshData()
      }
    } catch (error) {
      console.error("Exceção durante atualização:", error)
      toast({
        title: "Erro ao atualizar número",
        description: "Ocorreu um erro inesperado durante a atualização.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Delete WhatsApp number
  const deleteNumber = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este número?")) return

    setIsLoading(true)

    const { error } = await supabase.from("celulares_whatsapp").delete().eq("id", id)

    if (error) {
      console.error("Error deleting WhatsApp number:", error)
      toast({
        title: "Erro ao excluir número",
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Número excluído",
        description: "O número foi excluído com sucesso.",
      })
      refreshData()
    }

    setIsLoading(false)
  }

  // Open edit dialog and populate form
  const handleEdit = (number: WhatsAppNumber) => {
    setSelectedNumber(number)
    setIsEditDialogOpen(true)
  }

  // Calcular quantos números estão em recuperação
  const recuperacaoCount = useMemo(() => {
    return data.filter((number) => number.recuperacao !== null).length
  }, [data])

  // Calcular quantos números estão em aquecimento
  const aquecendoCount = useMemo(() => {
    return data.filter((number) => number.aquecendo === true).length
  }, [data])

  // Calcular quantos números estão sem alocação (não estão aquecendo e não possuem API)
  const semAlocacaoCount = useMemo(() => {
    return data.filter((number) => {
      // Não está em aquecimento
      const naoEstaAquecendo = number.aquecendo !== true

      // Não possui API atribuída (null, undefined, ou string vazia)
      const semApi = number.api === null || number.api === undefined || number.api.toString().trim() === ""

      return naoEstaAquecendo && semApi
    }).length
  }, [data])

  // Calcular quantos números são ativos (API numérica, não EVO nem FIN)
  const ativosCount = useMemo(() => {
    return data.filter(isNumeroAtivo).length
  }, [data])

  // Calcular estatísticas para o dashboard
  const dashboardStats = useMemo(() => {
    // Números ativos: têm API (não vazia), não é EVO, e não está em recuperação
    const numerosAtivos = data.filter((number) => {
      // Tem API (não é nula ou vazia)
      const temApi = number.api !== null && number.api !== undefined && number.api.toString().trim() !== ""

      // Não é EVO nem FIN
      const naoEhEVOouFIN =
        !String(number.api || "")
          .toUpperCase()
          .includes("EVO") &&
        !String(number.api || "")
          .toUpperCase()
          .includes("FIN")

      // Não está em recuperação
      const naoEstaEmRecuperacao = number.recuperacao === null

      return temApi && naoEhEVOouFIN && naoEstaEmRecuperacao
    }).length

    return {
      numerosAtivos,
      emRecuperacao: recuperacaoCount,
      emAquecimento: aquecendoCount,
      semAlocacao: semAlocacaoCount,
      total: data.length,
    }
  }, [data, recuperacaoCount, aquecendoCount, semAlocacaoCount])

  // Função para copiar o número formatado para o clipboard
  const copyNumberToClipboard = (number: string | null) => {
    if (!number) return

    // Remover DDD (assumindo que são os 2 primeiros dígitos), espaços e traços
    const formattedNumber = number.replace(/^\d{2}\s+/, "").replace(/[\s-]/g, "")

    // Copiar para o clipboard
    navigator.clipboard
      .writeText(formattedNumber)
      .then(() => {
        toast({
          title: "Número copiado",
          description: `${formattedNumber} copiado para a área de transferência.`,
          duration: 2000,
        })
      })
      .catch((error) => {
        console.error("Erro ao copiar número:", error)
        toast({
          title: "Erro ao copiar",
          description: "Não foi possível copiar o número.",
          variant: "destructive",
        })
      })
  }

  // Substituir o return do componente com o novo código que inclui o campo de busca e filtros
  return (
    <div className="space-y-6">
      {/* Cards de estatísticas do Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Números Ativos</p>
              <h3 className="text-3xl font-bold mt-1">{dashboardStats.numerosAtivos}</h3>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {Math.round((dashboardStats.numerosAtivos / dashboardStats.total) * 100) || 0}% do total
          </p>
        </div>

        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Em Recuperação</p>
              <h3 className="text-3xl font-bold mt-1">{dashboardStats.emRecuperacao}</h3>
            </div>
            <div className="bg-amber-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {Math.round((dashboardStats.emRecuperacao / dashboardStats.total) * 100) || 0}% do total
          </p>
        </div>

        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Em Aquecimento</p>
              <h3 className="text-3xl font-bold mt-1">{dashboardStats.emAquecimento}</h3>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <Flame className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {Math.round((dashboardStats.emAquecimento / dashboardStats.total) * 100) || 0}% do total
          </p>
        </div>

        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Sem Alocação</p>
              <h3 className="text-3xl font-bold mt-1">{dashboardStats.semAlocacao}</h3>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <HelpCircle className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {Math.round((dashboardStats.semAlocacao / dashboardStats.total) * 100) || 0}% do total
          </p>
        </div>

        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total de Números</p>
              <h3 className="text-3xl font-bold mt-1">{dashboardStats.total}</h3>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <PhoneCall className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Total de números cadastrados</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-1 gap-2 items-center">
          <Button variant="outline" onClick={refreshData} disabled={isLoading} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Atualizar
          </Button>

          {/* Botão para abrir o modal de gráficos */}
          <ChartsModal data={data} />

          {/* Barra de busca */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por número, aparelho ou API..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1 h-7 w-7 p-0"
                onClick={() => setSearchTerm("")}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Limpar busca</span>
              </Button>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          {/* Modal de adição de número */}
          <AddNumberModal onAddNumber={handleAddNumber} isLoading={isLoading} />

          {/* Botões removidos */}
          {/* <UserRegisterModal /> */}
          {/* <LogoutButton /> */}
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2 items-center">
        {/* Novo botão de filtro para números ativos */}
        <Button
          variant={showAtivosOnly ? "default" : "outline"}
          size="sm"
          className={`flex items-center gap-2 ${showAtivosOnly ? "bg-green-500 hover:bg-green-600" : ""}`}
          onClick={() => setShowAtivosOnly(!showAtivosOnly)}
        >
          <Activity className="h-4 w-4" /> Números Ativos
          {ativosCount > 0 && (
            <Badge variant={showAtivosOnly ? "outline" : "secondary"} className="ml-1 rounded-sm px-1">
              {ativosCount}
            </Badge>
          )}
        </Button>

        {/* Botão de filtro para números em recuperação */}
        <Button
          variant={showRecuperacaoOnly ? "default" : "outline"}
          size="sm"
          className={`flex items-center gap-2 ${showRecuperacaoOnly ? "bg-amber-500 hover:bg-amber-600" : ""}`}
          onClick={() => setShowRecuperacaoOnly(!showRecuperacaoOnly)}
        >
          <AlertTriangle className="h-4 w-4" /> Em Recuperação
          {recuperacaoCount > 0 && (
            <Badge variant={showRecuperacaoOnly ? "outline" : "secondary"} className="ml-1 rounded-sm px-1">
              {recuperacaoCount}
            </Badge>
          )}
        </Button>

        {/* Botão de filtro para números em aquecimento */}
        <Button
          variant={showAquecendoOnly ? "default" : "outline"}
          size="sm"
          className={`flex items-center gap-2 ${showAquecendoOnly ? "bg-orange-500 hover:bg-orange-600" : ""}`}
          onClick={() => setShowAquecendoOnly(!showAquecendoOnly)}
        >
          <Flame className="h-4 w-4" /> Em Aquecimento
          {aquecendoCount > 0 && (
            <Badge variant={showAquecendoOnly ? "outline" : "secondary"} className="ml-1 rounded-sm px-1">
              {aquecendoCount}
            </Badge>
          )}
        </Button>

        {/* Botão de filtro para números sem alocação */}
        <Button
          variant={showSemAlocacaoOnly ? "default" : "outline"}
          size="sm"
          className={`flex items-center gap-2 ${showSemAlocacaoOnly ? "bg-purple-500 hover:bg-purple-600" : ""}`}
          onClick={() => setShowSemAlocacaoOnly(!showSemAlocacaoOnly)}
        >
          <HelpCircle className="h-4 w-4" /> Sem Alocação
          {semAlocacaoCount > 0 && (
            <Badge variant={showSemAlocacaoOnly ? "outline" : "secondary"} className="ml-1 rounded-sm px-1">
              {semAlocacaoCount}
            </Badge>
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Aparelho
              {aparelhoFilter.length > 0 && (
                <Badge variant="secondary" className="ml-1 rounded-sm px-1">
                  {aparelhoFilter.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px] max-h-[300px] overflow-y-auto">
            {uniqueAparelhos.map((aparelho) => (
              <DropdownMenuCheckboxItem
                key={aparelho}
                checked={aparelhoFilter.includes(aparelho)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setAparelhoFilter([...aparelhoFilter, aparelho])
                  } else {
                    setAparelhoFilter(aparelhoFilter.filter((item) => item !== aparelho))
                  }
                }}
              >
                {aparelho}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              API
              {apiFilter.length > 0 && (
                <Badge variant="secondary" className="ml-1 rounded-sm px-1">
                  {apiFilter.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px] max-h-[300px] overflow-y-auto">
            {uniqueApis.map((api) => (
              <DropdownMenuCheckboxItem
                key={api}
                checked={apiFilter.includes(api)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setApiFilter([...apiFilter, api])
                  } else {
                    setApiFilter(apiFilter.filter((item) => item !== api))
                  }
                }}
              >
                {api}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {(searchTerm ||
          aparelhoFilter.length > 0 ||
          apiFilter.length > 0 ||
          showRecuperacaoOnly ||
          showAquecendoOnly ||
          showSemAlocacaoOnly ||
          showAtivosOnly) && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="flex items-center gap-2">
            <X className="h-4 w-4" />
            Limpar filtros
          </Button>
        )}
      </div>

      <div className="border rounded-md bg-white shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-purple-100">
                <TableHead className="font-bold cursor-pointer" onClick={() => handleSort("contato")}>
                  <div className="flex items-center gap-1">
                    Chip
                    {sortColumn === "contato" ? (
                      sortDirection === "asc" ? (
                        <ArrowUp className="h-4 w-4" />
                      ) : (
                        <ArrowDown className="h-4 w-4" />
                      )
                    ) : (
                      <ArrowUpDown className="h-4 w-4 opacity-50" />
                    )}
                  </div>
                </TableHead>
                <TableHead className="font-bold">Número</TableHead>
                <TableHead className="font-bold">CPF</TableHead>
                <TableHead className="font-bold">Ativação</TableHead>
                <TableHead className="font-bold">Aparelho</TableHead>
                <TableHead className="font-bold cursor-pointer" onClick={() => handleSort("dias_ativacao")}>
                  <div className="flex items-center gap-1">
                    Dias
                    {sortColumn === "dias_ativacao" ? (
                      sortDirection === "asc" ? (
                        <ArrowUp className="h-4 w-4" />
                      ) : (
                        <ArrowDown className="h-4 w-4" />
                      )
                    ) : (
                      <ArrowUpDown className="h-4 w-4 opacity-50" />
                    )}
                  </div>
                </TableHead>
                <TableHead className="font-bold cursor-pointer" onClick={() => handleSort("api")}>
                  <div className="flex items-center gap-1">
                    API
                    {sortColumn === "api" ? (
                      sortDirection === "asc" ? (
                        <ArrowUp className="h-4 w-4" />
                      ) : (
                        <ArrowDown className="h-4 w-4" />
                      )
                    ) : (
                      <ArrowUpDown className="h-4 w-4 opacity-50" />
                    )}
                  </div>
                </TableHead>
                <TableHead className="font-bold">Desconexão</TableHead>
                <TableHead className="font-bold cursor-pointer" onClick={() => handleSort("dias_desconexao")}>
                  <div className="flex items-center gap-1">
                    Dias
                    {sortColumn === "dias_desconexao" ? (
                      sortDirection === "asc" ? (
                        <ArrowUp className="h-4 w-4" />
                      ) : (
                        <ArrowDown className="h-4 w-4" />
                      )
                    ) : (
                      <ArrowUpDown className="h-4 w-4 opacity-50" />
                    )}
                  </div>
                </TableHead>
                <TableHead className="font-bold">Recarga</TableHead>
                <TableHead className="font-bold">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-sm">
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-center py-4">
                    {data.length === 0
                      ? "Nenhum número encontrado"
                      : "Nenhum resultado encontrado para os filtros aplicados"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((number) => (
                  <TableRow
                    key={number.id}
                    className={number.recuperacao ? "bg-red-50" : number.aquecendo ? "bg-yellow-50" : "bg-white"}
                  >
                    <TableCell>{number.contato}</TableCell>
                    {/* Substituir o trecho atual na TableCell do número por este: */}
                    <TableCell className="whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {number.numero}
                        {number.tipo_whats && (
                          <img
                            src={getWhatsAppTypeIcon(number.tipo_whats) || "/placeholder.svg"}
                            alt={`WhatsApp ${number.tipo_whats || "Padrão"}`}
                            className="h-3.5 w-3.5 rounded-full"
                            title={`WhatsApp ${
                              number.tipo_whats === "wduall"
                                ? "Dual"
                                : number.tipo_whats === "wbusiness"
                                  ? "Business"
                                  : "Padrão"
                            }`}
                          />
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            copyNumberToClipboard(number.numero)
                          }}
                          className="p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          title="Copiar número (sem DDD)"
                        >
                          <Copy className="h-3.5 w-3.5 text-gray-500 hover:text-purple-600" />
                        </button>
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">{number.cpf}</TableCell>
                    <TableCell>{formatDate(number.ativado_em)}</TableCell>
                    <TableCell>{number.aparelho}</TableCell>
                    <TableCell>{calculateDays(number.ativado_em)}</TableCell>
                    <TableCell>{number.api}</TableCell>
                    <TableCell>{formatDate(number.desconectado_em)}</TableCell>
                    <TableCell>{calculateDays(number.desconectado_em)}</TableCell>
                    <TableCell>{formatDate(number.recarregar_em)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2 items-center">
                        <div className="flex items-center mr-2" title="Em aquecimento">
                          <Checkbox
                            checked={number.aquecendo || false}
                            onCheckedChange={() => toggleAquecendo(number.id, number.aquecendo)}
                            aria-label="Marcar como em aquecimento"
                          />
                        </div>
                        <Button variant="outline" size="icon" onClick={() => handleEdit(number)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => deleteNumber(number.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleRecovery(number.id)}
                          className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                          title="Marcar como recuperado"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                        {number.recuperacao && (
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleClearRecovery(number.id)}
                            className="text-green-500 hover:text-green-700 hover:bg-green-50"
                            title="Remover marcação de recuperado"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Modal de edição de número */}
      <EditNumberModal
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        selectedNumber={selectedNumber}
        onSaveEdit={handleSaveEdit}
        isLoading={isLoading}
      />

      <Toaster />
    </div>
  )
}
