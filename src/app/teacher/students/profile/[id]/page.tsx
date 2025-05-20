"use client"; // Indica que este é um componente do lado do cliente (Next.js)

// Importações de componentes e bibliotecas
import Sidebar from "@/components/layout/sidebarTeacher"; // Barra lateral do professor
import { ProfileInfo } from "@/components/ui/alunos/profile"; // Componente de perfil do aluno
import { Button } from "@/components/ui/alunos/button"; // Componente de botão personalizado
import { useEffect, useState } from "react"; // Hooks do React
import { useParams } from "next/navigation"; // Hook para acessar parâmetros da rota
import { Moon, Sun, ArrowLeft } from "lucide-react"; // Ícones de lua e sol (tema claro/escuro)
import { useTheme } from "@/components/ThemeProvider"; // Gerenciador de tema
import { useRouter } from 'next/navigation';

// Interface que define a estrutura dos dados do aluno
interface StudentProfile {
  imageUrl?: string; // URL da foto (opcional)
  nome: string; // Nome completo do aluno
  emailAluno: string; // E-mail do aluno
  dataNascimentoAluno: string; // Data de nascimento
  telefoneAluno: string; // Número de telefone
  matriculaAluno: string; // Número de matrícula
}

// Componente principal da página de perfil do aluno
export default function User({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  // Obtém os parâmetros da URL
  const params = useParams();
  
  // Configurações de tema (claro/escuro)
  const { darkMode, toggleTheme } = useTheme();
  
  // Extrai o ID do aluno da URL
  const id = params.id as string;
  
  // Estados do componente
  const [studentData, setStudentData] = useState<StudentProfile | null>(null); // Dados do aluno
  const [loading, setLoading] = useState(true); // Estado de carregamento
  const [error, setError] = useState<string | null>(null); // Mensagens de erro
  const router = useRouter();

  /**
   * Função assíncrona para buscar os dados do aluno na API
   */
  const fetchStudentData = async () => {
    try {
      // Faz a requisição para a API
      const response = await fetch(`https://backendona-amfeefbna8ebfmbj.eastus2-01.azurewebsites.net/api/student/${id}`);
      
      // Verifica se a resposta foi bem-sucedida
      if (!response.ok) {
        throw new Error("Não foi possível carregar os dados do estudante");
      }

      // Converte a resposta para JSON
      const data = await response.json();
      
      // Atualiza os dados do aluno no estado
      setStudentData(data);
    } catch (err: any) {
      // Em caso de erro, armazena a mensagem de erro
      setError(err.message);
    } finally {
      // Finaliza o estado de carregamento
      setLoading(false);
    }
  };

  // Efeito que executa ao montar o componente
  useEffect(() => {
    fetchStudentData(); // Busca os dados do aluno
  }, []); // Array de dependências vazio = executa apenas uma vez

  // Renderização do componente
  return (
    <div className="flex min-h-screen bg-[#F0F7FF] dark:bg-[#141414]">
      {/* Componente da barra lateral */}
      <Sidebar />
      
      {/* Conteúdo principal */}
      <main className="flex-1">
        <div className="p-8">
          {/* Container do botão de tema (superior direito) */}
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
          
          {/* Container do perfil do aluno */}
          <div className="bg-white dark:bg-black rounded-lg shadow-sm p-3">
            {/* Renderização condicional - mostra os dados se estiverem disponíveis */}
            {studentData && (
              <ProfileInfo
                imageUrl={studentData.imageUrl}
                name={studentData.nome}
                email={studentData.emailAluno}
                birthDate={studentData.dataNascimentoAluno}
                phone={studentData.telefoneAluno}
                registrationNumber={studentData.matriculaAluno}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}