"use client"; 

// Importações de bibliotecas e componentes
import React, { useEffect, useState } from "react";
import Table from "../../../components/ui/alunos/gradeTable"; 
import Sidebar from "@/components/layout/sidebar"; 
import { Button } from "@/components/ui/alunos/button"; 
import { Moon, Sun } from "lucide-react"; 
import {jwtDecode} from 'jwt-decode'; 
import { useTheme } from "@/components/ThemeProvider"; 

// Interface que define a estrutura dos dados do estudante
interface StudentData {
  nome: string; 
  dataNascimentoAluno: string; 
  telefoneAluno: string; 
  emailAluno: string; 
  matriculaAluno: string; 
  turma: { 
    nomeTurma: string; 
    idTUrma: number; 
  };
  notas: Array<{ 
    idNota: number; 
    nota: number; 
    bimestre: number; 
    status: string; 
    NomeDiscipline: string; 
  }>;
}

// Componente principal de notas
export default function Notes({ value, className }: { value: number; className?: string }){
  const { darkMode, toggleTheme } = useTheme(); 
  
  // Estados do componente
  const [studentData, setStudentData] = useState<StudentData | null>(null); 
  const [loading, setLoading] = useState<boolean>(true); 
  const [error, setError] = useState<string | null>(null); 

  /**
   * Função para buscar os dados do estudante na API
   */
  const fetchStudentData = async () => {
    try {
      // 1. Obtém o token JWT do localStorage
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token não encontrado');
      
      // 2. Decodifica o token para obter o ID do usuário
      const decoded: any = jwtDecode(token);
      const userId = decoded?.sub;
      if (!userId) throw new Error('ID do usuário não encontrado no token');
      
      // 3. Faz a requisição para a API
      const response = await fetch(`https://onaback-fke4h4d2dkbfcsav.eastus2-01.azurewebsites.net/api/student/${userId}`);
      
      // 4. Verifica se a resposta foi bem sucedida
      if (!response.ok) {
        throw new Error('Não foi possível carregar os dados do estudante');
      }
      
      // 5. Atualiza os dados do estudante no estado
      const data: StudentData = await response.json();
      setStudentData(data);
    } catch (error) {
      // 6. Tratamento de erros
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Efeitos colaterais
  useEffect(() => {
    fetchStudentData(); 
    document.documentElement.classList.toggle("dark", darkMode); 
    localStorage.setItem("theme", darkMode ? "dark" : "light"); 
  }, [darkMode]);

  const getCurrentDate = () => {
    const today = new Date();
    return today.toLocaleDateString('pt-BR', {
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
    });
  };

  // Estados de carregamento e erro
  if (loading) {
    return <div>Carregando dados...</div>;
  }

  if (error) {
    return <div>Erro: {error}</div>;
  }

  // Renderização do componente
  return (
    <div className="flex min-h-screen bg-[#F0F7FF] dark:bg-[#141414]">
      <Sidebar />
      <main className="flex-1 ">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-[#0D0D0D] dark:text-[#ffffff]">
                {studentData?.nome}
              </h1>
              <p className="text-gray-500">{getCurrentDate()}</p>
            </div>
            <Button onClick={toggleTheme}>
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </Button>
          </div>
          <Table />
        </div>
      </main>
    </div>
  );
}