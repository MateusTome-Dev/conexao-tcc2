"use client";

// Importações de componentes e bibliotecas
import Chart from "@/components/ui/alunos/chart";
import { Card, CardContent } from "@/components/ui/alunos/card";
import GradeCard from "@/components/ui/alunos/gradeCard";
import MessageList from "@/components/ui/alunos/messageList";
import Sidebar from "@/components/layout/sidebar";
import WelcomeMessage from "@/components/ui/welcomeMessage";
import LateralCalendar from "@/components/ui/lateralCalendar";
import { Button } from "@/components/ui/alunos/button";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { MediaCard } from "@/components/ui/alunos/mediaCard";
import { useTheme } from "@/components/ThemeProvider";

export default function Dashboard() {
  // Estados do componente
  const { darkMode, toggleTheme } = useTheme();
  const [studentName, setStudentName] = useState<string>("Aluno");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [media, setMedia] = useState<number>(0);

  /**
   * Efeito para buscar os dados do aluno ao montar o componente
   */
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        // 1. Obtém o token JWT do localStorage
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token não encontrado");

        // 2. Decodifica o token para obter o ID do usuário
        const decoded: any = jwtDecode(token);
        const userId = decoded?.sub;
        if (!userId) throw new Error("ID do usuário não encontrado no token");

        // 3. Faz requisição para a API
        const response = await fetch(
          `https://onaback-fke4h4d2dkbfcsav.eastus2-01.azurewebsites.net/api/student/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // 4. Verifica se a resposta foi bem sucedida
        if (!response.ok) throw new Error("Erro ao buscar dados do aluno");

        // 5. Atualiza o nome do aluno
        const data = await response.json();
        setStudentName(data.nome || "Aluno");
      } catch (err: any) {
        // 6. Tratamento de erros
        setError(err.message || "Erro ao buscar nome do aluno");
      } finally {
        // 7. Finaliza o carregamento
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  /**
   * Função para atualizar a média do aluno
   * @param novaMedia - Novo valor da média
   */
  const atualizarMedia = (novaMedia: number) => {
    setMedia(novaMedia);
  };

  // Renderização do componente
  return (
    <div
      className={`flex ${
        darkMode ? "bg-[#141414] text-white" : "bg-[#F0F7FF] text-black"
      }`}
    >
      <Sidebar />
      <main className="flex-1 pl-6 pb-6 pr-6 pt-2">
        <div className="flex justify-end">
          <Button onClick={toggleTheme}>
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
        </div>
        <div className="flex flex-row items-center">
          {loading ? (
            <span>Carregando...</span>
          ) : error ? (
            <span className="text-red-500">{error}</span>
          ) : (
            <WelcomeMessage name={studentName} />
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <Card>
            <CardContent>
              <MediaCard atualizarMedia={atualizarMedia} />
              <Chart valorAtual={media} />
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="flex flex-row justify-center">
                <GradeCard />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="mt-4 w-full">
          <div className="rounded-xl">
            <MessageList />
          </div>
        </div>
      </main>
      <LateralCalendar />
    </div>
  );
}
