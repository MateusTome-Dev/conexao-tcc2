"use client";
import Sidebar from "@/components/layout/sidebarInstitution";
import { Button } from "@/components/ui/institution/buttonSubmit";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Input } from "@/components/ui/institution/input";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
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
  
  const [nomeDocente, setNomeDocente] = useState("");
  const [emailDocente, setEmailDocente] = useState("");
  const [dataNascimentoDocente, setDataNascimentoDocente] = useState("");
  const [telefoneDocente, setTelefoneDocente] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const getTodayDateString = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatApiDate = (apiDate: string) => {
    if (!apiDate) return "";
    return apiDate.split(' ')[0];
  };

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    fetch(`https://backendona-amfeefbna8ebfmbj.eastus2-01.azurewebsites.net/api/teacher/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setImageUrl(data.imageUrl);
        setNomeDocente(data.nomeDocente || "");
        setEmailDocente(data.emailDocente || "");
        setDataNascimentoDocente(formatApiDate(data.dataNascimentoDocente) || "");
        setTelefoneDocente(data.telefoneDocente || "");
      })
      .catch((error) => {
        console.error("Erro ao buscar dados do docente:", error);
        setError("Erro ao carregar dados do docente.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const validateDate = (dateString: string): boolean => {
    if (!dateString) return false;
    
    const selectedDate = new Date(dateString);
    const minDate = new Date("1900-01-01");
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < minDate) {
      toast.warn("A data de nascimento não pode ser anterior a 1900");
      return false;
    }
    if (selectedDate > today) {
      toast.warn("A data de nascimento não pode ser posterior ao dia atual");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nomeDocente || !emailDocente || !dataNascimentoDocente || !telefoneDocente) {
      toast.warn("Preencha todos os campos obrigatórios.");
      return;
    }

    if (!validateDate(dataNascimentoDocente)) {
      return;
    }

    setIsModalOpen(true);

    try {
      const response = await fetch(`https://backendona-amfeefbna8ebfmbj.eastus2-01.azurewebsites.net/api/teacher/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nomeDocente,
          emailDocente,
          dataNascimentoDocente,
          telefoneDocente,
        }),
      });

      if (!response.ok) throw new Error("Erro ao atualizar o perfil.");

      toast.success("✅ Perfil atualizado com sucesso!");
      setTimeout(() => {
        router.push("/institution/teacher");
      }, 2000);
    } catch (error) {
      console.error("❌ Erro ao atualizar docente:", error);
      toast.error("Erro ao atualizar perfil.");
    } finally {
      setIsModalOpen(false);
    }
  };

  const getCurrentDate = () => {
    const today = new Date();
    return today.toLocaleDateString("pt-BR", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-blue-500">Editar docente</h1>
            <p className="text-gray-500">{getCurrentDate()}</p>
            <Button onClick={toggleTheme}>
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </Button>
          </div>

          <div className="container mx-auto p-6 space-y-6 max-w-5xl bg-white dark:bg-black rounded-3xl">
            <Image
              src={
                imageUrl ||
                "https://img.freepik.com/free-vector/isolated-young-handsome-man-different-poses-white-background-illustration_632498-855.jpg"
              }
              alt="Profile"
              width={80}
              height={80}
              className="rounded-full"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  label: "Nome Completo",
                  state: nomeDocente,
                  setState: setNomeDocente,
                  maxLength: 100,
                  type: "text"
                },
                {
                  label: "Data de Nascimento",
                  state: dataNascimentoDocente,
                  setState: setDataNascimentoDocente,
                  type: "date",
                  min: "1900-01-01",
                  max: getTodayDateString()
                },
                {
                  label: "Email",
                  state: emailDocente,
                  setState: setEmailDocente,
                  maxLength: 100,
                  type: "email"
                },
                {
                  label: "Telefone",
                  state: telefoneDocente,
                  setState: setTelefoneDocente,
                  maxLength: 20,
                  type: "tel"
                }
              ].map(({ label, state, setState, maxLength, type, min, max }) => (
                <div key={label} className="space-y-2">
                  <label className="text-sm text-muted-foreground dark:text-white">
                    {label}
                  </label>
                  <Input
                    type={type}
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="bg-blue-50 dark:bg-[#141414] dark:border-[#141414] dark:text-[#F0F7FF]"
                    maxLength={maxLength}
                    min={min}
                    max={max}
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-center">
              <Button
                className="bg-blue-500 hover:bg-blue-600 text-white px-8"
                onClick={handleSubmit}
              >
                Editar docente
              </Button>
            </div>
          </div>
        </main>
      </div>
      
      <ModalCreate isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} message="Editando docente..." />
    </>
  );
}
