"use client"; // Indica que este é um componente do lado do cliente

// Importações de bibliotecas e componentes
import { useEffect, useState } from "react";
import { Moon, Sun, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/alunos/button";
import Sidebar from "@/components/layout/sidebarInstitution";
import SearchInput from "@/components/ui/search";
import { useParams } from "next/navigation";
import FloatingButtonClass from "@/components/ui/institution/floatingButtonClass";
import GlobalTablePerformance from "@/components/ui/globalTablePerformance";
import { useTheme } from "@/components/ThemeProvider";
import Link from "next/link";
import { useRouter } from 'next/navigation';

// Interface para definir a estrutura de um estudante
interface Student {
  id: number;
  nomeAluno: string;
  identifierCode: number;
}

// Componente principal da página de estudantes
export default function StudentsPage({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  // Obtém os parâmetros da URL
  const params = useParams();
  const id = params.id as string;

  // Estados do componente
  const [estudante, setEstudante] = useState<Student[]>([]); // Lista de estudantes
  const { darkMode, toggleTheme } = useTheme(); // Tema dark/light
  const [loading, setLoading] = useState(true); // Estado de carregamento
  const [error, setError] = useState<string | null>(null); // Mensagem de erro
  const [search, setSearch] = useState(""); // Termo de busca
  const [currentPage, setCurrentPage] = useState(1); // Página atual
  const studentsPerPage = 10; // Número de estudantes por página
  const router = useRouter();

  // Efeito para buscar os estudantes quando o ID muda
  useEffect(() => {
    if (!id) return;

    const fetchStudents = async () => {
      try {
        // Faz a requisição para a API
        const response = await fetch(
          `https://onacademy-e2h7csembwhrf2bu.brazilsouth-01.azurewebsites.net/api/class/students/${id}`
        );
        if (!response.ok) throw new Error("Erro ao buscar alunos");
        const data = await response.json();
        // Atualiza a lista de estudantes, garantindo que seja um array
        setEstudante(Array.isArray(data.students) ? data.students : []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [id]);

  // Filtra os estudantes com base no termo de busca
  const filteredStudents = estudante.filter((student) =>
    student.nomeAluno.toLowerCase().includes(search.toLowerCase())
  );

  // Calcula o total de páginas e os estudantes a serem exibidos na página atual
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const displayedStudents = filteredStudents.slice(
    (currentPage - 1) * studentsPerPage,
    currentPage * studentsPerPage
  );

  // Reseta a página atual quando o termo de busca muda
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  return (
    <div
      className={`min-h-screen bg-[#F0F7FF] flex flex-row dark:bg-[#141414]`}
    >
      {/* Barra lateral */}
      <Sidebar />

      {/* Conteúdo principal */}
      <div className="w-full flex flex-col items-center mt-4 md:mt-8 px-4">
        {/* Botão para alternar entre tema dark/light */}
        <div className="grid grid-cols-3 items-center mb-6 w-full">
          {/* Botão Voltar (esquerda) */}
          <div className="col-start-1">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 pl-8 pt-8 rounded-lg text-blue-500 font-semibold transition-colors"
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
        {/* Container principal da lista de estudantes */}
        <div className="w-full md:w-[85%] mx-auto p-4 border dark:border-black rounded-lg bg-white rounded-3xl dark:bg-black mb-4">
          {/* Campo de busca */}
          <div className="relative w-full md:max-w-md mx-auto flex justify-center items-center mb-4 md:mb-6">
            <SearchInput
              placeholder="Buscar aluno..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Tabela de estudantes */}
          <div className="overflow-x-auto overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-200">
            {loading ? (
              <p>Carregando...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse border border-[#1A85FF] dark:border-black">
                  <thead>
                    <tr className="bg-[#1A85FF] text-white">
                      <th className="p-2 border border-blue-500 bg-[#F0F7FF] text-blue-500 dark:bg-[#141414]">
                        Nome do aluno
                      </th>
                      <th className="p-2 border border-blue-500 bg-[#F0F7FF] text-blue-500 dark:bg-[#141414]">
                        Nº da Matrícula
                      </th>
                      <th className="p-2 border border-blue-500 bg-[#F0F7FF] text-blue-500 dark:bg-[#141414]">
                        Perfil
                      </th>
                      <th className="p-2 border border-blue-500 bg-[#F0F7FF] text-blue-500 dark:bg-[#141414]">
                        Notas
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Mapeia os estudantes a serem exibidos */}
                    {displayedStudents.map((student) => (
                      <tr key={student.id} className="border border-blue-500">
                        <td className="p-2 border border-blue-500 dark:text-[#8A8A8A]">
                          {student.nomeAluno}
                        </td>
                        <td className="p-2 border border-blue-500 dark:text-[#8A8A8A]">
                          {student.identifierCode}
                        </td>
                        <td className="p-2 border border-blue-500 dark:text-white">
                          <a
                            href={`/institution/student/profile/${student.id}`}
                            className="text-blue-500"
                          >
                            Ver perfil
                          </a>
                        </td>
                        <td className="p-2 border border-blue-500 cursor-pointer">
                          <a
                            href={`/institution/student/notes/${student.id}`}
                            className="text-blue-500"
                          >
                            Ver Notas
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4 md:mt-6 flex-wrap">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 md:px-4 md:py-2 mx-1 my-1 rounded-md transition text-sm md:text-base ${currentPage === i + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-blue-500 hover:bg-gray-300"
                    }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
          <GlobalTablePerformance/>
        </div>
      </div>

      {/* Botão flutuante para adicionar novo estudante */}
      <FloatingButtonClass id={id} />
    </div>
  );
}