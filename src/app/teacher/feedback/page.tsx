"use client"; // Indica que este é um componente do lado do cliente no Next.js

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/alunos/button";
import Sidebar from "@/components/layout/sidebarTeacher";
import SearchInput from "@/components/ui/search";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";
import Link from "next/link";

// Interface para definir a estrutura de uma turma
interface Class {
  nomeTurma: string;
  id: number;
  quantidadeAlunos: number;
}

// Interface para definir a estrutura do perfil do professor
interface TeacherProfile {
  nomeDocente: string;
  classes: Class[];
}

export default function CheckInEmocional() {
  // Estados para armazenar dados do professor, carregamento e erros
  const [docenteData, setDocenteData] = useState<TeacherProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Gerenciamento do tema (claro/escuro)
  const { darkMode, toggleTheme } = useTheme();
  
  // Estado para busca/filtro
  const [search, setSearch] = useState("");
  
  // Router para navegação
  const router = useRouter();

  // Função para buscar os dados do professor (docente)
  const fetchDocenteData = async () => {
    try {
      // Obtém o token do localStorage
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token não encontrado");

      // Decodifica o token JWT para obter informações do usuário
      const decoded: any = jwtDecode(token);
      const id = decoded?.sub;
      if (!id) throw new Error("ID do usuário não encontrado no token");

      // Faz a requisição para a API para obter as turmas do professor
      const response = await fetch(
        `https://onacademy-e2h7csembwhrf2bu.brazilsouth-01.azurewebsites.net/api/teacher/classes/${id}`
      );
      if (!response.ok)
        throw new Error("Não foi possível carregar os dados do docente");

      // Atualiza o estado com os dados recebidos
      const data = await response.json();
      setDocenteData(data);
    } catch (err: any) {
      // Em caso de erro, armazena a mensagem de erro
      setError(err.message);
    } finally {
      // Independente de sucesso ou erro, finaliza o estado de carregamento
      setLoading(false);
    }
  };

  // Efeito para aplicar o tema ao carregar a página
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Efeito para buscar os dados do professor quando o componente é montado
  useEffect(() => {
    fetchDocenteData();
  }, []);

  // Filtra as turmas com base no termo de busca
  const filteredClasses = docenteData?.classes.filter((classe) =>
    classe.nomeTurma.toLowerCase().includes(search.toLowerCase())
  );

  // Renderização do componente
  return (
    <div className="min-h-screen bg-[#F0F7FF] flex flex-row dark:bg-[#141414]">
      {/* Barra lateral */}
      <Sidebar />
      
      {/* Conteúdo principal */}
      <div className="w-full flex flex-col items-center mt-8">
        {/* Botão para alternar entre temas (claro/escuro) */}
        <div className="w-full flex justify-end mb-8 mr-28">
          <Button onClick={toggleTheme}>
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
        </div>
        
        {/* Container principal */}
        <div className="container mx-auto p-4 border rounded-lg bg-white w-[85%] h-[85%] p-8 rounded-3xl dark:bg-black dark:border-black">
          {/* Campo de busca */}
          <div className="relative w-full max-w-md mx-auto flex justify-center items-center mb-6">
            <SearchInput
              placeholder="Buscar turma..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          {/* Renderização condicional baseada no estado */}
          {loading ? (
            <p className="text-center text-gray-700 dark:text-white">
              Carregando...
            </p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Verifica se há turmas filtradas */}
              {filteredClasses?.length ? (
                // Mapeia cada turma para um card
                filteredClasses.map((turma) => (
                  <div
                    key={turma.id}
                    className="bg-blue-50 dark:bg-[#141414] p-4 rounded-lg shadow hover:shadow-lg transition-shadow"
                  >
                    <h3 className="font-bold text-lg dark:text-white">
                      {turma.nomeTurma}{" "}
                      <span className="text-gray-500 text-sm dark:text-[#8A8A8A]">
                        Nº{turma.id}
                      </span>
                    </h3>
                    <p className="text-gray-700 dark:text-white">
                      {turma.quantidadeAlunos} alunos ativos
                    </p>
                    {/* Link para a página de feedback dos alunos da turma */}
                    <Link href={`/teacher/feedback/studentsFeedback/${turma.id}`}>
                      <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
                        Visualizar turma
                      </button>
                    </Link>
                  </div>
                ))
              ) : (
                // Mensagem quando nenhuma turma é encontrada
                <p className="text-center text-gray-700 dark:text-white col-span-full">
                  Nenhuma turma encontrada.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}