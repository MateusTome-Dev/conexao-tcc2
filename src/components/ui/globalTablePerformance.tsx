"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { useParams } from "next/navigation"

interface FeedbackData {
  mediaResposta1: number
  mediaResposta2: number
  mediaResposta3: number
  mediaResposta4: number
  mediaResposta5: number
  totalFeedbacks: number
}

interface ChartData {
  name: string
  value: number
  fullName: string
}

const EngagementChartGlobal: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const classId = id ? Number.parseInt(id, 10) : null
  const [data, setData] = useState<ChartData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalFeedbacks, setTotalFeedbacks] = useState<number>(0)

  // Função para determinar o nome baseado no tamanho da tela
  const getNameByScreenSize = (screenWidth: number) => {
    if (screenWidth < 400) return "tiny"
    if (screenWidth < 768) return "short"
    return "full"
  }

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("Token não encontrado")

      if (!classId) throw new Error("ID da turma não encontrado na URL")

      const resposta = await fetch(`https://onacademy-e2h7csembwhrf2bu.brazilsouth-01.azurewebsites.net/api/class/feedback/${classId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })


      const dados: FeedbackData = await resposta.json()

      if (!dados) {
        setData([])
        return
      }

      const values = [
        dados.mediaResposta1,
        dados.mediaResposta2,
        dados.mediaResposta3,
        dados.mediaResposta4,
        dados.mediaResposta5,
      ]

      setTotalFeedbacks(dados.totalFeedbacks)

      // Definir nomes completos e abreviados para cada categoria
      const categories = [
        { tiny: "Eng", short: "Eng", full: "Engajamento" },
        { tiny: "Dis", short: "Disp", full: "Disposição" },
        { tiny: "Ent", short: "Ent", full: "Entrega" },
        { tiny: "Atn", short: "Aten", full: "Atenção" },
        { tiny: "Cmp", short: "Comp", full: "Comportamento" },
      ]

      // Obter o tamanho atual da tela
      const screenWidth = window.innerWidth
      const nameType = getNameByScreenSize(screenWidth)

      // Formata os dados para o gráfico
      const formattedData = categories.map((category, index) => ({
        name: category[nameType as keyof typeof category],
        fullName: category.full,
        value: values[index],
      }))

      setData(formattedData)
      setError(null)
    } catch (err: any) {
      setError(err.message)
      setData([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const handleResize = () => {
      // Atualiza os dados quando a tela é redimensionada
      fetchData()
    }

    // Buscar dados iniciais
    fetchData()

    // Adicionar listener para redimensionamento
    window.addEventListener("resize", handleResize)

    // Limpar listener ao desmontar
    return () => window.removeEventListener("resize", handleResize)
  }, [classId])

  // Componente de tooltip personalizado
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload
      return (
        <div className="bg-white dark:bg-gray-800 p-2 border border-gray-200 dark:border-gray-700 rounded shadow-md dark:text-white">
          <p className="font-semibold">{dataPoint.fullName}</p>
          <p>Valor: {payload[0].value.toFixed(2)}</p>
        </div>
      )
    }
    return null
  }

  if (loading) return <div className="text-center py-4">Carregando...</div>

  return (
    
    <div className="w-full max-w-3xl mx-auto p-2 sm:p-4 md:p-6 bg-white shadow-md rounded-lg dark:bg-[#000000] max-h-[430px] mb-9">
      {totalFeedbacks > 0 && (
        <div className="mb-2 sm:mb-4 text-sm sm:text-base text-gray-700 dark:text-white">
          Total de feedbacks: <strong>{totalFeedbacks}</strong>
        </div>
      )}

      {error ? (
        <div className="text-red-500 mb-4 flex items-center text-sm sm:text-base">
          <span className="material-icons mr-2">error</span>
          {error}
        </div>
      ) : (
        <div className="w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 10,
                left: 10,
                bottom: 60,
              }}
              barSize={60}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={0}
                textAnchor="middle"
                height={60}
                tick={{ fontSize: "clamp(8px, 2vw, 12px)" }}
                interval={0}
              />
              <YAxis
                domain={[0, 5]}
                width={40}
                tick={{ fontSize: "clamp(10px, 2vw, 12px)" }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: 10 }} />
              <Bar 
                dataKey="value" 
                name="Média" 
                fill="#3182CE" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
      {data.length === 0 && !loading && (
        <div className="text-center text-gray-500 mt-4 text-sm sm:text-base">
          Nenhum feedback disponível.
        </div>
      )}
    </div>
  )
}

export default EngagementChartGlobal