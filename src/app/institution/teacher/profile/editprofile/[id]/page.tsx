"use client";
// Importing necessary components and libraries
import Sidebar from "@/components/layout/sidebarInstitution";
import { Button } from "@/components/ui/institution/buttonSubmit";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Input } from "@/components/ui/institution/input";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/institution/checkbox";
import { useTheme } from "@/components/ThemeProvider";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import ModalCreate from "@/components/modals/modalCreate";

// Interface defining the structure of a Discipline object
interface Disciplina {
  id: number;
  nomeDisciplina: string;
}

// Main component for editing teacher profile
export default function Profile({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  // Getting URL parameters and initializing hooks
  const params = useParams();
  const id = params.id as string;
  const { darkMode, toggleTheme } = useTheme();
  
  // State variables for form fields and component state
  const [nomeDocente, setNomeDocente] = useState("");
  const [emailDocente, setEmailDocente] = useState("");
  const [dataNascimentoDocente, setDataNascimentoDocente] = useState("");
  const [telefoneDocente, setTelefoneDocente] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [disciplineId, setDisciplineId] = useState<number[]>([]);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  // Function to get today's date in YYYY-MM-DD format
  const getTodayDateString = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Function to format API date to YYYY-MM-DD format
  const formatApiDate = (apiDate: string) => {
    if (!apiDate) return "";
    return apiDate.split(' ')[0];
  };

  // Effect to fetch available disciplines on component mount
  useEffect(() => {
    setLoading(true);
    fetch("https://backendona-amfeefbna8ebfmbj.eastus2-01.azurewebsites.net/api/discipline")
      .then((response) => response.json())
      .then((data: Disciplina[]) => {
        setDisciplinas(data);
        setError(null);
      })
      .catch((error) => {
        console.error("Erro ao buscar disciplinas:", error);
        setError("Erro ao carregar disciplinas. Tente novamente mais tarde.");
      })
      .finally(() => setLoading(false));
  }, []);

  // Effect to fetch teacher data when ID changes
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
        if (data.disciplinas && Array.isArray(data.disciplinas)) {
          setDisciplineId(data.disciplinas.map((d: Disciplina) => d.id));
        }
      })
      .catch((error) => {
        console.error("Erro ao buscar dados do docente:", error);
        setError("Erro ao carregar dados do docente. Tente novamente mais tarde.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  // Function to handle discipline selection/deselection
  const handleDisciplineSelection = (id: number) => {
    setDisciplineId((prev) =>
      prev.includes(id) ? prev.filter((did) => did !== id) : [...prev, id]
    );
  };

  // Function to validate birth date
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

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic form validation
    if (!nomeDocente || !emailDocente || !dataNascimentoDocente || !telefoneDocente || disciplineId.length === 0) {
      toast.warn("Preencha todos os campos obrigatórios.");
      return;
    }

    // Date validation
    if (!validateDate(dataNascimentoDocente)) {
      return;
    }

    setIsModalOpen(true);

    try {
      // API call to update teacher data
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
          disciplineId,
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

  // Function to get current date in formatted string
  const getCurrentDate = () => {
    const today = new Date();
    return today.toLocaleDateString("pt-BR", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Effect to apply dark mode theme
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Render the component
  return (
    <>
      {/* Toast notification container */}
      <ToastContainer />
      
      {/* Main page container */}
      <div className="flex min-h-screen bg-[#F0F7FF] dark:bg-[#141414]">
        {/* Sidebar component */}
        <Sidebar />
        
        {/* Main content area */}
        <main className="flex-1 p-8">
          {/* Header section with title, date and theme toggle */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-blue-500">Editar docente</h1>
            <p className="text-gray-500">{getCurrentDate()}</
            p>
            <Button onClick={toggleTheme}>
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </Button>
          </div>

          {/* Form container */}
          <div className="container mx-auto p-6 space-y-6 max-w-5xl bg-white dark:bg-black rounded-3xl">
            {/* Profile image */}
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

            {/* Form fields grid */}
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

            {/* Disciplines selection section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm text-muted-foreground mb-4 dark:text-white">
                  Seleção de disciplinas
                </h3>
                {loading ? (
                  <p className="dark:text-white">Carregando disciplinas...</p>
                ) : error ? (
                  <p className="text-red-500">{error}</p>
                ) : (
                  <div className="space-y-3">
                    {disciplinas.map((disciplina) => (
                      <div
                        key={disciplina.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`disciplina-${disciplina.id}`}
                          checked={disciplineId.includes(disciplina.id)}
                          onCheckedChange={() =>
                            handleDisciplineSelection(disciplina.id)
                          }
                        />
                        <label
                          htmlFor={`disciplina-${disciplina.id}`}
                          className="dark:text-white"
                        >
                          {disciplina.nomeDisciplina}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Submit button */}
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
      
      {/* Loading modal */}
      <ModalCreate isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} message="Editando docente..." />
    </>
  );
}