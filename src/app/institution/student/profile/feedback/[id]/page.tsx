"use client";
import { useState, useEffect } from "react";
import { OccurrencesTable } from "@/components/ui/alunos/occurrences-table";
import Sidebar from "@/components/layout/sidebarInstitution";
import { Button } from "@/components/ui/alunos/button";
import { Moon, Sun, ArrowLeft } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { useParams, useRouter } from "next/navigation";
import TablePerformance from "@/components/ui/tablePerfomance";
import { toast } from "@/components/ui/institution/use-toast";
import Image from "next/image";

interface StudentData {
  id: number;
  name: string;
  registration: string;
  class: string;
  imageUrl?: string;
}

type Bimester = "1º Bimestre" | "2º Bimestre" | "3º Bimestre" | "4º Bimestre";

const performanceData: Record<Bimester, Array<{ name: string; value: number }>> = {
  "1º Bimestre": [
    { name: "Engajamento", value: 80 },
    { name: "Disposição", value: 60 },
    { name: "Entrega", value: 90 },
    { name: "Atenção", value: 70 },
    { name: "Comportamento", value: 40 },
  ],
  "2º Bimestre": [
    { name: "Engajamento", value: 85 },
    { name: "Disposição", value: 65 },
    { name: "Entrega", value: 95 },
    { name: "Atenção", value: 75 },
    { name: "Comportamento", value: 50 },
  ],
  "3º Bimestre": [
    { name: "Engajamento", value: 70 },
    { name: "Disposição", value: 55 },
    { name: "Entrega", value: 80 },
    { name: "Atenção", value: 65 },
    { name: "Comportamento", value: 45 },
  ],
  "4º Bimestre": [
    { name: "Engajamento", value: 90 },
    { name: "Disposição", value: 75 },
    { name: "Entrega", value: 85 },
    { name: "Atenção", value: 80 },
    { name: "Comportamento", value: 60 },
  ],
};

export default function StudentFeedbackPage() {
  const { darkMode, toggleTheme } = useTheme();
  const params = useParams();
  const router = useRouter();
  
  const studentId = params.id as string;
  const [selectedBimester, setSelectedBimester] = useState<Bimester>("1º Bimestre");
  const [student, setStudent] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token de autenticação não encontrado");

        const response = await fetch(
          `https://onaback-fke4h4d2dkbfcsav.eastus2-01.azurewebsites.net/api/student/${studentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Erro ao buscar dados do aluno");

        const data = await response.json();
        
        setStudent({
          id: data.id,
          name: data.nome || data.nomeAluno || "Aluno",
          registration: data.matricula || data.matriculaAluno || "N/A",
          class: data.turma?.nome || "N/A",
          imageUrl: data.imageUrl,
        });
      } catch (err: any) {
        setError(err.message);
        toast({
          title: "Erro",
          description: "Falha ao carregar dados do aluno",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (studentId) {
      fetchStudentData();
    }
  }, [studentId]);

  const handleBimesterChange = (value: string) => {
    setSelectedBimester(value as Bimester);
  };

  return (
    <div className="min-h-screen bg-[#F0F7FF] dark:bg-[#141414] flex flex-row">
      {/* Sidebar da instituição */}
      <Sidebar />
      
      {/* Conteúdo principal */}
      <div className="container mx-auto p-4">
        {/* Botão para alternar entre tema claro/escuro */}
        <div className="grid grid-cols-3 items-center mb-6 w-full">
          {/* Botão Voltar (esquerda) */}
          <div className="col-start-1">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-blue-500 font-semibold transition-colors"
            >
              <ArrowLeft size={20} />
              Voltar
            </button>
          </div>

          {/* Espaço vazio do meio */}
          <div className="col-start-2"></div>

          {/* Botão Tema (direita) */}
          <div className="col-start-3 flex justify-end">
            <Button onClick={toggleTheme}>
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <p>Carregando dados do aluno...</p>
          </div>
        ) : error ? (
          <div className="text-red-500 dark:text-red-400 py-4">
            {error}
          </div>
        ) : student && (
          <section className="bg-white dark:bg-black rounded-xl p-6 mb-6 shadow">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
                {student.imageUrl ? (
                  <Image
                    src={student.imageUrl}
                    alt={`Foto de ${student.name}`}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    <span>Sem foto</span>
                  </div>
                )}
              </div>

              <div className="flex-1 text-center md:text-left">
                <h1 className="text-2xl font-bold text-blue-500">
                  {student.name}
                </h1>
                <div className="grid grid-cols-2 gap-4 mt-4">
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Área de conteúdo com tabela de ocorrências e desempenho */}
        <div className="space-y-6 bg-[#FFFFFF] dark:bg-black dark:text-[#ffffffd8] p-8 rounded-2xl h-[800px] overflow-y-auto pr scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-200 mt-6">
          {/* Tabela de ocorrências */}
          <OccurrencesTable />
          
          {/* Container para a tabela de desempenho */}
          <div className="w-full flex justify-center items-center">
            <div className="bg-white dark:bg-black p-6 w-[800px]">
              {/* Componente de tabela de desempenho */}
              <TablePerformance />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}