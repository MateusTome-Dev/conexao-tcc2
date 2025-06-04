"use client";
// Importações de componentes e bibliotecas
import Sidebar from "@/components/layout/sidebarTeacher"; // Componente da barra lateral do professor
import { ProfileInfo } from "@/components/ui/teacher/profile"; // Componente de informações do perfil
import WelcomeUser from "@/components/ui/welcomeUser"; // Componente de boas-vindas
import { Button } from "@/components/ui/alunos/button"; // Componente de botão
import { useEffect, useState } from "react"; // Hooks do React
import { Moon, Sun } from "lucide-react"; // Ícones para tema claro/escuro
import { jwtDecode } from "jwt-decode"; // Biblioteca para decodificar tokens JWT
import { useTheme } from "@/components/ThemeProvider"; // Hook para gerenciamento de tema

// Interface que define a estrutura dos dados do professor
interface TeacherProfile {
  imageUrl?: string; // URL da imagem (opcional)
  nomeDocente: string; // Nome do professor
  emailDocente: string; // Email do professor
  dataNascimentoDocente: string; // Data de nascimento
  telefoneDocente: string; // Telefone
  identifierCode: string; // Código de identificação
  classes: Array<{ // Array de turmas do professor
    nomeTurma: string; // Nome da turma
  }>;
}

// Componente principal da página de perfil do professor
export default function User({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  // Gerenciamento de tema (claro/escuro)
  const { darkMode, toggleTheme } = useTheme();
  
  // Estados para armazenar dados, loading e erros
  const [docenteData, setDocenteData] = useState<TeacherProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Função para buscar os dados do professor na API
  const fetchDocenteData = async () => {
    try {
      // Obtém o token do localStorage
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token não encontrado");

      // Decodifica o token para obter o ID do usuário
      const decoded: any = jwtDecode(token);
      const id = decoded?.sub;
      if (!id) throw new Error("ID do usuário não encontrado no token");

      // Faz a requisição para a API
      const response = await fetch(`https://onaback-fke4h4d2dkbfcsav.eastus2-01.azurewebsites.net/api/teacher/${id}`);
      if (!response.ok)
        throw new Error("Não foi possível carregar os dados do estudante");

      // Converte a resposta para JSON e atualiza o estado
      const data = await response.json();
      setDocenteData(data);
    } catch (err: any) {
      // Em caso de erro, armazena a mensagem de erro
      setError(err.message);
    } finally {
      // Independente de sucesso ou erro, desativa o estado de loading
      setLoading(false);
    }
  };

  // Efeito que executa a busca dos dados quando o componente é montado
  useEffect(() => {
    fetchDocenteData();
  }, []);

  // Efeito que aplica o tema selecionado ao HTML e armazena no localStorage
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Renderização do componente
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#F0F7FF] dark:bg-[#141414]">
      {/* Barra lateral */}
      <Sidebar />
      
      {/* Conteúdo principal */}
      <main className="flex-1 p-4 md:p-8 overflow-auto">
        {/* Cabeçalho com boas-vindas e botão de tema */}
        <div className="flex flex-row items-start md:items-center justify-between mb-6 md:mb-8 gap-4">
          <WelcomeUser />
          <Button onClick={toggleTheme}>
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
        </div>
        
        {/* Exibe as informações do perfil se os dados estiverem disponíveis */}
        {docenteData && (
          <ProfileInfo
            imageUrl={docenteData.imageUrl}
            name={docenteData.nomeDocente}
            email={docenteData.emailDocente}
            birthDate={docenteData.dataNascimentoDocente}
            phone={docenteData.telefoneDocente}
            registrationNumber={docenteData.identifierCode}
            classes={docenteData.classes}
            password={""}
          />
        )}
      </main>
    </div>
  );
}