"use client"; 

// Importações de componentes e bibliotecas
import Sidebar from "@/components/layout/sidebar";
import { ProfileInfo } from "@/components/ui/alunos/profile";
import WelcomeUser from "@/components/ui/welcomeUser"; 
import { Button } from "@/components/ui/alunos/button"; 
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react"; 
import { jwtDecode } from "jwt-decode"; 
import { useTheme } from "@/components/ThemeProvider"; 

// Interface para os dados do perfil do aluno
interface StudentProfile {
  imageUrl: string; 
  nome: string; 
  emailAluno: string; 
  dataNascimentoAluno: string; 
  telefoneAluno: string; 
  matriculaAluno: string; 
}

// Componente principal da página de perfil do usuário
export default function User({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  // Estados do componente
  const [studentData, setStudentData] = useState<StudentProfile | null>(null); 
  const { darkMode, toggleTheme } = useTheme(); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null); 

  // Efeito para aplicar o tema selecionado
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode); 
    localStorage.setItem("theme", darkMode ? "dark" : "light"); 
  }, [darkMode]);

  /**
   * Busca os dados do aluno na API
   */
  const fetchStudentData = async () => {
    try {
      // 1. Obtém o token JWT do localStorage
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token não encontrado");

      // 2. Decodifica o token para obter o ID do usuário
      const decoded: any = jwtDecode(token);
      const id = decoded?.sub;
      if (!id) throw new Error("ID do usuário não encontrado no token");

      // 3. Faz requisição para a API
      const response = await fetch(`https://backendona-amfeefbna8ebfmbj.eastus2-01.azurewebsites.net/api/student/${id}`);
      if (!response.ok) throw new Error("Não foi possível carregar os dados do estudante");

      // 4. Atualiza os dados do aluno
      const data = await response.json();
      setStudentData(data);
    } catch (err: any) {
      // 5. Tratamento de erros
      setError(err.message);
    } finally {
      // 6. Finaliza o carregamento
      setLoading(false);
    }
  };

  // Efeito para buscar os dados quando o componente é montado
  useEffect(() => {
    fetchStudentData();
  }, []);

  // Renderização do componente
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#F0F7FF] dark:bg-[#141414]">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8 overflow-auto">
        <div className="flex flex-row items-start md:items-center justify-between mb-6 md:mb-8 gap-4">
          <WelcomeUser/>
          <Button onClick={toggleTheme}>
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
        </div>
        {studentData && (
          <ProfileInfo
            imageUrl={studentData.imageUrl} 
            email={studentData.emailAluno}
            birthDate={studentData.dataNascimentoAluno}
            phone={studentData.telefoneAluno}
            registrationNumber={studentData.matriculaAluno}
          />
        )}
      </main>
    </div>
  );
}