"use client"; // Indica que este é um componente do lado do cliente (Client-Side Rendering)

// Importações de componentes e bibliotecas
import Table from "@/components/ui/institution/gradeTableStudents"; // Componente de tabela de notas
import Sidebar from "@/components/layout/sidebarInstitution"; // Barra lateral da instituição
import { Button } from "@/components/ui/alunos/button"; // Componente de botão personalizado
import { Moon, Sun, ArrowLeft } from "lucide-react"; // Ícones para os temas claro/escuro
import { useTheme } from "@/components/ThemeProvider"; // Hook para gerenciamento de tema
import { useRouter } from 'next/navigation';

// Componente principal da página de notas
export default function Notes({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  // Obtém o estado do tema e a função para alternar entre claro/escuro
  const { darkMode, toggleTheme } = useTheme();
  const router = useRouter();
  
  return (
    // Container principal com fundo que muda conforme o tema
    <div className="flex min-h-screen bg-[#F0F7FF] dark:bg-[#141414]">
      {/* Componente da barra lateral */}
      <Sidebar />
      
      {/* Área principal do conteúdo */}
      <main className="flex-1 ">
        <div className="p-8">
          {/* Container do botão de alternar tema (alinhado à direita) */}
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
          {/* Componente da tabela de notas dos alunos */}
          <Table />
        </div>
      </main>
    </div>
  );
}