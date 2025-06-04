"use client";
// Importações de hooks, componentes e bibliotecas
import { useEffect, useState } from "react"; // Hooks básicos do React
import { Moon, Sun } from "lucide-react"; // Ícones para alternância de tema
import { Button } from "@/components/ui/alunos/button"; // Componente de botão customizado
import Sidebar from "@/components/layout/sidebarTeacher"; // Barra lateral do professor
import SearchInput from "@/components/ui/search"; // Componente de campo de busca
import { useParams } from "next/navigation"; // Hook para acesso aos parâmetros da rota
import Link from "next/link"; // Componente para navegação entre páginas
import { useTheme } from "@/components/ThemeProvider"; // Contexto para gerenciamento de tema

// Interface para tipagem dos dados do aluno
interface Student {
  id: number;
  nomeAluno: string;
  identifierCode: number;
}

// Componente principal da lista de alunos do professor
export default function TeacherList({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  // Obtém parâmetros da URL (ID da turma)
  const params = useParams();
  const id = params.id as string;

  // Estados do componente
  const [estudante, setEstudante] = useState<Student[]>([]); // Lista de alunos
  const [loading, setLoading] = useState(true); // Estado de carregamento
  const [error, setError] = useState<string | null>(null); // Mensagens de erro
  const [search, setSearch] = useState(""); // Termo de busca
  const [currentPage, setCurrentPage] = useState(1); // Página atual da paginação
  const studentsPerPage = 6; // Alunos por página
  const { darkMode, toggleTheme } = useTheme(); // Controle do tema (claro/escuro)

  // Efeito para aplicar o tema ao carregar/alterar
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  // Efeito para resetar a página quando a busca muda
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // Efeito para buscar alunos da turma quando o ID muda
  useEffect(() => {
    if (!id) return; // Sai se não houver ID

    const fetchStudents = async () => {
      try {
        const response = await fetch(`https://onaback-fke4h4d2dkbfcsav.eastus2-01.azurewebsites.net/api/class/students/${id}`);
        if (!response.ok) throw new Error("Erro ao buscar alunos");
        const data = await response.json();
        // Garante que os alunos sejam sempre um array
        setEstudante(Array.isArray(data.students) ? data.students : []);
      } catch (err: any) {
        setError(err.message); // Armazena o erro
      } finally {
        setLoading(false); // Finaliza o carregamento
      }
    };

    fetchStudents();
  }, [id]);

  // Filtra alunos com base no termo de busca
  const filteredStudents = estudante.filter((student) =>
    student.nomeAluno.toLowerCase().includes(search.toLowerCase())
  );

  // Calcula o total de páginas necessárias
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  // Obtém apenas os alunos da página atual
  const displayedStudents = filteredStudents.slice(
    (currentPage - 1) * studentsPerPage,
    currentPage * studentsPerPage
  );

  // Exibe mensagem de erro se houver
  if (error) return <div>Erro: {error}</div>;

  // Renderização do componente
  return (
    <div className="min-h-screen bg-[#F0F7FF] flex dark:bg-[#141414]">
      {/* Barra lateral */}
      <Sidebar />
      
      {/* Conteúdo principal */}
      <div className="w-full flex flex-col items-center mt-8">
        {/* Botão de alternância de tema */}
        <div className="w-full flex justify-end mb-8 mr-28">
          <Button onClick={toggleTheme}>
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
        </div>

        {/* Container principal */}
        <div className="container mx-auto p-8 rounded-3xl bg-white dark:bg-black dark:border-black w-[85%] space-y-6">
          {/* Campo de busca */}
          <div className="relative w-full max-w-md mx-auto">
            <SearchInput
              placeholder="Digite o nome do aluno..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Lista de alunos */}
          <div className="p-8 flex flex-col">
            {/* Grid responsiva de cards de alunos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {displayedStudents.map((student) => (
                <Link key={student.id} href={`/aluno/${student.id}`}>
                  {/* Card do aluno */}
                  <div className="flex flex-col items-center p-4 rounded-lg shadow-md bg-[#F0F7FF] dark:bg-[#141414] dark:text-white border-[#F0F7FF] dark:border-[#141414] cursor-pointer hover:shadow-lg transition-shadow">
                    <div className="w-16 h-16 bg-gray-200 rounded-full mb-2 flex items-center justify-center">
                      🎓
                    </div>
                    <span className="font-medium">{student.nomeAluno}</span>
                    <span className="text-green-600">Ativo(a)</span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Paginação (se necessário) */}
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