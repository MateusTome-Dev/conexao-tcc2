"use client";
import Sidebar from "@/components/layout/sidebarInstitution";
import { Button } from "@/components/ui/institution/buttonSubmit";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/institution/input";
import { Checkbox } from "@/components/ui/institution/checkbox";
import { useParams } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";
import ModalCreate from "@/components/modals/modalCreate";
import InputImage from "@/components/ui/institution/InputImage";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import User from "@/assets/images/adicionar-usuario 1.png";

// Constants and interfaces
interface Disciplina {
  id: number;
  nomeDisciplina: string;
}

const LIMITES_CAMPOS = {
  nomeDocente: 50,
  telefoneDocente: 15, // Formatted phone: (XX) XXXXX-XXXX
  emailDocente: 100,
  maxImageSize: 2 * 1024 * 1024, // 2MB
  minAge: 18, // Minimum age required
};

// Validation functions
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

const validatePhone = (phone: string): boolean => {
  const cleanedPhone = phone.replace(/\D/g, '');
  return cleanedPhone.length >= 10 && cleanedPhone.length <= 11;
};

const validateName = (name: string): boolean => {
  return name.trim().length >= 3 && 
         /^[a-zA-ZÀ-ÿ\s']+$/.test(name) &&
         name.length <= LIMITES_CAMPOS.nomeDocente;
};

const validateBirthDate = (dateString: string): { valid: boolean; message?: string } => {
  if (!dateString) return { valid: false, message: "Data de nascimento é obrigatória" };

  const birthDate = new Date(dateString);
  const minDate = new Date("1900-01-01");
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (birthDate < minDate) {
    return { valid: false, message: "Data de nascimento não pode ser anterior a 1900" };
  }
  if (birthDate > today) {
    return { valid: false, message: "Data de nascimento não pode ser futura" };
  }

  // Validate minimum age (18 years)
  const minAgeDate = new Date();
  minAgeDate.setFullYear(minAgeDate.getFullYear() - LIMITES_CAMPOS.minAge);
  if (birthDate > minAgeDate) {
    return { valid: false, message: `O docente deve ter pelo menos ${LIMITES_CAMPOS.minAge} anos` };
  }

  return { valid: true };
};

export default function Profile() {
  const params = useParams();
  const id = params.id as string;
  
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nomeDocente, setName] = useState("");
  const [emailDocente, setEmail] = useState("");
  const [dataNascimentoDocente, setBirthDate] = useState("");
  const [telefoneDocente, setPhone] = useState("");
  const [imageUrl, setImagemPerfil] = useState<string | null>(null);
  const [disciplineId, setDisciplineId] = useState<number[]>([]);
  const { darkMode, toggleTheme } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getTodayDateString = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatCurrentDate = (): string => {
    const today = new Date();
    return today.toLocaleDateString("pt-BR", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handlePhoneChange = (value: string) => {
    const cleanedValue = value.replace(/\D/g, '');
    let formattedValue = '';
    
    if (cleanedValue.length > 0) {
      formattedValue = `(${cleanedValue.substring(0, 2)}`;
      if (cleanedValue.length > 2) {
        formattedValue += `) ${cleanedValue.substring(2, 7)}`;
        if (cleanedValue.length > 7) {
          formattedValue += `-${cleanedValue.substring(7, 11)}`;
        }
      }
    }
    
    setPhone(formattedValue);
  };

  const handleEmailChange = (value: string) => {
    const cleanedValue = value.replace(/\s/g, '');
    setEmail(cleanedValue);
  };

  const handleDisciplineSelection = (id: number) => {
    setDisciplineId((prev) =>
      prev.includes(id) ? prev.filter((did) => did !== id) : [...prev, id]
    );
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;

    const file = event.target.files[0];
    if (file.size > LIMITES_CAMPOS.maxImageSize) {
      toast.warn(`A imagem deve ter no máximo ${LIMITES_CAMPOS.maxImageSize / (1024 * 1024)}MB`);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setImagemPerfil(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate required fields
    if (!nomeDocente.trim() || !emailDocente || !dataNascimentoDocente || !telefoneDocente) {
      toast.warn("Preencha todos os campos obrigatórios.");
      setIsSubmitting(false);
      return;
    }

    // Validate name
    if (!validateName(nomeDocente)) {
      if (nomeDocente.trim().length < 3) {
        toast.warn("Nome deve ter pelo menos 3 caracteres");
      } else if (!/^[a-zA-ZÀ-ÿ\s']+$/.test(nomeDocente)) {
        toast.warn("Nome deve conter apenas letras e espaços");
      } else {
        toast.warn(`Nome deve ter no máximo ${LIMITES_CAMPOS.nomeDocente} caracteres`);
      }
      setIsSubmitting(false);
      return;
    }

    // Validate email
    if (!validateEmail(emailDocente)) {
      if (emailDocente.includes(' ')) {
        toast.warn("Email não pode conter espaços");
      } else if (emailDocente.length > LIMITES_CAMPOS.emailDocente) {
        toast.warn(`Email deve ter no máximo ${LIMITES_CAMPOS.emailDocente} caracteres`);
      } else {
        toast.warn("Por favor, insira um email válido");
      }
      setIsSubmitting(false);
      return;
    }

    // Validate birth date
    const birthDateValidation = validateBirthDate(dataNascimentoDocente);
    if (!birthDateValidation.valid) {
      toast.warn(birthDateValidation.message);
      setIsSubmitting(false);
      return;
    }

    // Validate phone
    if (!validatePhone(telefoneDocente)) {
      toast.warn("Telefone deve ter 10 ou 11 dígitos (com DDD)");
      setIsSubmitting(false);
      return;
    }

    // Validate at least one discipline selected
    if (disciplineId.length === 0) {
      toast.warn("Selecione pelo menos uma disciplina");
      setIsSubmitting(false);
      return;
    }

    // Validate image size (if provided)
    if (imageUrl && imageUrl.length > 5 * 1024 * 1024) { // Rough base64 size check
      toast.warn("A imagem é muito grande. Por favor, selecione uma imagem menor.");
      setIsSubmitting(false);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.warn("Usuário não autenticado. Faça login novamente.");
      setIsSubmitting(false);
      return;
    }

    try {
      setIsModalOpen(true);
      
      const cleanedPhone = telefoneDocente.replace(/\D/g, '');
      
      const response = await fetch("https://backendona-amfeefbna8ebfmbj.eastus2-01.azurewebsites.net/api/teacher", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nomeDocente: nomeDocente.trim(),
          emailDocente,
          dataNascimentoDocente,
          telefoneDocente: cleanedPhone,
          imageUrl,
          disciplineId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao criar o perfil");
      }

      toast.success("Perfil criado com sucesso!");
      // Reset form
      setName("");
      setEmail("");
      setBirthDate("");
      setPhone("");
      setImagemPerfil(null);
      setDisciplineId([]);
    } catch (error) {
      console.error("❌ Erro ao criar perfil:", error);
      if (error.message.includes("email")) {
        toast.error("Este email já está cadastrado");
      } else {
        toast.error(error.message || "Erro ao criar perfil");
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
        <main className="flex-1">
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold text-blue-500">
                  Criar Docente
                </h1>
                <p className="text-gray-500">{formatCurrentDate()}</p>
              </div>
              <Button onClick={toggleTheme}>
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </Button>
            </div>

            <div className="container mx-auto p-6 space-y-6 max-w-5xl h-1/2 bg-[#ffffff] dark:bg-black rounded-3xl">
              <div className="flex flex-col items-center gap-4">
                <Image
                  src={imageUrl || User}
                  width={80}
                  height={80}
                  className="rounded-full w-16 h-16 sm:w-20 sm:h-20"
                  alt="Foto de perfil"
                />
                <InputImage onChange={handleImageChange} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground dark:text-gray-400">
                    Nome Completo *
                  </label>
                  <Input
                    type="text"
                    value={nomeDocente}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-blue-50 border-blue-50 dark:bg-[#141414] dark:border-[#141414] dark:text-white"
                    maxLength={LIMITES_CAMPOS.nomeDocente}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground dark:text-gray-400">
                    Data de Nascimento *
                  </label>
                  <Input
                    type="date"
                    value={dataNascimentoDocente}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="bg-blue-50 border-blue-50 dark:bg-[#141414] dark:border-[#141414] dark:text-white"
                    min="1900-01-01"
                    max={getTodayDateString()}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground dark:text-gray-400">
                    Email *
                  </label>
                  <Input
                    type="email"
                    value={emailDocente}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    className="bg-blue-50 border-blue-50 dark:bg-[#141414] dark:border-[#141414] dark:text-white"
                    maxLength={LIMITES_CAMPOS.emailDocente}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground dark:text-gray-400">
                    Telefone *
                  </label>
                  <Input
                    type="tel"
                    value={telefoneDocente}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    className="bg-blue-50 border-blue-50 dark:bg-[#141414] dark:border-[#141414] dark:text-white"
                    maxLength={15}
                    placeholder="(XX) XXXXX-XXXX"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm text-muted-foreground mb-4 dark:text-gray-400">
                    Seleção de disciplinas *
                  </h3>
                  {loading ? (
                    <p>Carregando disciplinas...</p>
                  ) : error ? (
                    <p className="text-red-500">{error}</p>
                  ) : (
                    <div className="space-y-3">
                      {disciplinas.map((disciplina) => (
                        <div
                          key={disciplina.id}
                          className="flex items-center space-x-2 dark:text-white"
                        >
                          <Checkbox
                            id={`disciplina-${disciplina.id}`}
                            checked={disciplineId.includes(disciplina.id)}
                            onCheckedChange={() =>
                              handleDisciplineSelection(disciplina.id)
                            }
                          />
                          <label htmlFor={`disciplina-${disciplina.id}`}>
                            {disciplina.nomeDisciplina}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-center">
                <Button
                  className="bg-blue-500 hover:bg-blue-600 text-white px-8"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Criando..." : "Criar professor"}
                </Button>
              </div>
            </div>
          </div>
          
          <ModalCreate
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            message="Criando docente..."
          />
        </main>
      </div>
    </>
  );
}