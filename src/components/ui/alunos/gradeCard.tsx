"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { jwtDecode } from "jwt-decode"
import { buildStyles, CircularProgressbar } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"
import SmallSelect from "@/components/ui/smallSelect"

interface StudentData {
  name: string
  dataNascimentoAluno: string
  telefoneAluno: string
  emailAluno: string
  matriculaAluno: string
  turma: {
    nomeTurma: string
    idTurma: number
  }
  notas: {
    idNota: number
    nota: number
    bimestre: number
    status: string
    nomeDisciplina: string
  }[]
}

interface Subject {
  name: string
  grade: number
  color: string
  textColor: string
  status: string
}

const GradeCard: React.FC = () => {
  const [studentData, setStudentData] = useState<StudentData>({
    name: "",
    dataNascimentoAluno: "",
    telefoneAluno: "",
    emailAluno: "",
    matriculaAluno: "",
    turma: { nomeTurma: "", idTurma: 0 },
    notas: [],
  })
  const [selectedType, setSelectedType] = useState("1º Bimestre")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [allGrades, setAllGrades] = useState<{ [key: string]: Subject[] }>({})

  useEffect(() => {
    fetchStudentData()
  }, [])

  const fetchStudentData = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("Token não encontrado")

      const decoded: any = jwtDecode(token)
      const userId = decoded?.sub || "1" // Fallback para "1" se não encontrar o ID no token

      const response = await fetch(`https://onacademy-e2h7csembwhrf2bu.brazilsouth-01.azurewebsites.net/api/student/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) throw new Error("Erro ao buscar dados do aluno")

      const data = await response.json()
      setStudentData(data)

      // Organize grades by bimester and subject
      const gradesByBimester: { [key: string]: Subject[] } = {
        "1º Bimestre": [],
        "2º Bimestre": [],
        "3º Bimestre": [],
        "4º Bimestre": [],
      }

      // Group notes by bimester and subject
      const groupedNotes: { [key: string]: { [subject: string]: any[] } } = {
        "1º Bimestre": {},
        "2º Bimestre": {},
        "3º Bimestre": {},
        "4º Bimestre": {},
      }

      // First, group all notes by bimester and subject
      data.notas.forEach((nota: any) => {
        const bimesterKey = `${nota.bimestre}º Bimestre`
        if (!groupedNotes[bimesterKey][nota.nomeDisciplina]) {
          groupedNotes[bimesterKey][nota.nomeDisciplina] = []
        }

        groupedNotes[bimesterKey][nota.nomeDisciplina].push(nota)
      })

      // Then, for each bimester and subject, create entries in gradesByBimester
      Object.keys(groupedNotes).forEach((bimester) => {
        Object.keys(groupedNotes[bimester]).forEach((subject) => {
          const notes = groupedNotes[bimester][subject]

          // Add each note as a separate entry
          notes.forEach((nota) => {
            gradesByBimester[bimester].push({
              name: nota.nomeDisciplina, // Nome da disciplina sem o ID
              grade: Math.round(nota.nota * 10), // Convertendo para percentual (0-100)
              color: getColorByGrade(nota.nota),
              textColor: getTextColorByGrade(nota.nota),
              status: nota.status,
            })
          })
        })
      })

      setAllGrades(gradesByBimester)
    } catch (err: any) {
      setError(err.message || "Erro ao buscar dados do aluno")
    } finally {
      setLoading(false)
    }
  }

  const getColorByGrade = (grade: number): string => {
    if (grade >= 7) return "#3340ff" // Verde para notas boas
    if (grade >= 5) return "#8EC3FF" // Amarelo para notas médias
    return "#EF4444" // Vermelho para notas baixas
  }

  const getTextColorByGrade = (grade: number): string => {
    if (grade >= 7) return "text-blue-500"
    if (grade >= 5) return "text-blue-300"
    return "text-red-500"
  }

  const getBimesterNumber = (bimester: string): number => {
    return Number.parseInt(bimester.charAt(0))
  }

  const currentSubjects = allGrades[selectedType] || []

  const types = ["1º Bimestre", "2º Bimestre", "3º Bimestre", "4º Bimestre"]

  if (loading) {
    return <div className="w-80 p-4 rounded-lg bg-gray-100 dark:bg-gray-800">Carregando...</div>
  }

  if (error) {
    return (
      <div className="w-80 p-4 rounded-lg bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">Erro: {error}</div>
    )
  }

  return (
    <div className="w-80 p-3 rounded-lg bg-white dark:bg-[#141414] shadow-sm">
      <div className="flex flex-row justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Notas</h2>
        <div className="flex flex-row items-center justify-center">
          <SmallSelect
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            placeholder="Selecione o Bimestre"
            items={types}
          />
        </div>
      </div>

      <div className="space-y-6 max-h-[60px] overflow-y-auto pr scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-200 dark:scrollbar-track-black">
        {currentSubjects.length > 0 ? (
          currentSubjects.map((subject, index) => (
            <div key={index} className="flex justify-between items-center">
              <div>
                <h3 className="text-md font-bold capitalize">{subject.name}</h3>
                <span className={`text-xs ${subject.textColor}`}>{subject.status}</span>
              </div>

              <div className="relative w-14 h-14">
                <CircularProgressbar
                  value={subject.grade}
                  styles={buildStyles({
                    textSize: "32px",
                    pathColor: getColorByGrade(subject.grade / 10),
                    trailColor: "#E5E7EB",
                  })}
                />
                <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-[#000] dark:text-[#fff]">
                  {subject.grade}%
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-gray-500">Nenhuma nota encontrada para este bimestre</div>
        )}
      </div>

      {/* Resumo de todas as notas */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-md font-bold mb-3">Resumo de Todas as Notas</h3>
        <div className="grid grid-cols-2 gap-2">
          {types.map((type) => {
            const grades = allGrades[type] || []
            const avgGrade =
              grades.length > 0 ? Math.round(grades.reduce((sum, subj) => sum + subj.grade, 0) / grades.length) : 0

            return (
              <div key={type} className="bg-[#F0F7FF] dark:bg-black p-2 rounded-md">
                <p className="text-xs font-medium">{type}</p>
                <div className="flex items-center justify-between max-md:flex-col">
                  <span className="text-sm">{grades.length} disciplina(s)</span>
                  <span
                    className={`text-sm font-bold ${avgGrade >= 70 ? "text-emerald-500" : avgGrade >= 50 ? "text-[#3340ff]" : "text-red-500"}`}
                  >
                    {avgGrade}%
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default GradeCard