"use client";
import Sidebar from "@/components/layout/sidebarInstitution";
import { Button } from "@/components/ui/institution/buttonSubmit";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Input } from "@/components/ui/institution/input";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import ModalCreate from "@/components/modals/modalCreate";

export default function Profile({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const params = useParams();
  const id = params.id as string;
  const { darkMode, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [nome, setName] = useState("");
  const [emailAluno, setEmail] = useState("");
  const [dataNascimentoAluno, setBirthDate] = useState("");
  const [telefoneAluno, setPhone] = useState("");
  const [turmaId, setTurma] = useState("");
  const [matriculaAluno, setidentifierCode] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Função para fazer chamadas à API com tratamento de CORS
  const fetchApi = async (url: string, options: RequestInit = {}) => {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Erro na requisição:", error);
      toast.error("Erro ao comunicar com o servidor");
      throw error;
    }
  };

  const validateDate = (dateString: string) => {
    if (!dateString) return true;

    const selectedDate = new Date(dateString);
    const minDate = new Date("1900-01-01");
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < minDate) {
      toast.warn("A data não pode ser anterior a 1900");
      return false;
    }
    if (selectedDate > today) {
      toast.warn("A data não pode ser posterior ao dia atual");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateDate(dataNascimentoAluno)) {
      return;
    }

    if (!nome || !emailAluno || !dataNascimentoAluno || !telefoneAluno) {
      toast.warn("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      setIsModalOpen(true);

      await fetchApi(
        `https://backendona-amfeefbna8ebfmbj.eastus2-01.azurewebsites.net/api/student/${id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            nomeAluno: nome,
            emailAluno,
            dataNascimentoAluno: formatDateForBackend(dataNascimentoAluno),
            telefoneAluno,
            turmaId,
            matriculaAluno,
          }),
        }
      );

      toast.success("✅ Perfil atualizado com sucesso!");
    } catch (error) {
      console.error("❌ Erro ao atualizar aluno:", error);
      toast.error("Erro ao atualizar perfil.");
    } finally {
      setIsModalOpen(false);
    }
  };

  const formatDateForBackend = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().replace("T", " ").substring(0, 19);
  };

  const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    if (!id) return;

    const loadStudentData = async () => {
      try {
        const data = await fetchApi(
          `https://backendona-amfeefbna8ebfmbj.eastus2-01.azurewebsites.net/api/student/${id}`
        );

        setImageUrl(data.imageUrl || "");
        setName(data.nome || "");
        setEmail(data.emailAluno || "");
        setBirthDate(data.dataNascimentoAluno || "");
        setPhone(data.telefoneAluno || "");
        setTurma(data.turmaId || "");
        setidentifierCode(data.matriculaAluno || "");
      } catch (error) {
        console.error("Erro ao buscar dados do aluno:", error);
      }
    };

    loadStudentData();
  }, [id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F0F7FF] dark:bg-[#141414]">
      <Sidebar />

      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-blue-500 dark:text-blue-400">
              Editar Aluno
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Preencha os campos abaixo para editar o aluno.
            </p>
          </div>
          <Button
            onClick={toggleTheme}
            variant="ghost"
            size="icon"
            aria-label="Alternar tema"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
        </div>

        <div className="container mx-auto p-6 space-y-6 max-w-5xl bg-white dark:bg-black rounded-3xl">
          <div className="flex items-center space-x-4">
            {imageUrl ? (
              <div className="relative w-20 h-20">
                <Image
                  src={imageUrl}
                  alt="Foto do aluno"
                  fill
                  className="rounded-full object-cover"
                />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-[#141414] flex items-center justify-center">
                <span className="text-gray-500 dark:text-gray-400">
                  Sem foto
                </span>
              </div>
            )}
            <div className="flex-1">
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
                  dark:file:bg-[#141414] dark:border-[#141414] dark:file:text-blue-300
                  dark:hover:file:bg-gray-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 dark:text-gray-400">
            {[
              {
                label: "Nome Completo",
                state: nome,
                setState: setName,
                type: "text",
              },
              {
                label: "Data de Nascimento",
                state: dataNascimentoAluno,
                setState: setBirthDate,
                type: "date",
              },
              {
                label: "Email",
                state: emailAluno,
                setState: setEmail,
                type: "email",
              },
              {
                label: "Telefone",
                state: telefoneAluno,
                setState: setPhone,
                type: "tel",
              },
              {
                label: "Matrícula",
                state: matriculaAluno,
                setState: setidentifierCode,
                type: "text",
              },
            ].map(({ label, state, setState, type }) => (
              <div key={label} className="space-y-2">
                <label className="text-sm text-muted-foreground">{label}</label>
                <Input
                  type={type}
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="bg-blue-50 dark:bg-[#141414] dark:border-[#141414]"
                  min={type === "date" ? "1900-01-01" : undefined}
                  max={type === "date" ? getTodayDateString() : undefined}
                  required={label !== "Matrícula"}
                />
              </div>
            ))}
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
              ) : (
                "Salvar Alterações"
              )}
            </Button>
          </div>
        </div>

        <ToastContainer position="bottom-right" autoClose={5000} />
        <ModalCreate
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </main>
    </div>
  );
}
