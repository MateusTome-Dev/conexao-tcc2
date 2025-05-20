"use client";
import Sidebar from "@/components/layout/sidebarInstitution";
import { Button } from "@/components/ui/institution/buttonSubmit";
import { useEffect, useState } from "react";
import { Moon, Sun, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/institution/input";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import ModalCreate from "@/components/modals/modalCreate";

interface StudentData {
  id: number;
  name: string;
  email: string;
  birthDate: string;
  phone: string;
  classId: string;
  identifierCode: string;
  imageUrl: string;
}

export default function Profile() {
  const params = useParams();
  const id = params.id as string;
  const { darkMode, toggleTheme } = useTheme();
  const router = useRouter();

  const [studentData, setStudentData] = useState<StudentData>({
    id: 0,
    name: "",
    email: "",
    birthDate: "",
    phone: "",
    classId: "",
    identifierCode: "",
    imageUrl: ""
  });

  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Função aprimorada para formatar a data do backend para o input date
  const formatDateForInput = (backendDate: string): string => {
    if (!backendDate) return "";

    // Se já estiver no formato correto (YYYY-MM-DD)
    if (/^\d{4}-\d{2}-\d{2}$/.test(backendDate)) {
      return backendDate;
    }

    // Remove qualquer parte de tempo e timezone se existir
    const datePart = backendDate.split('T')[0].split(' ')[0];

    // Cria a data ajustando para o fuso horário local
    const date = new Date(datePart);
    if (isNaN(date.getTime())) return "";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate() + 1).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  // Função para formatar a data para o backend
  const formatDateForBackend = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.000-03:00`;
  };

  const formatPhone = (value: string): string => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 10) {
      return numbers
        .replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    } else {
      return numbers
        .replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatPhone(e.target.value);
    setStudentData({ ...studentData, phone: formattedPhone });
  };

  const validateDate = (dateString: string): boolean => {
    if (!dateString) return false;

    const selectedDate = new Date(dateString);
    const minDate = new Date("1900-01-01");
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < minDate) {
      toast.warn("Data de nascimento não pode ser anterior a 1900");
      return false;
    }
    if (selectedDate > today) {
      toast.warn("Data de nascimento não pode ser no futuro");
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (!id) return;

    const fetchStudentData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://backendona-amfeefbna8ebfmbj.eastus2-01.azurewebsites.net/api/student/${id}`
        );
        if (!response.ok) throw new Error("Falha ao buscar dados do aluno");

        const data = await response.json();

        console.log("Dados brutos do backend:", data);
        console.log("Data de nascimento recebida:", data.dataNascimentoAluno);
        console.log("Data formatada:", formatDateForInput(data.dataNascimentoAluno));

        setStudentData({
          id: data.id,
          name: data.nome || "",
          email: data.emailAluno || "",
          birthDate: formatDateForInput(data.dataNascimentoAluno) || "",
          phone: data.telefoneAluno || "",
          classId: data.turmaId || "",
          identifierCode: data.matriculaAluno || "",
          imageUrl: data.imageUrl || ""
        });

        console.log("Estado do aluno após carregamento:", {
          ...studentData,
          birthDate: formatDateForInput(data.dataNascimentoAluno) || ""
        });
      } catch (error) {
        console.error("Erro ao buscar dados do aluno:", error);
        toast.error("Falha ao carregar dados do aluno");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [id]);

  useEffect(() => {
    console.log("Data de nascimento atualizada:", studentData.birthDate);
  }, [studentData.birthDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!studentData.name || !studentData.email ||
      !studentData.birthDate || !studentData.phone) {
      toast.warn("Preencha todos os campos obrigatórios!");
      return;
    }

    if (!validateDate(studentData.birthDate)) {
      return;
    }

    setIsModalOpen(true);

    try {
      const response = await fetch(
        `https://backendona-amfeefbna8ebfmbj.eastus2-01.azurewebsites.net/api/student/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            imageUrl: studentData.imageUrl,
            nomeAluno: studentData.name,
            emailAluno: studentData.email,
            dataNascimentoAluno: formatDateForBackend(studentData.birthDate),
            telefoneAluno: studentData.phone.replace(/\D/g, ""),
            matriculaAluno: studentData.identifierCode
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Falha ao atualizar aluno");
      }

      toast.success("Aluno atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar aluno:", error);
      toast.error(error instanceof Error ? error.message : "Falha ao atualizar aluno");
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setStudentData({ ...studentData, imageUrl: event.target.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <>
      <ToastContainer />
      <div className="flex min-h-screen bg-[#F0F7FF] dark:bg-[#141414]">
        <Sidebar />

        <main className="flex-1 p-8">
          <div className="flex items-center justify-between mb-8 relative">
            {/* Botão Voltar - alinhado à esquerda */}
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors text-blue-500 dark:text-blue-400 z-10"
            >
              <ArrowLeft size={20} />
              <span className="hidden sm:inline">Voltar</span>
            </button>

            {/* Título Centralizado Absolutamente */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-blue-500 dark:text-blue-400">
                  Editar Aluno
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Preencha os campos abaixo para editar o aluno.
                </p>
              </div>
            </div>

            {/* Botão Tema - alinhado à direita */}
            <div className="z-10">
              <Button
                onClick={toggleTheme}
                variant="ghost"
                size="icon"
                aria-label="Alternar tema"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </Button>
            </div>
          </div>
          <div className="container mx-auto p-6 space-y-6 max-w-5xl bg-white dark:bg-black rounded-lg shadow">
            <div className="flex items-center gap-4">
              {studentData.imageUrl ? (
                <div className="relative w-20 h-20">
                  <Image
                    src={studentData.imageUrl}
                    alt="Foto do aluno"
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-[#141414] flex items-center justify-center">
                  <span className="text-gray-500 dark:text-gray-400">Sem foto</span>
                </div>
              )}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Alterar foto
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100
                    dark:file:bg-[#141414] dark:file:text-blue-300
                    dark:hover:file:bg-gray-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nome Completo *
                </label>
                <Input
                  type="text"
                  value={studentData.name}
                  onChange={(e) => setStudentData({ ...studentData, name: e.target.value })}
                  className="bg-blue-50 dark:bg-[#141414] dark:border-[#141414] dark:text-white"
                  maxLength={100}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Data de Nascimento *
                </label>
                <Input
                  type="date"
                  value={studentData.birthDate || ""}
                  onChange={(e) => setStudentData({ ...studentData, birthDate: e.target.value })}
                  className="bg-blue-50 dark:bg-[#141414] dark:border-[#141414] dark:text-white"
                  min="1900-01-01"
                  max={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email *
                </label>
                <Input
                  type="email"
                  value={studentData.email}
                  onChange={(e) => setStudentData({ ...studentData, email: e.target.value })}
                  className="bg-blue-50 dark:bg-[#141414] dark:border-[#141414] dark:text-white"
                  maxLength={100}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Telefone *
                </label>
                <Input
                  type="tel"
                  value={studentData.phone}
                  onChange={handlePhoneChange}
                  className="bg-blue-50 dark:bg-[#141414] dark:border-[#141414] dark:text-white"
                  maxLength={15}
                  placeholder="(00) 00000-0000"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Matrícula
                </label>
                <Input
                  type="text"
                  value={studentData.identifierCode}
                  onChange={(e) => setStudentData({ ...studentData, identifierCode: e.target.value })}
                  className="bg-blue-50 dark:bg-[#141414] dark:border-[#141414] dark:text-white"
                />
              </div>
            </div>

            <div className="flex justify-center pt-6">
              <Button
                className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-md transition-colors"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">↻</span>
                    Salvando...
                  </span>
                ) : "Salvar Alterações"}
              </Button>
            </div>
          </div>
        </main>
      </div>

      <ModalCreate
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        message="Atualizando dados do aluno..."
      />
    </>
  );
}