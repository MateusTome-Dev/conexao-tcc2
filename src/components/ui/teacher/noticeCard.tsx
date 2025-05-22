"use client";
import { Card } from "@/components/ui/alunos/card";
import { log } from "console";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

interface TeacherProfile {
  nome: string;
  emailDocente: string;
  dataNascimentoDocente: string;
  classes: { nomeTurma: string; id: number }[]; // Lista de turmas
}

interface NoticeCardProps {
  onRefresh: () => void;
}

export function NoticeCard({ onRefresh }: NoticeCardProps) {
  const [aviso, setAviso] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [teacherData, setTeacherData] = useState<TeacherProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [turmaSelecionada, setTurmaSelecionada] = useState<{
    nomeTurma: string;
    id: number;
  } | null>(null);

  // Função de buscar os dados do docente
  const fetchTeacherData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token não encontrado");

      const decoded: any = jwtDecode(token); // Decodificação do JWT
      const userId = decoded?.sub; // Extraindo o id do usuário do token
      if (!userId) throw new Error("ID do usuário não encontrado no token");

      const response = await fetch(
        `https://backendona-amfeefbna8ebfmbj.eastus2-01.azurewebsites.net/api/teacher/${userId}`
      );
      if (!response.ok)
        throw new Error("Não foi possível carregar os dados do estudante");

      const data = await response.json();
      setTeacherData(data); // Setando os dados do docente
      if (data.classes.length > 0) {
        setTurmaSelecionada(data.classes[0]); // Seleciona a primeira turma, caso haja
      }
    } catch (err: any) {
      setError(err.message); // Tratamento de erro
    } finally {
      setLoading(false); // Finalizando o carregamento
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

      const response = await fetch("https://backendona-amfeefbna8ebfmbj.eastus2-01.azurewebsites.net/api/reminder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          createdBy: { id: userIdInt },
          classSt: { id: turmaSelecionada.id },
          conteudo: aviso,
        }),
      });

      if (!response.ok) throw new Error("Erro ao enviar o aviso.");

      toast.success("Aviso enviado com sucesso!");
      setAviso(""); // Limpa o campo de aviso após o envio

      fetchTeacherData();
      onRefresh();
    } catch (error) {
      console.error("Erro ao enviar aviso:", error);
      toast.error("Erro ao enviar aviso."); // Substituído o alert pelo toast.error
    }
  };

  // Chama a função de fetch quando o componente for montado
  useEffect(() => {
    fetchTeacherData(); // Chamando a função para carregar os dados
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
          <div className="max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-200">
            {/* Exibindo Turmas */}
            <div className="space-y-2">
              {teacherData?.classes?.length ? (
                teacherData.classes.map((turma) => (
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
