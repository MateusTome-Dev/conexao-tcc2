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
import { Moon, Sun } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";

const LIMITES_CAMPOS = {
  nomeTurma: 50,
  salaTurma: 5,
  capacidadeMaxima: 40,
};

export default function CreateClass() {
  // Estados para armazenar os dados do formulário e seleções
  const [docentes, setDocentes] = useState([]); // Lista de professores
  const [disciplinas, setDisciplinas] = useState([]); // Lista de disciplinas
  const [nomeTurma, setNomeTurma] = useState(""); // Nome da turma
  const [anoLetivoTurma, setAnoLetivoTurma] = useState(""); // Ano letivo
  const [periodoTurma, setPeriodoTurma] = useState(""); // Período (matutino/vespertino/etc)
  const [capacidadeTurma, setCapacidadeTurma] = useState(""); // Capacidade máxima
  const [salaTurma, setSalaTurma] = useState(""); // Número da sala
  const [disciplineId, setDisciplineIds] = useState([]); // IDs das disciplinas selecionadas
  const [idTeacher, setIdTeachers] = useState([]); // IDs dos professores selecionados

  // Hooks para tema e roteamento
  const { darkMode, toggleTheme } = useTheme();
  const router = useRouter();

  // Efeito para buscar a lista de professores ao carregar o componente
  useEffect(() => {
    fetch("https://onacademy-e2h7csembwhrf2bu.brazilsouth-01.azurewebsites.net/api/teacher")
      .then((response) => response.json())
      .then((data) => setDocentes(data))
      .catch((error) => console.error("Erro ao buscar docentes:", error));
  }, []);

  // Efeito para buscar a lista de disciplinas ao carregar o componente
  useEffect(() => {
    fetch("https://onacademy-e2h7csembwhrf2bu.brazilsouth-01.azurewebsites.net/api/discipline")
      .then((response) => response.json())
      .then((data) => setDisciplinas(data))
      .catch((error) => console.error("Erro ao buscar disciplinas:", error));
  }, []);

  // Efeito para aplicar o tema ao carregar a página
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Função para lidar com a seleção/deseleção de professores
  const handleTeacherSelection = (id) => {
    setIdTeachers((prev) =>
      prev.includes(id) ? prev.filter((tid) => tid !== id) : [...prev, id]
    );
  };

  // Função para lidar com a seleção/deseleção de disciplinas
  const handleDisciplineSelection = (id) => {
    setDisciplineIds((prev) =>
      prev.includes(id) ? prev.filter((did) => did !== id) : [...prev, id]
    );
  };

  // Função principal para criar uma nova turma
  const criarTurma = async () => {
  // Validação dos campos
  if (!nomeTurma.trim()) {
    toast.warn("Nome da turma é obrigatório");
    return;
  }

  if (nomeTurma.length > LIMITES_CAMPOS.nomeTurma) {
    toast.warn(`Nome da turma deve ter no máximo ${LIMITES_CAMPOS.nomeTurma} caracteres`);
    return;
  }

  if (!anoLetivoTurma) {
    toast.warn("Ano letivo é obrigatório");
    return;
  }

  if (!periodoTurma) {
    toast.warn("Período é obrigatório");
    return;
  }

  if (!capacidadeTurma) {
    toast.warn("Capacidade é obrigatória");
    return;
  }

  const capacidade = Number(capacidadeTurma);
  if (isNaN(capacidade) || capacidade <= 0 || capacidade > LIMITES_CAMPOS.capacidadeMaxima) {
    toast.warn(`Capacidade deve ser um número entre 1 e ${LIMITES_CAMPOS.capacidadeMaxima}`);
    return;
  }

  if (!salaTurma.trim()) {
    toast.warn("Sala é obrigatória");
    return;
  }

  if (!/^\d+$/.test(salaTurma)) {
    toast.warn("O número da sala deve conter apenas dígitos numéricos");
    return;
  }

  if (salaTurma.length > LIMITES_CAMPOS.salaTurma) {
    toast.warn(`Sala deve ter no máximo ${LIMITES_CAMPOS.salaTurma} caracteres`);
    return;
  }

  if (idTeacher.length === 0) {
    toast.warn("Selecione pelo menos um professor");
    return;
  }

  if (disciplineId.length === 0) {
    toast.warn("Selecione pelo menos uma disciplina");
    return;
  }

  // Se passou por todas as validações, prossegue com a criação
  const token = localStorage.getItem("token");

  if (!token) {
    toast.warn("Usuário não autenticado. Faça login novamente.");
    return;
  }

  const payload = {
    nomeTurma,
    anoLetivoTurma: parseInt(anoLetivoTurma, 10),
    periodoTurma,
    capacidadeMaximaTurma: capacidadeTurma,
    salaTurma,
    idTeacher,
    disciplineId,
  };

  try {
    const response = await fetch("https://onacademy-e2h7csembwhrf2bu.brazilsouth-01.azurewebsites.net/api/class", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      throw new Error("Erro ao criar a turma.");
    }

    toast.success("Turma criada com sucesso!");

    setTimeout(() => {
      router.push("/institution/class");
    }, 2000);
  } catch (error) {
    console.error("Erro ao criar turma:", error);
    toast.error("Erro ao criar turma.");
  }
};

  // Renderização do componente
  return (
    <>
      {/* Container para as notificações toast */}
      <ToastContainer />
      
      {/* Estrutura principal da página */}
      <div
        className={`flex flex-row ${
          darkMode ? "bg-[#141414]" : "bg-[#F0F7FF]"
        } min-h-screen`}
      >
        {/* Barra lateral */}
        <Sidebar />
        
        {/* Conteúdo principal */}
        <main className="flex-1 p-8">
          <div className="p-8">
            {/* Cabeçalho */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className={`text-2xl font-bold ${
                  darkMode ? "text-blue-500" : "text-blue-500"
                }`}>
                  Criar Nova Turma
                </h1>
                <p className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}>
                  Preencha os campos abaixo para criar uma nova turma.
                </p>
              </div>
              {/* Botão para alternar entre tema claro/escuro */}
              <Button onClick={toggleTheme}>
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </Button>
            </div>

            {/* Formulário para criação de turma */}
            <div className={`container mx-auto p-6 space-y-6 max-w-5xl ${
              darkMode ? "bg-black text-white" : "bg-white text-black"
            } rounded-3xl`}>
              {/* Primeira linha de campos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Coluna esquerda */}
                <div className="space-y-4">
                  {/* Campo para nome da turma */}
                  <div>
                    <label className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-muted-foreground"
                    }`}>
                      Nome da turma
                    </label>
                    <Input
                      className={`${
                        darkMode
                          ? "bg-[#141414] border-[#141414] text-white"
                          : "bg-blue-50 border-blue-50"
                      }`}
                      value={nomeTurma}
                      maxLength={50}
                      onChange={(e) => setNomeTurma(e.target.value)}
                    />
                  </div>

                  {/* Seletor de período */}
                  <div>
                    <label className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-muted-foreground"
                    }`}>
                      Período
                    </label>
                    <Select
                      value={periodoTurma}
                      onChange={(value) => setPeriodoTurma(value)}
                    >
                      <SelectTrigger
                        className={`${
                          darkMode
                            ? "bg-[#141414] border-[#141414] text-white"
                            : "bg-blue-50 border-blue-50"
                        }`}
                      >
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

                {/* Coluna direita */}
                <div className="space-y-4">
                  {/* Seletor de ano letivo */}
                  <div>
                    <label className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-muted-foreground"
                    }`}>
                      Ano letivo
                    </label>
                    <Select
                      value={anoLetivoTurma}
                      onChange={(value) => setAnoLetivoTurma(value)}
                    >
                      <SelectTrigger
                        className={`${
                          darkMode
                            ? "bg-[#141414] border-[#141414] text-white"
                            : "bg-blue-50 border-blue-50"
                        }`}
                      >
                        <SelectValue placeholder="Selecione o ano" />
                      </SelectTrigger>
                      <SelectContent
                        className={darkMode ? "bg-[#2D2D2D] text-white" : ""}
                      >
                        <SelectItem value="2025">2025</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Campos de capacidade e sala */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`text-sm ${
                        darkMode ? "text-gray-400" : "text-muted-foreground"
                      }`}>
                        Capacidade máxima
                      </label>
                      <Input
                        type="number"
                        className={`${
                          darkMode
                            ? "bg-[#141414] border-[#141414] text-white"
                            : "bg-blue-50 border-blue-50"
                        }`}
                        value={capacidadeTurma}
                        onChange={(e) => setCapacidadeTurma(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className={`text-sm ${
                        darkMode ? "text-gray-400" : "text-muted-foreground"
                      }`}>
                        N° da sala
                      </label>
                      <Input
                        className={`${
                          darkMode
                            ? "bg-[#141414] border-[#141414] text-white"
                            : "bg-blue-50 border-blue-50"
                        }`}
                        value={salaTurma}
                        onChange={(e) => setSalaTurma(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Seleção de professores e disciplinas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Lista de professores */}
                <div>
                  <h3 className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-muted-foreground"
                  } mb-4`}>
                    Seleção de docentes
                  </h3>
                  <div className="space-y-3">
                    {docentes.map((docente) => (
                      <div
                        key={docente.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`docente-${docente.id}`}
                          checked={idTeacher.includes(docente.id)}
                          onCheckedChange={() =>
                            handleTeacherSelection(docente.id)
                          }
                          className={darkMode ? "text-white" : ""}
                        />
                        <label htmlFor={`docente-${docente.id}`} className="max-w-64 break-words">
                          {docente.nomeDocente}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Lista de disciplinas */}
                <div>
                  <h3 className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-muted-foreground"
                  } mb-4`}>
                    Seleção de disciplinas
                  </h3>
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
                          className={darkMode ? "text-white" : ""}
                        />
                        <label
                          htmlFor={`disciplina-${disciplina.id}`}
                          className={darkMode ? "text-white" : ""}
                        >
                          {disciplina.nomeDisciplina}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Botão para submeter o formulário */}
              <div className="flex justify-center">
                <Button
                  className="bg-blue-500 hover:bg-blue-600 text-white px-8"
                  onClick={criarTurma}
                >
                  Criar Turma
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}