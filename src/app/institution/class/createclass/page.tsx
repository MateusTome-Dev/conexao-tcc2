"use client"; // Indica que este é um componente do lado do cliente no Next.js

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/institution/buttonSubmit";
import { Checkbox } from "@/components/ui/institution/checkbox";
import { Input } from "@/components/ui/institution/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/institution/select";
import Sidebar from "@/components/layout/sidebarInstitution";
import { useTheme } from "@/components/ThemeProvider";
import { Moon, Sun, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";

interface Docente {
  id: number;
  nomeDocente: string;
}

interface Disciplina {
  id: number;
  nomeDisciplina: string;
}

const LIMITES_CAMPOS = {
  nomeTurma: 50,
  salaTurma: 5,
  capacidadeMaxima: 40,
};

export default function CreateClass() {
  // Estados para armazenar os dados do formulário e seleções
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [nomeTurma, setNomeTurma] = useState("");
  const [anoLetivoTurma, setAnoLetivoTurma] = useState("");
  const [periodoTurma, setPeriodoTurma] = useState("");
  const [capacidadeTurma, setCapacidadeTurma] = useState("");
  const [salaTurma, setSalaTurma] = useState("");
  const [disciplineId, setDisciplineIds] = useState<number[]>([]);
  const [idTeacher, setIdTeachers] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { darkMode, toggleTheme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    // Buscar lista de professores
    const fetchDocentes = async () => {
      try {
        const response = await fetch(
          "https://backendona-amfeefbna8ebfmbj.eastus2-01.azurewebsites.net/api/teacher"
        );
        const data = await response.json();
        setDocentes(data);
      } catch (error) {
        console.error("Erro ao buscar docentes:", error);
        toast.error("Erro ao carregar lista de professores");
      }
    };

    // Buscar lista de disciplinas
    const fetchDisciplinas = async () => {
      try {
        const response = await fetch(
          "https://backendona-amfeefbna8ebfmbj.eastus2-01.azurewebsites.net/api/discipline"
        );
        const data = await response.json();
        setDisciplinas(data);
      } catch (error) {
        console.error("Erro ao buscar disciplinas:", error);
        toast.error("Erro ao carregar lista de disciplinas");
      }
    };

    fetchDocentes();
    fetchDisciplinas();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const handleTeacherSelection = (id: number) => {
    setIdTeachers((prev) =>
      prev.includes(id) ? prev.filter((tid) => tid !== id) : [...prev, id]
    );
  };

  const handleDisciplineSelection = (id: number) => {
    setDisciplineIds((prev) =>
      prev.includes(id) ? prev.filter((did) => did !== id) : [...prev, id]
    );
  };

  const validarCampos = (): boolean => {
    if (!nomeTurma.trim()) {
      toast.warn("Nome da turma é obrigatório");
      return false;
    }

    if (!anoLetivoTurma) {
      toast.warn("Ano letivo é obrigatório");
      return false;
    }

    if (!periodoTurma) {
      toast.warn("Período é obrigatório");
      return false;
    }

    if (!capacidadeTurma) {
      toast.warn("Capacidade é obrigatória");
      return false;
    }

    if (!salaTurma.trim()) {
      toast.warn("Sala é obrigatória");
      return false;
    }

    if (/[a-zA-Z]/.test(salaTurma)) {
      toast.warn("O número da sala NÃO pode conter letras");
      return false;
    }

    if (nomeTurma.length > LIMITES_CAMPOS.nomeTurma) {
      toast.warn(
        `Nome da turma deve ter no máximo ${LIMITES_CAMPOS.nomeTurma} caracteres`
      );
      return false;
    }

    if (salaTurma.length > LIMITES_CAMPOS.salaTurma) {
      toast.warn(
        `Sala deve ter no máximo ${LIMITES_CAMPOS.salaTurma} caracteres`
      );
      return false;
    }

    const capacidade = Number(capacidadeTurma);
    if (isNaN(capacidade)) {
      toast.warn("Capacidade deve ser um número válido");
      return false;
    }

    if (capacidade <= 0) {
      toast.warn("Capacidade deve ser maior que zero");
      return false;
    }

    if (capacidade > LIMITES_CAMPOS.capacidadeMaxima) {
      toast.warn(
        `Capacidade máxima permitida é ${LIMITES_CAMPOS.capacidadeMaxima}`
      );
      return false;
    }

    if (idTeacher.length === 0) {
      toast.warn("Selecione pelo menos um professor");
      return false;
    }

    if (disciplineId.length === 0) {
      toast.warn("Selecione pelo menos uma disciplina");
      return false;
    }

    return true;
  };

  const criarTurma = async () => {
    if (!validarCampos()) return;

    setIsSubmitting(true);
    const token = localStorage.getItem("token");

    if (!token) {
      toast.warn("Usuário não autenticado. Faça login novamente.");
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        nomeTurma,
        anoLetivoTurma: parseInt(anoLetivoTurma, 10),
        periodoTurma,
        capacidadeMaximaTurma: Number(capacidadeTurma),
        salaTurma,
        idTeacher,
        disciplineId,
      };

      const response = await fetch(
        "https://backendona-amfeefbna8ebfmbj.eastus2-01.azurewebsites.net/api/class",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao criar a turma");
      }

      toast.success("Turma criada com sucesso!");
      setTimeout(() => router.push("/institution/class"), 2000);
    } catch (error) {
      console.error("❌ Erro ao criar turma:", error);
      toast.error(error.message || "Erro ao criar turma");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className={`flex min-h-screen ${darkMode ? "bg-[#141414]" : "bg-[#F0F7FF]"}`}>
        <Sidebar />
        
        <main className="flex-1 p-4 md:p-8">
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
                Criar Turma
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                Preencha os campos abaixo para criar turma.
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

          <div className={`container mx-auto p-6 space-y-6 max-w-5xl rounded-3xl shadow-sm ${
            darkMode ? "bg-black text-white" : "bg-white text-black"
          }`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Coluna esquerda */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground dark:text-gray-400">
                    Nome da turma *
                  </label>
                  <Input
                    className="bg-blue-50 border-blue-50 dark:bg-[#141414] dark:border-[#141414] dark:text-white"
                    value={nomeTurma}
                    maxLength={LIMITES_CAMPOS.nomeTurma}
                    onChange={(e) => setNomeTurma(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm text-muted-foreground dark:text-gray-400">
                    Período *
                  </label>
                  <Select
                    value={periodoTurma}
                    onValueChange={setPeriodoTurma}
                  >
                    <SelectTrigger className="bg-blue-50 border-blue-50 dark:bg-[#141414] dark:border-[#141414] dark:text-white">
                      <SelectValue placeholder="Selecione o período" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-[#2D2D2D] dark:text-white">
                      <SelectItem value="Vespertino">Vespertino</SelectItem>
                      <SelectItem value="Matutino">Matutino</SelectItem>
                      <SelectItem value="Noturno">Noturno</SelectItem>
                      <SelectItem value="Integral">Integral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Coluna direita */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground dark:text-gray-400">
                    Ano letivo *
                  </label>
                  <Select
                    value={anoLetivoTurma}
                    onValueChange={setAnoLetivoTurma}
                  >
                    <SelectTrigger className="bg-blue-50 border-blue-50 dark:bg-[#141414] dark:border-[#141414] dark:text-white">
                      <SelectValue placeholder="Selecione o ano" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-[#2D2D2D] dark:text-white">
                      <SelectItem value="2025">2025</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground dark:text-gray-400">
                      Capacidade máxima *
                    </label>
                    <Input
                      type="number"
                      className="bg-blue-50 border-blue-50 dark:bg-[#141414] dark:border-[#141414] dark:text-white"
                      value={capacidadeTurma}
                      onChange={(e) => setCapacidadeTurma(e.target.value)}
                      min="1"
                      max={LIMITES_CAMPOS.capacidadeMaxima.toString()}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground dark:text-gray-400">
                      N° da sala *
                    </label>
                    <Input
                      className="bg-blue-50 border-blue-50 dark:bg-[#141414] dark:border-[#141414] dark:text-white"
                      value={salaTurma}
                      onChange={(e) => setSalaTurma(e.target.value)}
                      maxLength={LIMITES_CAMPOS.salaTurma}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Seleção de professores e disciplinas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm text-muted-foreground dark:text-gray-400 mb-4">
                  Seleção de docentes *
                </h3>
                <div className="space-y-3 max-h-60 overflow-y-auto p-2">
                  {docentes.map((docente) => (
                    <div key={docente.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`docente-${docente.id}`}
                        checked={idTeacher.includes(docente.id)}
                        onCheckedChange={() => handleTeacherSelection(docente.id)}
                      />
                      <label htmlFor={`docente-${docente.id}`} className="break-words">
                        {docente.nomeDocente}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm text-muted-foreground dark:text-gray-400 mb-4">
                  Seleção de disciplinas *
                </h3>
                <div className="space-y-3 max-h-60 overflow-y-auto p-2">
                  {disciplinas.map((disciplina) => (
                    <div key={disciplina.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`disciplina-${disciplina.id}`}
                        checked={disciplineId.includes(disciplina.id)}
                        onCheckedChange={() => handleDisciplineSelection(disciplina.id)}
                      />
                      <label htmlFor={`disciplina-${disciplina.id}`}>
                        {disciplina.nomeDisciplina}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <Button
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-2 rounded-lg transition-colors"
                onClick={criarTurma}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Criando..." : "Criar Turma"}
              </Button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}