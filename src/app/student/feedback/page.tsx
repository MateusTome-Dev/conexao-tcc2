"use client";

// Importações de componentes
import { ProfileCard } from "@/components/ui/alunos/profile-card";
import Sidebar from "@/components/layout/sidebar";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/alunos/button";
import { Moon, Sun } from "lucide-react";
import EngagementChart from "@/components/ui/alunos/chartFeedback";
import { useTheme } from "@/components/ThemeProvider";
import CardPerson from "@/components/ui/alunos/cardFeedbackStudent";
import { jwtDecode } from "jwt-decode";

// Interface para dados do professor
interface Professor {
  id: number;
  nomeDocente: string;
  dataNascimentoDocente: string;
  emailDocente: string;
  telefoneDocente: string;
}

// Interface para perfil do aluno
interface StudentProfile {
  imageUrl: string;
  nome: string;
  emailAluno: string;
  matriculaAluno: string;
}

export default function Home() {
  // Estados do componente
  const [currentPage, setCurrentPage] = useState(1);
  const [teachers, setTeachers] = useState<Professor[]>([]);
  const [studentData, setStudentData] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { darkMode, toggleTheme } = useTheme();
  const studentsPerPage = 6;

  // Busca os dados da api
  const fetchStudentData = async () => {
    try {
      // Obtém o token JWT do localStorage
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token não encontrado");

      // Decodifica o token para obter o ID do usuário
      const decoded: any = jwtDecode(token);
      const id = decoded?.sub;
      if (!id) throw new Error("ID do usuário não encontrado no token");

      // Faz a requisição para a API
      const response = await fetch(`https://onacademy-e2h7csembwhrf2bu.brazilsouth-01.azurewebsites.net/api/student/${id}`);
      if (!response.ok)
        throw new Error("Não foi possível carregar os dados do estudante");

      // Atualiza os dados do aluno no estado
      const data = await response.json();
      setStudentData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Efeito para carregar a lista de professores quando o componente é montado
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch("https://onacademy-e2h7csembwhrf2bu.brazilsouth-01.azurewebsites.net/api/teacher");
        const data: Professor[] = await response.json();
        setTeachers(data);
      } catch (error) {
        console.error("Erro ao buscar professores:", error);
      }
    };

    fetchTeachers();
  }, []);

  // Efeito para carregar os dados do aluno quando o componente é montado
  useEffect(() => {
    fetchStudentData();
  }, []);

  // Efeito para aplicar o tema selecionado
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Lógica de paginação
  const totalPages = Math.ceil(teachers.length / studentsPerPage);
  const displayedTeachers = teachers.slice(
    (currentPage - 1) * studentsPerPage,
    currentPage * studentsPerPage
  );

  // Renderização do componente
  return (
    <div className="min-h-screen bg-[#F0F7FF] dark:bg-[#141414] flex flex-row border dark:border-black">
      <Sidebar />
      <div className="container mx-auto p-4">
        <div className="w-full flex flex-row justify-end">
          <Button onClick={toggleTheme}>
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
        </div>
        <div className="flex justify-end pb-4"></div>
        <div className="space-y-6 bg-[#FFFFFF] dark:bg-black dark:text-[#ffffffd8] p-8 rounded-2xl max-h-[800px] overflow-y-auto pr scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-200 dark:scrollbar-track-black">
          <ProfileCard
            studentData={studentData}
            loading={loading}
            error={error}
          />
          <EngagementChart />
          <h1 className="text-[#0077FF] font-bold text-[20px] lg:text-[24px] pt-[20px]">
            A importância do seu feedback
          </h1>
          <p className="text-[16px] lg:text-[20px]">
            O feedback dos alunos é essencial para aprimorar a qualidade do
            ensino. Aqui, você pode compartilhar sua experiência em sala de
            aula, destacando o que está funcionando bem e o que pode ser
            melhorado.
          </p>
          <p className="text-[16px] lg:text-[20px]">
            Seus comentários ajudam os professores a ajustar métodos de ensino,
            tornando as aulas mais dinâmicas e eficazes. Seja claro e respeitoso
            em suas respostas, pois sua opinião contribui para um ambiente de
            aprendizado cada vez melhor para todos!
          </p>
          <div className="pt-10">
            <CardPerson persons={displayedTeachers} />
            {totalPages > 1 && (
              <div className="flex justify-center mt-6">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-4 py-2 mx-1 rounded-md transition ${
                      currentPage === i + 1
                        ? "bg-blue-500 text-white dark:text-black"
                        : "bg-[#F0F7FF] text-blue-500 hover:bg-gray-300 dark:bg-[#141414]"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
