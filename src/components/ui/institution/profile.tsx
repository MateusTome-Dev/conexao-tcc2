"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/institution/button";
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
import Image from "next/image";

export default function ProfileForm() {
  const [docentes, setDocentes] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    birthDate: "",
    phone: "",
    registrationNumber: "",
    password: "",
  });
  const [disciplineIds, setDisciplineIds] = useState([]); // IDs das disciplinas selecionadas
  const [idTeachers, setIdTeachers] = useState([]); // IDs dos professores selecionados

  // Buscar docentes
  useEffect(() => {
    fetch("https://onacademy-e2h7csembwhrf2bu.brazilsouth-01.azurewebsites.net/api/teacher")
      .then((response) => response.json())
      .then((data) => setDocentes(data))
      .catch((error) => console.error("Erro ao buscar docentes:", error));
  }, []);

  // Buscar disciplinas
  useEffect(() => {
    fetch("https://onacademy-e2h7csembwhrf2bu.brazilsouth-01.azurewebsites.net/api/disciplina")
      .then((response) => response.json())
      .then((data) => setDisciplinas(data))
      .catch((error) => console.error("Erro ao buscar disciplinas:", error));
  }, []);

  // Função para lidar com a seleção de professores
  const handleTeacherSelection = (id) => {
    setIdTeachers((prev) =>
      prev.includes(id)
        ? prev.filter((tid) => tid !== id) // Remove o ID se já estiver selecionado
        : [...prev, id] // Adiciona o ID se não estiver selecionado
    );
  };

  // Função para lidar com a seleção de disciplinas
  const handleDisciplineSelection = (id) => {
    setDisciplineIds((prev) =>
      prev.includes(id)
        ? prev.filter((did) => did !== id) // Remove o ID se já estiver selecionado
        : [...prev, id] // Adiciona o ID se não estiver selecionado
    );
  };

  // Função para atualizar o estado do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Função para enviar os dados do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação básica dos campos
    if (
      !formData.name ||
      !formData.email ||
      !formData.birthDate ||
      !formData.phone ||
      !formData.registrationNumber ||
      disciplineIds.length === 0 ||
      idTeachers.length === 0
    ) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      console.error("❌ Token JWT não encontrado!");
      alert("Usuário não autenticado. Faça login novamente.");
      return;
    }

    const payload = {
      ...formData,
      disciplineIds,
      idTeachers,
    };

    try {
      const response = await fetch("https://onacademy-e2h7csembwhrf2bu.brazilsouth-01.azurewebsites.net/api/teacher", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error("Erro ao criar o perfil.");
      }

      alert("✅ Perfil criado com sucesso!");
      // Limpar campos após o envio
      setFormData({
        name: "",
        email: "",
        birthDate: "",
        phone: "",
        registrationNumber: "",
        password: "",
      });
      setDisciplineIds([]);
      setIdTeachers([]);
    } catch (error) {
      console.error("❌ Erro ao criar perfil:", error);
      alert("Erro ao criar perfil.");
    }
  };

  return (
    <div className="flex flex-row bg-[#F0F7FF] items-center">
      <Sidebar />
      <div className="container mx-auto p-6 space-y-6 max-w-5xl h-1/2 bg-[#ffffff] rounded-3xl">
        <div className="flex items-start gap-6">
          <Image
            src="https://img.freepik.com/free-vector/isolated-young-handsome-man-different-poses-white-background-illustration_632498-855.jpg"
            alt="Profile picture"
            width={80}
            height={80}
            className="rounded-full"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: "Nome Completo", type: "text", name: "name" },
            { label: "Data de Nascimento", type: "date", name: "birthDate" },
            { label: "Email", type: "email", name: "email" },
            { label: "Telefone", type: "tel", name: "phone" },
            { label: "Nº Matrícula", type: "text", name: "registrationNumber" },
          ].map(({ label, type, name }) => (
            <div key={name} className="space-y-2">
              <label className="text-sm text-muted-foreground">{label}</label>
              <Input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className="bg-blue-50"
              />
            </div>
          ))}
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
            onClick={handleSubmit}
          >
            Salvar
          </Button>
        </div>
      </div>
    </div>
  );
}