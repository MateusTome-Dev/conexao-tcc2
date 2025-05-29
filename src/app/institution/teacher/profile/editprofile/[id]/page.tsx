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

// CONSTANTS AND VALIDATION FUNCTIONS
const LIMITES_CAMPOS = {
  nomeDocente: 50,
  telefoneDocente: 11, // Máximo 11 dígitos (com DDD)
  emailDocente: 100
};

const validateEmail = (email: string): boolean => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  if (email.length < 5) return false;
  if (email.includes(' ')) return false;
  if (email.length > LIMITES_CAMPOS.emailDocente) return false;
  
  const parts = email.split('@');
  if (parts.length !== 2) return false;
  if (parts[1].indexOf('.') === -1) return false;
  
  return regex.test(email);
};

const validatePhone = (phone: string) => {
  const cleanedPhone = phone.replace(/\D/g, '');
  return cleanedPhone.length >= 10 && cleanedPhone.length <= 11;
};

const validateName = (name: string) => {
  return name.trim().length >= 3 && /^[a-zA-ZÀ-ÿ\s']+$/.test(name);
};

interface TeacherData {
  id: number;
  name: string;
  email: string;
  birthDate: string;
  phone: string;
  imageUrl: string;
}

export default function TeacherProfileEdit() {
  const params = useParams();
  const id = params.id as string;
  const { darkMode, toggleTheme } = useTheme();
  const router = useRouter();

  const [teacherData, setTeacherData] = useState<TeacherData>({
    id: 0,
    name: "",
    email: "",
    birthDate: "",
    phone: "",
    imageUrl: ""
  });

  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    const day = String(date.getDate()).padStart(2, '0');

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
    setTeacherData({ ...teacherData, phone: formattedPhone });
  };

  const validateDate = (dateString: string): boolean => {
    if (!dateString) return false;

    const selectedDate = new Date(dateString);
    const minDate = new Date("1900-01-01");
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Validação de idade mínima (18 anos)
    const minAgeDate = new Date();
    minAgeDate.setFullYear(minAgeDate.getFullYear() - 18);

    if (selectedDate < minDate) {
      toast.warn("Data de nascimento não pode ser anterior a 1900");
      return false;
    }
    if (selectedDate > today) {
      toast.warn("Data de nascimento não pode ser no futuro");
      return false;
    }
    if (selectedDate > minAgeDate) {
      toast.warn("O docente deve ter pelo menos 18 anos");
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (!id) return;

    const fetchTeacherData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://onacademy-e2h7csembwhrf2bu.brazilsouth-01.azurewebsites.net/api/teacher/${id}`
        );
        if (!response.ok) throw new Error("Falha ao buscar dados do professor");

        const data = await response.json();

        console.log("Dados brutos do backend:", data);
        console.log("Data de nascimento recebida:", data.dataNascimentoDocente);
        console.log("Data formatada:", formatDateForInput(data.dataNascimentoDocente));

        setTeacherData({
          id: data.id,
          name: data.nomeDocente || "",
          email: data.emailDocente || "",
          birthDate: formatDateForInput(data.dataNascimentoDocente) || "",
          phone: data.telefoneDocente || "",
          imageUrl: data.imageUrl || ""
        });
      } catch (error) {
        console.error("Erro ao buscar dados do professor:", error);
        toast.error("Falha ao carregar dados do professor");
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validação de campos obrigatórios
    if (!teacherData.name.trim() || !teacherData.email || 
        !teacherData.birthDate || !teacherData.phone) {
      toast.warn("Preencha todos os campos obrigatórios.");
      setIsSubmitting(false);
      return;
    }

    // Validação do nome
    if (!validateName(teacherData.name)) {
      toast.warn("Nome deve conter apenas letras e ter pelo menos 3 caracteres");
      setIsSubmitting(false);
      return;
    }

    if (teacherData.name.length > LIMITES_CAMPOS.nomeDocente) {
      toast.warn(`Nome deve ter no máximo ${LIMITES_CAMPOS.nomeDocente} caracteres`);
      setIsSubmitting(false);
      return;
    }

    // Validação do email
    if (!validateEmail(teacherData.email)) {
      if (teacherData.email.includes(' ')) {
        toast.warn("Email não pode conter espaços");
      } else if (teacherData.email.length > LIMITES_CAMPOS.emailDocente) {
        toast.warn(`Email deve ter no máximo ${LIMITES_CAMPOS.emailDocente} caracteres`);
      } else {
        toast.warn("Por favor, insira um email válido (exemplo: nome@dominio.com)");
      }
      setIsSubmitting(false);
      return;
    }

    // Validação da data de nascimento
    if (!validateDate(teacherData.birthDate)) {
      setIsSubmitting(false);
      return;
    }

    // Validação do telefone
    if (!validatePhone(teacherData.phone)) {
      toast.warn("Telefone deve ter 10 ou 11 dígitos (com DDD)");
      setIsSubmitting(false);
      return;
    }

    setIsModalOpen(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.warn("Usuário não autenticado. Faça login novamente.");
        setIsSubmitting(false);
        setIsModalOpen(false);
        return;
      }

      const response = await fetch(
        `https://onacademy-e2h7csembwhrf2bu.brazilsouth-01.azurewebsites.net/api/teacher/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            imageUrl: teacherData.imageUrl,
            nomeDocente: teacherData.name.trim(),
            emailDocente: teacherData.email,
            dataNascimentoDocente: formatDateForBackend(teacherData.birthDate),
            telefoneDocente: teacherData.phone.replace(/\D/g, "")
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Falha ao atualizar professor");
      } else if (response.status === 400) {
        toast.warn("Email já cadastrado! Por favor, utilize um email diferente.");
      }

      toast.success("Professor atualizado com sucesso!");
      setTimeout(() => {
        router.push("/institution/teacher");
      }, 2000);
    } catch (error) {
      console.error("Erro ao atualizar professor:", error);
      if (error instanceof Error && error.message.includes("email")) {
        toast.error("Este email já está cadastrado");
      } else {
        toast.error(error instanceof Error ? error.message : "Erro ao atualizar professor");
      }
    } finally {
      setIsSubmitting(false);
      setIsModalOpen(false);
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
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors text-blue-500 dark:text-blue-400 flex-shrink-0"
            >
              <ArrowLeft size={20} />
              <span className="hidden sm:inline">Voltar</span>
            </button>
            <div className="flex items-center justify-between">
            <div className="flex-1 text-center mx-4 min-w-0">
              <h1 className="text-2xl font-bold text-blue-500 dark:text-blue-400 truncate">
                Editar Teacher
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                Preencha os campos abaixo para editar docente.
              </p>
            </div>

            <Button
              onClick={toggleTheme}
              variant="ghost"
              size="icon"
              aria-label="Alternar tema"
              className="flex-shrink-0"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </Button>
          </div>
</div>
          <div className="container mx-auto p-6 space-y-6 max-w-5xl bg-white dark:bg-black rounded-lg shadow">
            <div className="flex items-center gap-4">
              {teacherData.imageUrl ? (
                <div className="relative w-20 h-20">
                  <Image
                    src={teacherData.imageUrl}
                    alt="Foto do professor"
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
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      const file = e.target.files[0];
                      if (file.size > 2 * 1024 * 1024) {
                        toast.warn("A imagem deve ter no máximo 2MB");
                        return;
                      }
                      const reader = new FileReader();
                      reader.onload = (event) =>
                        setTeacherData({ ...teacherData, imageUrl: event.target?.result as string });
                      reader.readAsDataURL(file);
                    }
                  }}
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
                  value={teacherData.name}
                  onChange={(e) => setTeacherData({ ...teacherData, name: e.target.value })}
                  className="bg-blue-50 dark:bg-[#141414] dark:border-[#141414] dark:text-white"
                  maxLength={LIMITES_CAMPOS.nomeDocente}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Data de Nascimento *
                </label>
                <Input
                  type="date"
                  value={teacherData.birthDate || ""}
                  onChange={(e) => setTeacherData({ ...teacherData, birthDate: e.target.value })}
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
                  value={teacherData.email}
                  onChange={(e) => setTeacherData({ ...teacherData, email: e.target.value.replace(/\s/g, '') })}
                  className="bg-blue-50 dark:bg-[#141414] dark:border-[#141414] dark:text-white"
                  maxLength={LIMITES_CAMPOS.emailDocente}
                  placeholder="exemplo@dominio.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Telefone *
                </label>
                <Input
                  type="tel"
                  value={teacherData.phone}
                  onChange={handlePhoneChange}
                  className="bg-blue-50 dark:bg-[#141414] dark:border-[#141414] dark:text-white"
                  maxLength={15}
                  placeholder="(XX) XXXXX-XXXX"
                  required
                />
              </div>
            </div>

            <div className="flex justify-center pt-6">
              <Button
                className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-md transition-colors"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
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
        message="Atualizando dados do professor..."
      />
    </>
  );
}