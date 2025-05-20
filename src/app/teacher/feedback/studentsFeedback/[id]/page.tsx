"use client"; // Indica que este é um componente do lado do cliente no Next.js

import { useEffect, useState } from "react";
import { Moon, Sun, ArrowLeft } from "lucide-react"; // Ícones para tema claro/escuro
import { Button } from "@/components/ui/alunos/button"; // Componente de botão personalizado
import Sidebar from "@/components/layout/sidebarTeacher"; // Barra lateral do professor
import SearchInput from "@/components/ui/search"; // Componente de busca
import { useParams } from "next/navigation"; // Hook para acessar parâmetros da URL
import Link from "next/link"; // Componente para navegação
import { useTheme } from "@/components/ThemeProvider"; // Contexto do tema
import Image from "next/image"; // Componente de imagem otimizada
import { useRouter } from 'next/navigation';

// Interface para definir a estrutura de um aluno
interface Student {
  id: number;
  nomeAluno: string;
  identifierCode: number;
  imageUrl?: string; // URL da imagem do aluno (opcional)
  status?: string; // Status do aluno (ativo/inativo)
}

// Componente principal da lista de alunos do professor
export default function TeacherList({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  // Obtém os parâmetros da URL
  const params = useParams();
  const id = params.id as string; // ID da turma vindo da URL

  // Estados do componente
  const [students, setStudents] = useState<Student[]>([]); // Lista de alunos
  const [loading, setLoading] = useState(true); // Estado de carregamento
  const [error, setError] = useState<string | null>(null); // Mensagem de erro
  const [search, setSearch] = useState(""); // Termo de busca
  const [currentPage, setCurrentPage] = useState(1); // Página atual da paginação
  const studentsPerPage = 6; // Número de alunos por página
  const { darkMode, toggleTheme } = useTheme(); // Controle do tema
  const router = useRouter();

  // Reseta a página atual quando o termo de busca muda
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // Busca os alunos quando o ID da turma muda
  useEffect(() => {
    if (!id) return;

    const fetchStudents = async () => {
      try {
        setLoading(true);
        // Faz requisição para a API
        const response = await fetch(
          `https://backendona-amfeefbna8ebfmbj.eastus2-01.azurewebsites.net/api/class/students/${id}`
        );
        if (!response.ok) throw new Error("Erro ao buscar alunos");
        const data = await response.json();
        // Garante que students seja sempre um array
        setStudents(Array.isArray(data.students) ? data.students : []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [id]);

  // Filtra alunos com base no termo de busca
  const filteredStudents = students.filter((student) =>
    student.nomeAluno.toLowerCase().includes(search.toLowerCase())
  );

  // Calcula o total de páginas para paginação
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  
  // Obtém os alunos a serem exibidos na página atual
  const displayedStudents = filteredStudents.slice(
    (currentPage - 1) * studentsPerPage,
    currentPage * studentsPerPage
  );

  // Exibe mensagem de erro se houver
  if (error) return <div className="p-4 text-red-500">Erro: {error}</div>;

  return (
    <div className="min-h-screen bg-[#F0F7FF] flex dark:bg-[#141414]">
      {/* Barra lateral */}
      <Sidebar />
      
      {/* Conteúdo principal */}
      <div className="w-full flex flex-col items-center mt-8">
       {/* Botão para alternar tema */}
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

        {/* Container principal */}
        <div className="container mx-auto p-8 rounded-3xl bg-white dark:bg-black dark:border-black w-[85%] space-y-6">
          {/* Campo de busca */}
          <div className="relative w-full max-w-md mx-auto">
            <SearchInput
              placeholder="Digite o nome do aluno..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Lista de alunos */}
          <div className="p-8 flex flex-col">
            {loading ? (
              // Placeholder de carregamento
              <div className="grid grid-cols-3 gap-6 max-md:grid-cols-2">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="flex flex-col items-center p-4 rounded-lg shadow-md bg-[#F0F7FF] dark:bg-[#141414]">
                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full mb-2 animate-pulse"></div>
                    <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded mt-2 animate-pulse"></div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {/* Grid de alunos */}
                <div className="grid grid-cols-3 gap-6 max-md:grid-cols-2">
                  {displayedStudents.map((student) => (
                    <Link
                      key={student.id}
                      href={`/teacher/feedback/studentsFeedback/studentProfile/${student.id}`}
                      passHref
                    >
                      {/* Card do aluno */}
                      <div className="flex flex-col items-center p-4 rounded-lg shadow-md bg-[#F0F7FF] dark:bg-[#141414] dark:text-white border-[#F0F7FF] dark:border-[#141414] cursor-pointer hover:shadow-lg transition-shadow">
                        {/* Avatar do aluno */}
                        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full mb-2 flex items-center justify-center overflow-hidden">
                          {student.imageUrl ? (
                            <Image
                              src={student.imageUrl}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                              alt={`Foto de ${student.nomeAluno}`}
                            />
                          ) : (
                            <span className="text-gray-500 dark:text-gray-400">Foto</span>
                          )}
                        </div>
                        {/* Nome do aluno */}
                        <span className="font-medium">{student.nomeAluno}</span>
                        {/* Status do aluno */}
                        <span className={`mt-1 ${
                          student.status === "inactive" 
                            ? "text-gray-500 dark:text-gray-400" 
                            : "text-green-600 dark:text-green-400"
                        }`}>
                          {student.status === "inactive" ? "Inativo(a)" : "Ativo(a)"}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Paginação */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-6">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-4 py-2 mx-1 rounded-md transition ${
                          currentPage === i + 1
                            ? "bg-blue-500 text-white dark:bg-blue-600"
                            : "bg-[#F0F7FF] text-blue-500 hover:bg-gray-300 dark:bg-[#141414] dark:hover:bg-gray-800"
                        }`}
                        disabled={currentPage === i + 1}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}