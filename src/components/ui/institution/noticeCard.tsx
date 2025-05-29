"use client";
import { Card } from "@/components/ui/alunos/card";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

interface ClassProfile {
  nomeTurma: string;
  id: number;
}
interface NoticeCardProps {
  onRefresh: () => void;
}

export function NoticeCard({ onRefresh }: NoticeCardProps) {
  const [aviso, setAviso] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [turmaSelecionada, setTurmaSelecionada] = useState<ClassProfile | null>(
    null
  );
  const [classes, setClasses] = useState<ClassProfile[]>([]); // Armazenando a lista de turmas

  // Função de buscar as turmas
  const fetchClasses = async () => {
    try {
      const response = await fetch("https://onacademy-e2h7csembwhrf2bu.brazilsouth-01.azurewebsites.net/api/class");
      if (!response.ok) throw new Error("Não foi possível carregar as turmas");
      const dataClasses = await response.json();
      setClasses(dataClasses);
      if (dataClasses.length > 0) {
        setTurmaSelecionada(dataClasses[0]);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const enviarAviso = async () => {
    if (!turmaSelecionada) {
      toast.warn("Selecione uma turma antes de enviar o aviso.");
      return;
    }

    if (!aviso) {
      toast.warn("Preencha o aviso antes de enviar.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token não encontrado");
      const decoded: any = jwtDecode(token);
      const userId = decoded?.sub;
      if (!userId) throw new Error("ID do usuário não encontrado no token");
      const userIdInt = parseInt(userId, 10);
      if (isNaN(userIdInt))
        throw new Error("ID do usuário não é um número válido");

      const response = await fetch("https://onacademy-e2h7csembwhrf2bu.brazilsouth-01.azurewebsites.net/api/reminder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          createdByInstitution: { id: userIdInt },
          classSt: { id: turmaSelecionada.id },
          conteudo: aviso,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao enviar o aviso.");
      }

      toast.success("Aviso enviado com sucesso!");
      setAviso("");

      fetchClasses();
      onRefresh();
    } catch (error) {
      console.error("Erro ao enviar aviso:", error);
      toast.error("Erro ao enviar aviso.");
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <>
      <ToastContainer />
      <div className="grid grid-cols-2 gap-6 mt-6">
        {/* Card turma */}
        <Card>
          <h2 className="text-blue-600 font-semibold mb-4">Turmas</h2>
          <div className="max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-200 dark:scrollbar-track-[#141414]">
            {/* Exibindo Turmas */}
            <div className="space-y-2">
              {classes.length ? (
                classes.map((turma) => (
                  <button
                    key={turma.id}
                    onClick={() => setTurmaSelecionada(turma)}
                    className={`block w-full p-3 text-left border rounded-lg max-w-3xl overflow-hidden transition-colors duration-200 ${
                      turmaSelecionada?.id === turma.id
                        ? "border-blue-500 bg-blue-100 dark:bg-blue-900 dark:bg-opacity-50 shadow-md"
                        : "border-[#F0F7FF] bg-[#F0F7FF] dark:bg-[#141414] dark:border-[#141414]"
                    } hover:border-blue-500 dark:hover:border-blue-500`}
                  >
                    <span className="font-semibold break-words">
                      {turma.nomeTurma}
                    </span>
                    <span className="block text-gray-500 text-sm">
                      Nº{turma.id}
                    </span>
                  </button>
                ))
              ) : (
                <p>
                  {loading
                    ? "Carregando turmas..."
                    : "Nenhuma turma disponível"}
                </p>
              )}
            </div>
          </div>
        </Card>
        {/* Card aviso */}
        <Card>
          <h2 className="text-blue-600 font-semibold mb-4">Aviso</h2>
          <div className="max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-200">
            <textarea
              className="w-full h-40 p-3 border border-[#F0F7FF] rounded-lg resize-none border-none focus:outline-none bg-[#F0F7FF] dark:bg-[#141414] text-[#8A8A8A]"
              value={aviso}
              onChange={(e) => setAviso(e.target.value)}
            />
            <button
              onClick={enviarAviso}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Enviar
            </button>
          </div>
        </Card>
      </div>
    </>
  );
}
