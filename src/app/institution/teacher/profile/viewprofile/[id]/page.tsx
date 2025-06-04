"use client";
// Importing necessary components and libraries
import Sidebar from "@/components/layout/sidebarInstitution";
import { ProfileInfo } from "@/components/ui/teacher/profile";
import { Button } from "@/components/ui/alunos/button";
import { Moon, Sun, Pencil, Ban, ArrowLeft } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/alunos/table";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";
import Modal from "@/components/modals/modelDelete";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Interface defining the structure of a Teacher Profile
interface TeacherProfile {
  id: number;
  imageUrl?: string;
  nomeDocente: string;
  emailDocente: string;
  dataNascimentoDocente: string;
  telefoneDocente: string;
  identifierCode: string;
  classes: Array<{
    nomeTurma: string;
  }>;
}

// Interface defining the structure of Feedback
interface Feedback {
  conteudo: string;
  aluno: { nomeAluno: string };
  recipientTeacher: { id: number };
}

// Main component for Teacher Profile page
export default function User() {
  // State variables for component data
  const [docenteData, setDocenteData] = useState<TeacherProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { darkMode, toggleTheme } = useTheme();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState<number | null>(null);

  // Getting URL parameters and router instance
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  // Function to fetch teacher data from API
  const fetchDocenteData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token não encontrado");

      const response = await fetch(`https://onaback-fke4h4d2dkbfcsav.eastus2-01.azurewebsites.net/api/teacher/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Não foi possível carregar os dados do docente");
      }

      const data = await response.json();
      setDocenteData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to delete a teacher
  const deleteTeacher = async (teacherId: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token não encontrado");

      // First remove teacher from classes
      await fetch(`https://onaback-fke4h4d2dkbfcsav.eastus2-01.azurewebsites.net/api/class-teacher?teacherId=${teacherId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ teacherId: null }),
      });

      // Then delete the teacher
      const response = await fetch(`https://onaback-fke4h4d2dkbfcsav.eastus2-01.azurewebsites.net/api/teacher/${teacherId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Erro ao excluir docente");

      toast.success("Docente excluído com sucesso!");
      setTimeout(() => {
        router.push("/institution/teacher");
      }, 2000);
    } catch (error: any) {
      setError(error.message);
      console.error(error);
    } finally {
      setIsModalOpen(false);
      setSelectedTeacherId(null);
    }
  };

  // Handler for delete button click
  const handleDeleteClick = (teacherId: number) => {
    setSelectedTeacherId(teacherId);
    setIsModalOpen(true);
  };

  // Confirmation of delete action
  const confirmDelete = () => {
    if (selectedTeacherId !== null) {
      deleteTeacher(selectedTeacherId);
    }
  };

  // Function to fetch feedbacks for the teacher
  const fetchFeedbacks = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token não encontrado");

      const response = await fetch(`https://onaback-fke4h4d2dkbfcsav.eastus2-01.azurewebsites.net/api/feedbackStudent/teacher/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        console.warn("Nenhum feedback encontrado para este docente.");
        setFeedbacks([]);
        return;
      }

      const data = await response.json();
      setFeedbacks(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.warn("Erro ao carregar feedbacks:", err.message);
      setFeedbacks([]);
    }
  };

  // Effect to load teacher data and feedbacks when component mounts or ID changes
  useEffect(() => {
    fetchDocenteData();
    fetchFeedbacks();
  }, [id]);

  // Loading and error states
  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  // Main component render
  return (
    <>
      {/* Toast notifications container */}
      <ToastContainer />

      {/* Main page container */}
      <div className={`flex flex-row ${darkMode ? "bg-[#141414]" : "bg-[#F0F7FF]"} min-h-screen`}>
        {/* Sidebar component */}
        <Sidebar />

        {/* Main content area */}
        <main className="flex-1 p-8">
          {/* Profile container with dark mode support */}
          <div className="space-y-6 bg-white dark:bg-black dark:text-white p-8 rounded-2xl">
            {/* Theme toggle button */}
            <div className="flex items-center justify-between">  {/* Alterado de justify-end para justify-between */}
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 p-2 font-bold rounded-full text-blue-500"
              >
                <ArrowLeft size={20} />
                <span>Voltar</span>
              </button>

              <Button onClick={toggleTheme}>
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </Button>
            </div>

            {/* Teacher profile information */}
            {docenteData && (
              <>
                <ProfileInfo
                  imageUrl={docenteData.imageUrl}
                  name={docenteData.nomeDocente}
                  email={docenteData.emailDocente}
                  birthDate={docenteData.dataNascimentoDocente}
                  phone={docenteData.telefoneDocente}
                  registrationNumber={docenteData.identifierCode}
                  classes={docenteData.classes}
                />

                {/* Action buttons (Edit and Delete) */}
                <div className="w-full flex flex-row justify-end space-x-4 pr-8">
                  <Link href={`/institution/teacher/profile/editprofile/${docenteData.id}`}>
                    <button className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600">
                      <Pencil size={20} />
                    </button>
                  </Link>
                  <button
                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                    onClick={() => handleDeleteClick(docenteData.id)}
                  >
                    <Ban size={20} />
                  </button>
                </div>
              </>
            )}

            {/* Feedback section */}
            <div className="space-y-4 pb-6 border-b border-gray-500 dark:border-gray-600">
              <h2 className="text-lg font-bold dark:text-white">Feedbacks</h2>

              {/* Feedback table with scrollable container */}
              <div className="max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-200">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Conteúdo</TableHead>
                      <TableHead>Criado por</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {feedbacks.length > 0 ? (
                      feedbacks.map((feedback, index) => (
                        <TableRow key={index}>
                          <TableCell>{feedback.conteudo}</TableCell>
                          <TableCell>{feedback.aluno?.nomeAluno || "Desconhecido"}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={2} className="text-center">Nenhum feedback encontrado.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>

          {/* Delete confirmation modal */}
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={confirmDelete} />
        </main>
      </div>
    </>
  );
}