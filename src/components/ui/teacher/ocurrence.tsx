"use client";

import { useState } from "react";
import { Pencil, Trash } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useParams } from "next/navigation";

export default function Ocurrence() {
  const [feedback, setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState("");
  const params = useParams();
    const studentId = params.id as string; // Obtém o ID da rota
  const enviarFeedback = async () => {
    try {
      if (feedback.length > 100 ) {
        toast.warn("O feedback deve ter no máximo 100 caracteres.");
        return;
      }
      if(!feedback) {
        toast.warn("O feedback não pode ser vazio.");
        return;
      }
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token não encontrado");

      const decoded: any = jwtDecode(token);
      const userId = decoded?.sub;
      if (!userId) throw new Error("ID do usuário não encontrado no token");

      const userIdInt = parseInt(userId, 10);
      if (isNaN(userIdInt))
        throw new Error("ID do usuário não é um número válido");

      const response = await fetch(
        "https://onaback-fke4h4d2dkbfcsav.eastus2-01.azurewebsites.net/api/teacher/student",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            createdBy: {
              id: userIdInt,
            },
            conteudo: feedback,
           recipientStudent: {
            id: studentId, // ID do aluno obtido da rota
           }
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao enviar o feedback.");
      }

      toast.success("Feedback escrito enviado com sucesso!");
      setFeedback("");
    } catch (error) {
      console.error("Erro ao enviar feedback:", error);
      toast.error("Erro ao enviar feedback.");
    }
  };

  return (
    <>
      <ToastContainer />
      <div>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-blue-500 font-bold dark:text-white">
            Adicionar Feedback escrito para aluno
          </h1>
        </div>

        <input
          type="text"
          placeholder="Digite seu feedback..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="w-full p-3 border rounded-md bg-blue-50 dark:bg-[#141414] border-[#F0F7FF] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4 dark:text-white dark:border-gray-700"
        />

        <div className="flex space-x-4">
          <button
            onClick={enviarFeedback}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Enviar
          </button>
        </div>
      </div>
    </>
  );
}