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
    fetch("http://localhost:3000/api/teacher")
      .then((response) => response.json())
      .then((data) => setDocentes(data))
      .catch((error) => console.error("Erro ao buscar docentes:", error));
  }, []);

  // Efeito para buscar a lista de disciplinas ao carregar o componente
  useEffect(() => {
    fetch("http://localhost:3000/api/discipline")
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
    const token = localStorage.getItem("token");

    // Verifica se o token JWT existe
    if (!token) {
      console.error("❌ Token JWT não encontrado!");
      toast.warn("Usuário não autenticado. Faça login novamente.");
      return;
    }

    // Validação dos campos obrigatórios
    if (
      !nomeTurma ||
      !anoLetivoTurma ||
      !periodoTurma ||
      !capacidadeTurma ||
      !salaTurma
    ) {
      console.error("❌ O ano letivo está vazio!");
      toast.warn("Preencha todos os campos.");
      return;
    }

    // Preparação do payload para a API
    const payload = {
      nomeTurma,
      anoLetivoTurma: parseInt(anoLetivoTurma, 10), // Converte para número
      periodoTurma,
      capacidadeMaximaTurma: capacidadeTurma,
      salaTurma,
      idTeacher, // IDs dos professores selecionados
      disciplineId, // IDs das disciplinas selecionadas
    };

    try {
      // Chamada para a API para criar a turma
      const response = await fetch("http://localhost:3000/api/class", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      
      // Verifica se a resposta foi bem-sucedida
      if (!response.ok) {
        throw new Error("Erro ao criar a turma.");
      }

      // Feedback de sucesso para o usuário
      toast.success("Turma criada com sucesso!");

      // Redireciona após 2 segundos
      setTimeout(() => {
        router.push("/institution/class");
      }, 2000);
    } catch (error) {
      console.error("❌ Erro ao criar turma:", error);
      console.log(payload);

      // Feedback de erro para o usuário
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