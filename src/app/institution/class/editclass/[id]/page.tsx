"use client"

import { Button } from "@/components/ui/institution/button"
import { Checkbox } from "@/components/ui/institution/checkbox"
import { Input } from "@/components/ui/institution/input"
import { SelectEdit, SelectContent, SelectItem, SelectTrigger, SelectValue, Select } from "@/components/ui/institution/select"
import Sidebar from "@/components/layout/sidebarInstitution";
import SearchInput from "@/components/ui/search"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useTheme } from "@/components/ThemeProvider";

export default function EditClass() {
  const params = useParams(); // Obtém os parâmetros da URL
  const id = params.id as string; // Extrai o ID da turma da URL
  const [docentes, setDocentes] = useState([]);
    const [disciplinas, setDisciplinas] = useState([]);
    const [nomeTurma, setNomeTurma] = useState("");
    const [anoLetivoTurma, setAnoLetivoTurma] = useState("");
    const [periodoTurma, setPeriodoTurma] = useState("");
    const [capacidadeTurma, setCapacidadeTurma] = useState("");
    const [salaTurma, setSalaTurma] = useState("");
    const { darkMode, toggleTheme } = useTheme(); 
    const [disciplineIds, setDisciplineIds] = useState([]);
    const [idTeachers, setIdTeachers] = useState([]); // 🔹 Agora é um array
  

    useEffect(() => {
      document.documentElement.classList.toggle("dark", darkMode);
      localStorage.setItem("theme", darkMode ? "dark" : "light");
    }, [darkMode]);
    
    // Buscar docentes
    useEffect(() => {
      fetch("http://localhost:3000/api/teacher")
        .then((response) => response.json())
        .then((data) => setDocentes(data))
        .catch((error) => console.error("Erro ao buscar docentes:", error));
    }, []);
  
    // Buscar disciplinas
    useEffect(() => {
      fetch("http://localhost:3000/api/discipline")
        .then((response) => response.json())
        .then((data) => setDisciplinas(data))
        .catch((error) => console.error("Erro ao buscar disciplinas:", error));
    }, []);
  
    // Função para lidar com a seleção de professores
    const handleTeacherSelection = (id) => {
      setIdTeachers((prev) => {
        return prev.includes(id)
          ? prev.filter((tid) => tid !== id)
          : [...prev, id];
      });
    };
  
    // 🔹 Função para lidar com a seleção de disciplinas
    const handleDisciplineSelection = (id) => {
      setDisciplineIds((prev) => {
        return prev.includes(id)
          ? prev.filter((did) => did !== id)
          : [...prev, id];
      });
    };
  
    const editarTurma = async () => {
  
      const payload = {
        nomeTurma,
        anoLetivoTurma,
        periodoTurma,
        capacidadeMaximaTurma: Number(capacidadeTurma),
        salaTurma: Number(salaTurma),
        idTeacher: idTeachers,
        disciplineId: disciplineIds,
    };
    
      try {
        const response = await fetch(`http://localhost:3000/api/class/${params.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload),
        });
  
        const responseData = await response.json().catch(() => null);
        const limparCampos = () => {
          setNomeTurma("");
          setAnoLetivoTurma("");
          setPeriodoTurma("");
          setCapacidadeTurma("");
          setSalaTurma("");
          setIdTeachers([]); // 🔹 Resetando professores selecionados
          setDisciplineIds([]); // 🔹 Resetando disciplinas selecionadas
        };
        
  
        if (!response.ok) {
          throw new Error("Erro ao atualizar a turma.");
        }
  
        alert("Turma atualizada com sucesso!");
        limparCampos();
      } catch (error) {
        console.error("Erro ao atualizar turma:", error);
        alert("Erro ao atualizar turma.");
      }
    };
    useEffect(() => {
      if (!id) return; // Se não houver ID, não faz a requisição
    
      fetch(`http://localhost:3000/api/class/teacher/disciplinas/${id}`)
        .then((response) => response.json())
        .then((data) => {
          setNomeTurma(data.nomeTurma || "");
          setAnoLetivoTurma(data.anoLetivoTurma || "");
          setPeriodoTurma(data.periodoTurma || "");
          setCapacidadeTurma(String(data.capacidadeMaximaTurma) || "");
          setSalaTurma(String(data.salaTurma) || "");
          setIdTeachers(data.idTeacher || []);
          setDisciplineIds(data.disciplineId || []);
        })
        .catch((error) => console.error("Erro ao buscar turma:", error));
    }, [id]); // 🔹 Só executa quando o ID mudar
    
    return (
      <div className="flex flex-row bg-[#F0F7FF] items-center">
        <Sidebar />
        <div className="container mx-auto p-6 space-y-6 max-w-5xl h-1/2 bg-[#ffffff] rounded-3xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">
                  Nome da turma
                </label>
                <Input
                  className="bg-blue-50"
                  value={nomeTurma}
                  onChange={(e) => setNomeTurma(e.target.value)}
                />
              </div>
  
              <div>
                <label className="text-sm text-muted-foreground">Período</label>
                <Select 
                value={periodoTurma}
                onChange={(value) => {
                  console.log("📆 Ano letivo atualizado:", value);
                  setPeriodoTurma(value);
                }}>
                  <SelectTrigger className="bg-blue-50">
                    <SelectValue placeholder="Selecione o período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Manhã">Manhã</SelectItem>
                    <SelectItem value="Tarde">Tarde</SelectItem>
                    <SelectItem value="Noite">Noite</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
  
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">
                  Ano letivo
                </label>
                <Select
                  value={anoLetivoTurma}
                  onChange={(value) => {
                    console.log("📆 Ano letivo atualizado:", value);
                    setAnoLetivoTurma(value);
                  }}
                >
                  <SelectTrigger className="bg-blue-50">
                    <SelectValue placeholder="Selecione o ano" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2025-01-01">2025</SelectItem>
                    <SelectItem value="2024-01-01">2024</SelectItem>
                    <SelectItem value="2023-01-01">2023</SelectItem>
                  </SelectContent>
                </Select>
              </div>
  
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">
                    Capacidade máxima
                  </label>
                  <Input
                    type="number"
                    className="bg-blue-50"
                    value={capacidadeTurma}
                    onChange={(e) => setCapacidadeTurma(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">
                    N° da sala
                  </label>
                  <Input
                    className="bg-blue-50"
                    value={salaTurma}
                    onChange={(e) => setSalaTurma(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm text-muted-foreground mb-4">
                Seleção de docentes
              </h3>
              <div className="space-y-3">
                {docentes.map((docente) => (
                  <div key={docente.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`docente-${docente.id}`}
                      checked={idTeachers.includes(docente.id)}
                      onCheckedChange={() => handleTeacherSelection(docente.id)}
                    />
                    <label htmlFor={`docente-${docente.id}`}>
                      {docente.nomeDocente}
                    </label>
                  </div>
                ))}
              </div>
            </div>
  
            <div>
              <h3 className="text-sm text-muted-foreground mb-4">
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
    );
}

