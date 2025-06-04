"use client"; // Indica que este é um componente do lado do cliente no Next.js

// Importações de componentes e bibliotecas
import { Button } from "@/components/ui/institution/buttonSubmit";
import { Checkbox } from "@/components/ui/institution/checkbox";
import { Input } from "@/components/ui/institution/input";
import {
  SelectEdit,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Select,
} from "@/components/ui/institution/select";
import Sidebar from "@/components/layout/sidebarInstitution";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";
import { Moon, Sun, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";

// Componente principal para edição de turmas
export default function EditClass() {
  // Obtém os parâmetros da URL
  const params = useParams();
  // Extrai o ID da turma da URL
  const id = params.id as string;

  // Estados para armazenar dados
  const [docentes, setDocentes] = useState([]); // Lista de professores
  const [disciplinas, setDisciplinas] = useState([]); // Lista de disciplinas
  const [nomeTurma, setNomeTurma] = useState(""); // Nome da turma
  const [anoLetivoTurma, setAnoLetivoTurma] = useState(""); // Ano letivo
  const [periodoTurma, setPeriodoTurma] = useState(""); // Período (matutino/vespertino)
  const [capacidadeTurma, setCapacidadeTurma] = useState(""); // Capacidade máxima
  const [salaTurma, setSalaTurma] = useState(""); // Número da sala
  const { darkMode, toggleTheme } = useTheme(); // Tema (claro/escuro)
  const [disciplineIds, setDisciplineIds] = useState([]); // IDs das disciplinas selecionadas
  const [idTeachers, setIdTeachers] = useState([]); // IDs dos professores selecionados
  const router = useRouter(); // Router para navegação

  // Efeito para aplicar o tema ao carregar o componente
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Buscar lista de professores da API
  useEffect(() => {
    fetch(
      "https://onaback-fke4h4d2dkbfcsav.eastus2-01.azurewebsites.net/api/teacher"
    )
      .then((response) => response.json())
      .then((data) => setDocentes(data))
      .catch((error) => console.error("Erro ao buscar docentes:", error));
  }, []);

  // Buscar lista de disciplinas da API
  useEffect(() => {
    fetch(
      "https://onaback-fke4h4d2dkbfcsav.eastus2-01.azurewebsites.net/api/discipline"
    )
      .then((response) => response.json())
      .then((data) => setDisciplinas(data))
      .catch((error) => console.error("Erro ao buscar disciplinas:", error));
  }, []);

  // Função para lidar com a seleção/deseleção de professores
  const handleTeacherSelection = (id) => {
    setIdTeachers((prev) => {
      return prev.includes(id)
        ? prev.filter((tid) => tid !== id) // Remove se já estiver selecionado
        : [...prev, id]; // Adiciona se não estiver selecionado
    });
  };

  // Função para lidar com a seleção/deseleção de disciplinas
  const handleDisciplineSelection = (id) => {
    setDisciplineIds((prev) => {
      return prev.includes(id)
        ? prev.filter((did) => did !== id) // Remove se já estiver selecionada
        : [...prev, id]; // Adiciona se não estiver selecionada
    });
  };

  const LIMITES_CAMPOS = {
    nomeTurma: 50,
    salaTurma: 5,
    capacidadeMaxima: 40,
  };

  const validarCampos = () => {
    // Verificação de campos obrigatórios
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

    // Validação de comprimento máximo
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

    // Validação numérica
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

        if (idTeachers.length === 0) {
      toast.warn("Por favor, selecione pelo menos um professor");
      return false;
    }
 
    if (disciplineIds.length === 0) {
      toast.warn("Por favor, selecione pelo menos uma disciplina");
      return false;
    }

    return true;
  };

  // Função para enviar os dados atualizados da turma para a API
  const editarTurma = async () => {
    if (!validarCampos()) {
      return;
    }

    // Prepara o payload com os dados da turma
    const payload = {
      nomeTurma,
      anoLetivoTurma: parseInt(anoLetivoTurma, 10),
      periodoTurma,
      capacidadeMaximaTurma: Number(capacidadeTurma),
      salaTurma: Number(salaTurma),
      idTeacher: idTeachers,
      disciplineId: disciplineIds,
    };

    try {
      // Faz a requisição PUT para a API
      const response = await fetch(
        `https://onaback-fke4h4d2dkbfcsav.eastus2-01.azurewebsites.net/api/class/${params.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const responseData = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error("Erro ao atualizar a turma.");
      }

      // Exibe mensagem de sucesso e redireciona após 2 segundos
      toast.success("Turma atualizada com sucesso!");
      setTimeout(() => {
        router.push("/institution/class");
      }, 2000);
    } catch (error) {
      console.error("Erro ao atualizar turma:", error);
      toast.error("Erro ao atualizar turma.");
    }
  };

  // Efeito para carregar os dados da turma quando o ID muda
  useEffect(() => {
    if (!id) return; // Se não houver ID, não faz a requisição

    // Busca os dados da turma, professores e disciplinas associadas
    fetch(
      `https://onaback-fke4h4d2dkbfcsav.eastus2-01.azurewebsites.net/api/class/teacher/disciplinas/${id}`
    )
      .then((response) => response.json())
      .then((data) => {
        // Preenche os estados com os dados da turma
        setNomeTurma(data.nomeTurma || "");
        setAnoLetivoTurma(data.anoLetivoTurma || "");
        setPeriodoTurma(data.periodoTurma || "");
        setCapacidadeTurma(String(data.capacidadeMaximaTurma) || "");
        setSalaTurma(String(data.salaTurma) || "");

        // Extrai IDs dos professores associados à turma
        const teacherIds = data.teachers
          ? data.teachers.map((teacher) => teacher.id)
          : [];
        setIdTeachers(teacherIds);

        // Extrai IDs das disciplinas associadas à turma
        const disciplineIds = data.disciplines
          ? data.disciplines.map((discipline) => discipline.id)
          : [];
        setDisciplineIds(disciplineIds);
      })
      .catch((error) => console.error("Erro ao buscar turma:", error));
  }, [id]); // Executa apenas quando o ID muda

  // Renderização do componente
  return (
    <>
      {/* Container para mensagens toast */}
      <ToastContainer />
      {/* Container principal com fundo condicional (claro/escuro) */}
      <div
        className={`flex flex-row ${
          darkMode ? "bg-[#141414]" : "bg-[#F0F7FF]"
        } min-h-screen`}
      >
        {/* Sidebar */}
        <Sidebar />
        {/* Conteúdo principal */}
        <main className="flex-1 p-8">
          <div className="p-8">
            {/* Cabeçalho */}
            <div className="mb-8">
              {/* Botão Voltar - alinhado à esquerda */}
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-blue-500 font-semibold transition-colors flex-shrink-0"
              >
                <ArrowLeft size={20} />
                <span className="hidden sm:inline">Voltar</span>
              </button>
<div className="flex items-center justify-between">
              {/* Título centralizado - ocupa o espaço disponível */}
              <div className="flex-1 text-center mx-4">
                <h1
                  className={`text-2xl font-bold ${
                    darkMode ? "text-blue-500" : "text-blue-500"
                  }`}
                >
                  Editar Turma
                </h1>
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Preencha os campos abaixo para editar a turma.
                </p>
              </div>

              {/* Botão Tema - alinhado à direita */}
              <Button
                onClick={toggleTheme}
                className="flex-shrink-0"
                variant="ghost"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </Button>
            </div>
</div>
            {/* Formulário de edição */}
            <div className="container mx-auto p-6 space-y-6 max-w-5xl h-1/2 bg-[#ffffff] rounded-3xl dark:bg-black">
              {/* Grid com campos básicos da turma */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Coluna 1: Nome e Período */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground dark:text-gray-400">
                      Nome da turma
                    </label>
                    <Input
                      className="bg-blue-50 border-blue-50 dark:bg-[#141414] dark:border-[#141414] dark:text-white"
                      maxLength={50}
                      value={nomeTurma}
                      onChange={(e) => setNomeTurma(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground dark:text-gray-400">
                      Período
                    </label>
                    <Select
                      value={periodoTurma}
                      onChange={(value) => {
                        console.log("📆 Ano letivo atualizado:", value);
                        setPeriodoTurma(value);
                      }}
                    >
                      <SelectTrigger className="bg-blue-50 border-blue-50 dark:bg-[#141414] dark:border-[#141414] dark:text-white">
                        <SelectValue placeholder="Selecione o período" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Vespertino">Vespertino</SelectItem>
                        <SelectItem value="Matutino">Matutino</SelectItem>
                        <SelectItem value="Noturno">Noturno</SelectItem>
                        <SelectItem value="Integral">Integral</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Coluna 2: Ano letivo, capacidade e sala */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground dark:text-gray-400">
                      Ano letivo
                    </label>
                    <Select
                      value={anoLetivoTurma.toString()}
                      onChange={(value) => {
                        console.log("📆 Ano letivo atualizado:", value);
                        setAnoLetivoTurma(value);
                      }}
                    >
                      <SelectTrigger className="bg-blue-50 border-blue-50 dark:bg-[#141414] dark:border-[#141414] dark:text-white">
                        <SelectValue placeholder="Selecione o ano" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2025">2025</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground dark:text-gray-400">
                        Capacidade máxima
                      </label>
                      <Input
                        type="number"
                        className="bg-blue-50 border-blue-50 dark:bg-[#141414] dark:border-[#141414] dark:text-white"
                        value={capacidadeTurma}
                        onChange={(e) => setCapacidadeTurma(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground dark:text-gray-400">
                        N° da sala
                      </label>
                      <Input
                        className="bg-blue-50 border-blue-50 dark:bg-[#141414] dark:border-[#141414] dark:text-white"
                        value={salaTurma}
                        onChange={(e) => setSalaTurma(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid para seleção de professores e disciplinas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Lista de professores */}
                <div>
                  <h3 className="text-sm text-muted-foreground mb-4">
                    Seleção de docentes
                  </h3>
                  <div className="space-y-3">
                    {docentes.map((docente) => (
                      <div
                        key={docente.id}
                        className="flex items-center space-x-2 dark:text-white"
                      >
                        <Checkbox
                          id={`docente-${docente.id}`}
                          checked={idTeachers.includes(docente.id)}
                          onCheckedChange={() =>
                            handleTeacherSelection(docente.id)
                          }
                        />
                        <label
                          htmlFor={`docente-${docente.id}`}
                          className="max-w-64 break-words"
                        >
                          {docente.nomeDocente}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Lista de disciplinas */}
                <div>
                  <h3 className="text-sm text-muted-foreground mb-4">
                    Seleção de disciplinas
                  </h3>
                  <div className="space-y-3">
                    {disciplinas.map((disciplina) => (
                      <div
                        key={disciplina.id}
                        className="flex items-center space-x-2 dark:text-white"
                      >
                        <Checkbox
                          id={`disciplina-${disciplina.id}`}
                          checked={disciplineIds.includes(disciplina.id)}
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
                </div>
              </div>

              {/* Botão de submit */}
              <div className="flex justify-center">
                <Button
                  className="bg-blue-500 hover:bg-blue-600 text-white px-8"
                  onClick={editarTurma}
                >
                  Editar turma
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
