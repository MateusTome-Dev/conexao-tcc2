"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useParams } from "next/navigation";
import { jwtDecode } from "jwt-decode";

type Question = {
  id: number;
  text: string;
  responseKey: string;
};

type UserData = {
  sub: string;
  [key: string]: any;
};

export default function FeedbackForm() {
  const params = useParams();
  const studentId = params.id as string;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState({
    resposta1: 0,
    resposta2: 0,
    resposta3: 0,
    resposta4: 0,
    resposta5: 0,
    bimestre: 1,
    createdBy: { id: "" },
    recipientStudent: { id: "" },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      // Get teacher ID from token
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMessage(
          "Token não encontrado. Por favor, faça login novamente."
        );
        setIsLoading(false);
        return;
      }

      const decoded = jwtDecode(token) as UserData;
      const teacherId = decoded?.sub;

      if (!teacherId) {
        setErrorMessage("ID do professor não encontrado no token.");
        setIsLoading(false);
        return;
      }

      // Get student ID from URL params
      if (!studentId) {
        setErrorMessage("ID do aluno não encontrado nos parâmetros da URL.");
        setIsLoading(false);
        return;
      }

      // Update responses with the IDs
      setResponses((prev) => ({
        ...prev,
        createdBy: { id: teacherId },
        recipientStudent: { id: studentId },
      }));

      setIsLoading(false);
    } catch (error) {
      console.error("Erro ao decodificar token:", error);
      setErrorMessage(
        "Erro ao obter informações do usuário. Por favor, faça login novamente."
      );
      setIsLoading(false);
    }
  }, [studentId]);

  const questions: Question[] = [
    {
      id: 1,
      text: "Nível de Engajamento do aluno",
      responseKey: "resposta1",
    },
    {
      id: 2,
      text: "Nível de disposição do aluno",
      responseKey: "resposta2",
    },
    {
      id: 3,
      text: "Nível de entrega do aluno",
      responseKey: "resposta3",
    },
    {
      id: 4,
      text: "Nível de atenção do aluno",
      responseKey: "resposta4",
    },
    {
      id: 5,
      text: "Nível de comportamento do aluno",
      responseKey: "resposta5",
    },
  ];

  const handleRatingClick = (rating: number) => {
    const question = questions[currentQuestion];
    setResponses({
      ...responses,
      [question.responseKey]: rating,
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleBimestreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setResponses({
      ...responses,
      bimestre: Number.parseInt(e.target.value),
    });
    // Clear any previous error messages when changing bimestre
    setErrorMessage(null);
  };

  const handleSubmit = async () => {
    // Check if all questions have been answered
    const allAnswered = Object.keys(responses)
      .filter((key) => key.startsWith("resposta"))
      .every((key) => responses[key as keyof typeof responses] !== 0);

    if (!allAnswered) {
      setErrorMessage(
        "Por favor, responda todas as perguntas antes de enviar."
      );
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch("https://backendona-amfeefbna8ebfmbj.eastus2-01.azurewebsites.net/api/feedbackForm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(responses),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else if (response.status === 500) {
        setErrorMessage(
          `Já existe um feedback para o ${responses.bimestre}º bimestre.`
        );
      } else {
        setErrorMessage(
          "Ocorreu um erro ao enviar suas respostas. Por favor, tente novamente."
        );
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setErrorMessage(
        "Ocorreu um erro ao enviar suas respostas. Por favor, tente novamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-3xl mx-auto p-6 rounded-lg bg-blue-50 dark:bg-[#141414]">
        <div className="text-center py-10">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">
            Obrigado pelo seu feedback!
          </h2>
          <p className="text-gray-700 mb-6 dark:text-white">
            Suas respostas foram enviadas com sucesso.
          </p>
          <button
            onClick={() => {
              setResponses({
                resposta1: 0,
                resposta2: 0,
                resposta3: 0,
                resposta4: 0,
                resposta5: 0,
                bimestre: 1,
                createdBy: { id: responses.createdBy.id },
                recipientStudent: { id: responses.recipientStudent.id },
              });
              setCurrentQuestion(0);
              setIsSubmitted(false);
              setErrorMessage(null);
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-md transition-colors"
          >
            Adicionar novo feedback
          </button>
        </div>
      </div>
    );
  }
  

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (
    errorMessage &&
    (errorMessage.includes("token") || errorMessage.includes("ID"))
  ) {
    return (
      <div className="max-w-3xl mx-auto p-6 rounded-lg bg-red-50 border border-red-200">
        <div className="text-center py-6">
          <h2 className="text-xl font-bold text-red-600 mb-4">
            Erro de Autenticação
          </h2>
          <p className="text-red-700">{errorMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 flex justify-end">
        <div className="w-40">
          <label
            htmlFor="bimestre"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Selecione o bimestre:
          </label>
          <select
            id="bimestre"
            value={responses.bimestre}
            onChange={handleBimestreChange}
            className="block w-full px-3 py-2 bg-white dark:bg-[#141414] dark:text-blue-500 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value={1}>1º Bimestre</option>
            <option value={2}>2º Bimestre</option>
            <option value={3}>3º Bimestre</option>
            <option value={4}>4º Bimestre</option>
          </select>
        </div>
      </div>
      {errorMessage &&
        !errorMessage.includes("token") &&
        !errorMessage.includes("ID") && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {errorMessage}
          </div>
        )}

      <div className="p-6 rounded-3xl">
        <div className="min-h-[150px] text-center">
          <h3 className="text-blue-600 font-bold mb-6 ">
            {currentQuestion + 1}: {questions[currentQuestion].text}
          </h3>

          <div className="flex justify-center gap-4 my-8 ">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => handleRatingClick(rating)}
                className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-medium transition-all
                  ${
                    responses[
                      questions[currentQuestion]
                        .responseKey as keyof typeof responses
                    ] === rating
                      ? "bg-blue-500 text-white"
                      : "bg-white text-blue-500 hover:bg-blue-100 dark:bg-[#141414]"
                  }
                `}
              >
                {rating}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className={`p-2 rounded-full ${
              currentQuestion === 0
                ? "text-gray-400"
                : "text-blue-500 hover:bg-blue-200"
            }`}
          >
            <ChevronLeft size={24} />
          </button>

          <div className="flex gap-1">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentQuestion ? "bg-blue-600" : "bg-blue-300"
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={currentQuestion === questions.length - 1}
            className={`p-2 rounded-full ${
              currentQuestion === questions.length - 1
                ? "text-gray-400"
                : "text-blue-500 hover:bg-blue-200"
            }`}
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    {currentQuestion === questions.length - 1 && (
      <div className="flex justify-center mt-4">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-md transition-colors"
        >
          {isSubmitting ? "Enviando..." : "Enviar respostas"}
        </button>
      </div>
    )}
    </div>
  );
}
