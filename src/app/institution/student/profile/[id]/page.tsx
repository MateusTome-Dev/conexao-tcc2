"use client";
// Importações de componentes e bibliotecas
import Sidebar from "@/components/layout/sidebarInstitution";
import { ProfileInfo } from "@/components/ui/alunos/profile";
import { Button } from "@/components/ui/alunos/button";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Moon, Pencil, Sun, Trash, ArrowLeft } from "lucide-react";
import Link from "next/link";
import DeleteModal from "@/components/modals/modelDelete";
import { useTheme } from "@/components/ThemeProvider";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { ButtonEdit } from "@/components/ui/institution/buttonEdit";

// Interface para definir a estrutura dos dados do estudante
interface StudentProfile {
  imageUrl: string;
  nome: string;
  emailAluno: string;
  dataNascimentoAluno: string;
  telefoneAluno: string;
  matriculaAluno: string;
}

// Componente principal da página de perfil do estudante
export default function User({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  // Hooks para gerenciar estado e roteamento
  const params = useParams();
  const { darkMode, toggleTheme } = useTheme();
  const id = params.id as string; // Extrai o ID da turma da URL
  const [studentData, setStudentData] = useState<StudentProfile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null
  );
  const router = useRouter();

  // Função para buscar os dados do estudante na API
  const fetchStudentData = async () => {
    try {
      const response = await fetch(`https://backendona-amfeefbna8ebfmbj.eastus2-01.azurewebsites.net/api/student/${id}`);
      if (!response.ok)
        throw new Error("Não foi possível carregar os dados do estudante");

      const data = await response.json();
      setStudentData(data); // Atualiza o estado com os dados do estudante
    } catch (err: any) {
      setError(err.message); // Armazena mensagem de erro caso ocorra
    } finally {
      setLoading(false); // Finaliza o estado de carregamento
    }
  };

  // Função para deletar um estudante
  const deleteStudent = async (id: string) => {
    try {
      const response = await fetch(`https://backendona-amfeefbna8ebfmbj.eastus2-01.azurewebsites.net/api/student/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Erro ao excluir o estudante");

      // Limpa os estados após exclusão bem-sucedida
      setStudentData(null);
      setIsModalOpen(false);
      setSelectedStudentId(null);
    } catch (error: any) {
      setError(error.message);
    }
  };

  // Efeito para carregar os dados do estudante quando o componente é montado
  useEffect(() => {
    fetchStudentData();
  }, []);

  // Função para abrir o modal de confirmação de exclusão
  const handleDeleteClick = (id: string) => {
    setSelectedStudentId(id);
    setIsModalOpen(true);
  };

  // Função para confirmar a exclusão do estudante
  const confirmDelete = () => {
    if (selectedStudentId) {
      deleteStudent(selectedStudentId);
      toast.success("Aluno deletado com sucesso!");
      // Redireciona para a página de turmas após 2 segundos
      setTimeout(() => {
        router.push("/institution/class");
      }, 2000);
    }
  };

  // Efeito para aplicar o tema escuro/claro
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <>
      {/* Container para exibir notificações toast */}
      <ToastContainer />
      <div className="flex min-h-screen bg-[#F0F7FF] dark:bg-[#141414]">
        {/* Componente da barra lateral */}
        <Sidebar />
        <main className="flex-1">
          <div className="p-8">
            {/* Botão para alternar entre temas claro/escuro */}
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

            {/* Container principal com informações do estudante */}
            <div className="bg-white dark:bg-black rounded-lg shadow-sm p-3">
              {/* Exibe as informações do estudante se os dados estiverem disponíveis */}
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

              {/* Botões de ação (editar e excluir) */}
              <div className="w-full flex flex-row justify-end space-x-4 pr-8">
                <Link href={`../editprofile/${id}`}>
                  <button className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600">
                    <Pencil size={20} />
                  </button>
                </Link>
                <button
                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                  onClick={() => handleDeleteClick(id)}
                >
                  <Trash size={20} />
                </button>
              </div>

              {/* Link para ver mais informações (feedback) */}
              <div className="flex justify-center w-full">
                <ButtonEdit
                  onClick={() => window.location.href = `./feedback/${id}`}
                >
                  Ver Mais
                </ButtonEdit>
              </div>
            </div>
          </div>
        </main>

        {/* Modal de confirmação para exclusão */}
        <DeleteModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={confirmDelete}
        />
      </div>
    </>
  );
}