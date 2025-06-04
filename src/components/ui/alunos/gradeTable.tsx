"use client"

import { useEffect, useState } from "react"
import DownloadButton from "./downloadButton"
import { jwtDecode } from "jwt-decode"

// Tipos para as notas e as matérias
interface Nota {
  idNota: number
  nota: number
  bimestre: number
  status: string
  nomeDisciplina: string
}

interface Materia {
  nomeDisciplina: string
  notas: (number | null)[] // Array de notas para cada bimestre
}

const Table = () => {
  // Estado para armazenar as disciplinas e notas
  const [disciplinas, setDisciplinas] = useState<Materia[]>([])
  const [carregando, setCarregando] = useState<boolean>(true)
  const [erro, setErro] = useState<string | null>(null)

  // Função para organizar as notas por disciplina
  const organizarNotasPorDisciplina = (notas: Nota[]): Materia[] => {
    const disciplinasMap: { [key: string]: (number | null)[] } = {}

    // Organiza as notas por disciplina e bimestre
    notas.forEach((nota) => {
      const { nomeDisciplina, bimestre, nota: valorNota } = nota

      // Inicializa a disciplina se não existir no mapa
      if (!disciplinasMap[nomeDisciplina]) {
        disciplinasMap[nomeDisciplina] = [null, null, null, null] // Inicializa os bimestres como nulos
      }

      // Corrige a posição do bimestre (0 para o 1° bimestre, 1 para o 2°, etc.)
      const indiceBimestre = bimestre - 1

      // Adiciona a nota no bimestre correspondente (0 a 3)
      disciplinasMap[nomeDisciplina][indiceBimestre] = valorNota
    })

    // Converte o mapa de disciplinas para um array de Materia
    return Object.keys(disciplinasMap).map((nomeDisciplina) => ({
      nomeDisciplina,
      notas: disciplinasMap[nomeDisciplina],
    }))
  }

  // Faz a requisição para buscar as notas quando o componente for montado
  useEffect(() => {
    const buscarNotas = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) throw new Error("Token não encontrado")

        // 2. Decodifica o token para obter o ID do usuário
        const decoded: any = jwtDecode(token)
        const userId = decoded?.sub // Supondo que o token contenha { id: 123 }
        if (!userId) throw new Error("ID do usuário não encontrado no token")

        // Requisição para a API
        const resposta = await fetch(`https://onaback-fke4h4d2dkbfcsav.eastus2-01.azurewebsites.net/api/student/${userId}`)

        if (!resposta.ok) {
          throw new Error("Falha ao buscar os dados")
        }

        const dados = await resposta.json()

        // Organiza as notas por disciplina
        const disciplinasOrganizadas = organizarNotasPorDisciplina(dados.notas)

        // Atualiza o estado com as disciplinas e notas organizadas
        setDisciplinas(disciplinasOrganizadas)
      } catch (erro) {
        setErro((erro as Error).message)
      } finally {
        setCarregando(false)
      }
    }

    buscarNotas()
  }, []) // O array vazio faz a requisição ser executada uma única vez ao montar o componente

  // Exibe a mensagem de carregamento ou erro, se houver
  if (carregando) {
    return <div className="flex justify-center items-center h-64">Carregando...</div>
  }

  if (erro) {
    return <div className="bg-red-100 p-4 rounded text-red-700">Erro: {erro}</div>
  }

  return (
    <div className="w-full p-4 bg-white dark:bg-black rounded-[20px]">
      {/* Tabela para desktop */}
      <div className="hidden md:flex overflow-x-auto md:justify-center">
        <table className="min-w-[50%] border-separate border-spacing-4">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="p-3 text-left">Matéria</th>
              <th className="p-3 text-center">1° Bim.</th>
              <th className="p-3 text-center">2° Bim.</th>
              <th className="p-3 text-center">3° Bim.</th>
              <th className="p-3 text-center">4° Bim.</th>
            </tr>
          </thead>
          <tbody>
            {disciplinas.map((materia, index) => (
              <tr key={index} className="odd:bg-gray-100 dark:odd:bg-gray-800 even:bg-gray-200 dark:even:bg-gray-700">
                <td className="p-3 bg-blue-600 text-white font-semibold">{materia.nomeDisciplina}</td>
                {materia.notas.map((nota, i) => (
                  <td
                    key={i}
                    className="p-3 text-center border border-transparent text-black dark:text-white bg-[#EAF4FF] dark:bg-[#141414]"
                  >
                    {nota !== null ? nota : "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Lista para mobile */}
      <div className="md:hidden space-y-4">
        {disciplinas.map((materia, index) => (
          <div key={index} className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
            <div className="bg-blue-600 text-white p-3 font-semibold">
              {materia.nomeDisciplina}
            </div>
            <div className="grid grid-cols-2 gap-2 p-2">
              {materia.notas.map((nota, i) => (
                <div 
                  key={i}
                  className="bg-[#EAF4FF] dark:bg-[#141414] p-3 rounded text-center"
                >
                  <div className="text-sm text-gray-500 dark:text-gray-400">{i + 1}° Bim.</div>
                  <div className="font-medium text-black dark:text-white">
                    {nota !== null ? nota : "-"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-6">
        <DownloadButton apiBaseUrl="https://onaback-fke4h4d2dkbfcsav.eastus2-01.azurewebsites.net/api/boletim" />
      </div>
    </div>
  )
}

export default Table