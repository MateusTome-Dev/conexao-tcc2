"use client"; // Indica que este é um componente do lado do cliente (Next.js)

// Importações de componentes e bibliotecas
import MessageList from "@/components/ui/teacher/messageList"; // Lista de mensagens
import SidebarTeacher from "@/components/layout/sidebarTeacher"; // Barra lateral do professor
import { Button } from "@/components/ui/alunos/button"; // Componente de botão
import { Sun, Moon } from "lucide-react"; // Ícones para alternância de tema
import { useEffect, useState } from "react"; // Hooks do React
import { NoticeCard } from "@/components/ui/teacher/noticeCard"; // Card de avisos
import LateralCalendar from "@/components/ui/lateralCalendar"; // Calendário lateral
import WelcomeMessage from "@/components/ui/welcomeMessage"; // Mensagem de boas-vindas
import { jwtDecode } from "jwt-decode"; // Biblioteca para decodificar tokens JWT
import { useTheme } from "@/components/ThemeProvider"; // Gerenciador de tema

// Componente principal do Dashboard do Professor
export default function DashboardTeacher() {
  // Gerenciamento de tema
  const { darkMode, toggleTheme } = useTheme();
  
  // Estados do componente
  const [docenteName, setDocenteName] = useState<string>("Docente"); // Nome do docente
  const [loading, setLoading] = useState(true); // Estado de carregamento
  const [error, setError] = useState<string | null>(null); // Mensagens de erro
  const [media, setMedia] = useState<number>(0); // Média (não utilizada no código atual)
  const [refreshKey, setRefreshKey] = useState(0); // Chave para forçar atualização

  // Função para atualizar componentes que dependem de refreshKey
  const handleRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  // Efeito para aplicar o tema ao HTML e salvar no localStorage
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Efeito para buscar os dados do professor ao montar o componente
  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        // Obtém o token do localStorage
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token não encontrado");

        // Decodifica o token para obter o ID do usuário
        const decoded: any = jwtDecode(token);
        const userId = decoded?.sub;
        if (!userId) throw new Error("ID do usuário não encontrado no token");

        // Faz requisição para a API
        const response = await fetch(
          `https://onaback-fke4h4d2dkbfcsav.eastus2-01.azurewebsites.net/api/teacher/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Erro ao buscar dados do aluno");

        // Processa os dados e atualiza o estado
        const data = await response.json();
        setDocenteName(data.nomeDocente || "Aluno");
      } catch (err: any) {
        // Tratamento de erros
        setError(err.message || "Erro ao buscar nome do docente");
      } finally {
        // Finaliza o estado de carregamento
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, []);

  // Renderização do componente
  return (
    <div
      className={`flex ${
        darkMode ? "bg-[#141414] text-white" : "bg-[#F0F7FF] text-black"
      }`}
    >
      {/* Barra lateral esquerda */}
      <SidebarTeacher />
      
      {/* Conteúdo principal */}
      <main className="flex-1 pl-6 pb-6 pr-6 pt-2">
        {/* Botão de alternância de tema */}
        <div className="flex flex-col items-end">
          <Button onClick={toggleTheme}>
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
        </div>

        {/* Mensagem de Boas-Vindas */}
        <div className="flex flex-row items-center">
          <WelcomeMessage name={docenteName} />
        </div>

        {/* Card de Avisos */}
        <NoticeCard onRefresh={handleRefresh} />

        {/* Lista de Mensagens */}
        <div className="mt-6 w-full">
          <div className="rounded-xl mt-11">
            <MessageList key={refreshKey} />
          </div>
        </div>
      </main>
      
      {/* Barra lateral direita (Calendário) */}
      <LateralCalendar />
    </div>
  );
}