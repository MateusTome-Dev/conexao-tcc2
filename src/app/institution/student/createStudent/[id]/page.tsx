"use client";

import Sidebar from "@/components/layout/sidebarInstitution";
import { Button } from "@/components/ui/institution/buttonSubmit";
import { useEffect, useState } from "react";
import { Moon, Sun, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/institution/input";
import { useParams } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";
import ModalCreate from "@/components/modals/modalCreate";
import InputImage from "@/components/ui/institution/InputImage";
import User from "@/assets/images/adicionar-usuario 1.png";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";

interface Turma {
  id: number;
  nomeTurma: string;
}

const LIMITES_CAMPOS = {
  nomeAluno: 50,
  telefoneAluno: 11, // Máximo 11 dígitos (com DDD)
  emailAluno: 100,
};

export default function Profile({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [nomeAluno, setName] = useState("");
  const [emailAluno, setEmail] = useState("");
  const [dataNascimentoAluno, setBirthDate] = useState("");
  const [telefoneAluno, setPhone] = useState("");
  const [turma, setTurma] = useState("");
  const { darkMode, toggleTheme } = useTheme();
  const [imageUrl, setImagemPerfil] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const validateEmail = (email: string): boolean => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (email.length < 5) return false;
    if (email.includes(" ")) return false;
    if (email.length > LIMITES_CAMPOS.emailAluno) return false;

    const parts = email.split("@");
    if (parts.length !== 2) return false;
    if (parts[1].indexOf(".") === -1) return false;

    return regex.test(email);
  };

  const handleDateChange = (value: string) => {
    setBirthDate(value);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;

    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setImagemPerfil(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const validatePhone = (phone: string) => {
    const cleanedPhone = phone.replace(/\D/g, "");
    return cleanedPhone.length >= 10 && cleanedPhone.length <= 11;
  };

  const validateName = (name: string) => {
    return name.trim().length >= 3 && /^[a-zA-ZÀ-ÿ\s']+$/.test(name);
  };

  const handlePhoneChange = (value: string) => {
    const cleanedValue = value.replace(/\D/g, "");
    let formattedValue = "";

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
    const cleanedValue = value.replace(/\s/g, "");
    setEmail(cleanedValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (
      !nomeAluno.trim() ||
      !emailAluno ||
      !dataNascimentoAluno ||
      !telefoneAluno
    ) {
      toast.warn("Preencha todos os campos obrigatórios.");
      setIsSubmitting(false);
      return;
    }

    if (!validateName(nomeAluno)) {
      toast.warn(
        "Nome deve conter apenas letras e ter pelo menos 3 caracteres"
      );
      setIsSubmitting(false);
      return;
    }

    if (nomeAluno.length > LIMITES_CAMPOS.nomeAluno) {
      toast.warn(
        `Nome deve ter no máximo ${LIMITES_CAMPOS.nomeAluno} caracteres`
      );
      setIsSubmitting(false);
      return;
    }

    if (!validateEmail(emailAluno)) {
      if (emailAluno.includes(" ")) {
        toast.warn("Email não pode conter espaços");
      } else if (emailAluno.length > LIMITES_CAMPOS.emailAluno) {
        toast.warn(
          `Email deve ter no máximo ${LIMITES_CAMPOS.emailAluno} caracteres`
        );
      } else {
        toast.warn("Por favor, insira um email válido");
      }
      setIsSubmitting(false);
      return;
    }

    const birthDate = new Date(dataNascimentoAluno);
    const minDate = new Date("1900-01-01");
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (birthDate < minDate) {
      toast.warn("Data de nascimento não pode ser anterior a 1900");
      setIsSubmitting(false);
      return;
    }

    if (birthDate > today) {
      toast.warn("Data de nascimento não pode ser futura");
      setIsSubmitting(false);
      return;
    }

    if (!validatePhone(telefoneAluno)) {
      toast.warn("Telefone deve ter 10 ou 11 dígitos (com DDD)");
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
      const cleanedPhone = telefoneAluno.replace(/\D/g, "");

      const response = await fetch(
        "https://onacademy-e2h7csembwhrf2bu.brazilsouth-01.azurewebsites.net/api/student",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nomeAluno: nomeAluno.trim(),
            emailAluno,
            dataNascimentoAluno,
            telefoneAluno: cleanedPhone,
            turmaId: id,
            imageUrl,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao criar o perfil");
      } else if (response.status === 400) {
        toast.warn(
          "Email já cadastrado! Por favor, utilize um email diferente."
        );
      }

      toast.success("Perfil criado com sucesso!");
      setName("");
      setEmail("");
      setBirthDate("");
      setPhone("");
      setImagemPerfil("");
    } catch (error) {
      console.error("Erro ao criar perfil:", error);
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

  useEffect(() => {
    fetch(
      `https://onacademy-e2h7csembwhrf2bu.brazilsouth-01.azurewebsites.net/api/class/teacher/disciplinas/${id}`
    )
      .then((response) => response.json())
      .then((data) => setTurma(data))
      .catch((error) => console.error("Erro ao buscar turma:", error));
  }, [id]);

  return (
    <>
      <ToastContainer />
      <div className="flex min-h-screen bg-[#F0F7FF] dark:bg-[#141414]">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors text-blue-500 dark:text-blue-400"
            >
              <ArrowLeft size={20} />
              <span className="hidden sm:inline">Voltar</span>
            </button>

            <div className="flex-1 text-center mx-4 min-w-0">
              <h1 className="text-2xl font-bold text-blue-500 dark:text-blue-400 truncate">
                Criar Aluno
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                Preencha os campos abaixo para criar aluno.
              </p>
            </div>

            <Button
              onClick={toggleTheme}
              variant="ghost"
              size="icon"
              aria-label="Alternar tema"
              className="hover:bg-blue-50 dark:hover:bg-gray-800"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </Button>
          </div>

          <div className="container mx-auto p-6 space-y-6 max-w-5xl bg-white dark:bg-black rounded-3xl">
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
                <label className="text-sm text-muted-foreground dark:text-gray-500">
                  Nome Completo
                </label>
                <Input
                  type="text"
                  value={nomeAluno}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-blue-50 dark:bg-[#141414] dark:text-white dark:border-[#141414]"
                  maxLength={LIMITES_CAMPOS.nomeAluno}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-muted-foreground dark:text-gray-500">
                  Data de Nascimento
                </label>
                <Input
                  type="date"
                  value={dataNascimentoAluno}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="bg-blue-50 dark:bg-[#141414] dark:text-white dark:border-[#141414]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-muted-foreground dark:text-gray-500">
                  Email
                </label>
                <Input
                  type="email"
                  value={emailAluno}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  className="bg-blue-50 dark:bg-[#141414] dark:text-white dark:border-[#141414]"
                  placeholder="exemplo@dominio.com"
                  maxLength={LIMITES_CAMPOS.emailAluno}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-muted-foreground dark:text-gray-500">
                  Telefone
                </label>
                <Input
                  type="text"
                  value={telefoneAluno}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  className="bg-blue-50 dark:bg-[#141414] dark:text-white dark:border-[#141414]"
                  maxLength={15}
                  placeholder="(XX) XXXXX-XXXX"
                />
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                className="bg-blue-500 hover:bg-blue-600 text-white px-8"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Criando..." : "Criar estudante"}
              </Button>
            </div>
          </div>

          <ModalCreate
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            message="Criando aluno..."
          />
        </main>
      </div>
    </>
  );
}
