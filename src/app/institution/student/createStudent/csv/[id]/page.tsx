"use client";

import { useState } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import Sidebar from "@/components/layout/sidebarInstitution";
import { Loader2, Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { Button } from "@/components/ui/institution/buttonSubmit";

export default function CSVImporter() {
  const { darkMode, toggleTheme } = useTheme();
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const params = useParams();
  const id = params.id as string;

  const handleFileUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setIsLoading(true);
    setMessage("Processando arquivo...");

    // Verifica o tipo de arquivo
    if (file.name.endsWith(".csv")) {
      processCSV(file);
    } else if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
      processExcel(file);
    } else {
      setMessage("Formato não suportado. Use CSV ou XLSX.");
      setIsLoading(false);
    }
  };

  const processCSV = (file) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        handleParseSuccess(results.data, results.meta.fields);
      },
      error: (error) => {
        handleParseError(error);
      },
    });
  };

  const processExcel = (file) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, {
          type: "array",
          cellDates: true, // Importante para ler datas corretamente
        });

        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, {
          raw: false, // Converte números de Excel para formatos legíveis
        });

        handleParseSuccess(jsonData, Object.keys(jsonData[0] || {}));
      } catch (error) {
        handleParseError(error);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleParseSuccess = (parsedData, parsedHeaders) => {
    setHeaders(parsedHeaders || []);
    setData(parsedData);
    setIsLoading(false);
    setMessage("Arquivo processado com sucesso!");
    console.log("Dados processados:", parsedData);
  };

  const handleParseError = (error) => {
    console.error("Erro ao processar arquivo:", error);
    setIsLoading(false);
    setMessage("Erro ao processar arquivo");
  };

  const transformDataForAPI = (rawData) => {
    return rawData
      .map((item) => {
        const parseDate = (dateInput) => {
          if (!dateInput) return null;

          // Se for número (formato Excel)
          if (!isNaN(dateInput)) {
            const excelEpoch = new Date(1899, 11, 30);
            const date = new Date(
              excelEpoch.getTime() + dateInput * 24 * 60 * 60 * 1000
            );
            return date.toISOString().split("T")[0];
          }

          // Remove espaços e caracteres extras
          const dateString = String(dateInput).trim();

          // Tenta parsear como MM/DD/YY (formato americano)
          if (dateString.match(/^\d{1,2}\/\d{1,2}\/\d{2}$/)) {
            const [month, day, yearShort] = dateString.split("/");
            const fullYear = `20${yearShort}`; // Assume século 21 para anos de 2 dígitos

            // Validação básica da data
            if (month > 12) {
              console.warn("Mês inválido (>12):", dateString);
              return null;
            }

            return `${fullYear}-${month.padStart(2, "0")}-${day.padStart(
              2,
              "0"
            )}`;
          }

          // Tenta parsear como DD/MM/YYYY (formato brasileiro)
          if (dateString.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/)) {
            const [day, month, year] = dateString.split("/");
            return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
          }

          console.warn("Formato de data não reconhecido:", dateInput);
          return null;
        };

        return {
          nomeAluno: item["nome"] || item["Nome"],
          emailAluno: item["email"] || item["Email"],
          telefoneAluno: item["telefone"] || item["Telefone"],
          dataNascimentoAluno: parseDate(
            item["data nascimento"] || item["Data nascimento"]
          ),
          turmaId: id,
        };
      })
      .filter((item) => item.nomeAluno && item.dataNascimentoAluno);
  };
  const sendToAPI = async () => {
    if (data.length === 0) {
      toast.warn("Nenhum dado para enviar");
      return;
    }

    setIsLoading(true);
    setMessage("Validando e enviando dados para a API...");

    try {
      // Transformação e validação inicial (mantida do código anterior)
      const transformedData = transformDataForAPI(data);

      // Funções de validação
      const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
      };

      const validatePhone = (phone) => {
        const cleanedPhone = phone.toString().replace(/\D/g, "");
        return cleanedPhone.length === 10 || cleanedPhone.length === 11;
      };

      // Valida os dados transformados
      const validData = [];
      const errorMessages = [];

      for (const [index, item] of transformedData.entries()) {
        try {
          // Validação de campos obrigatórios
          if (!item.nomeAluno?.trim()) {
            throw new Error(`Linha ${index + 2}: Nome é obrigatório`);
          }

          if (!item.emailAluno?.trim()) {
            throw new Error(`Linha ${index + 2}: Email é obrigatório`);
          }

          if (!item.telefoneAluno?.toString().trim()) {
            throw new Error(`Linha ${index + 2}: Telefone é obrigatório`);
          }

          if (!item.dataNascimentoAluno) {
            throw new Error(
              `Linha ${index + 2}: Data de nascimento é obrigatória`
            );
          }

          // Validação de email
          if (!validateEmail(item.emailAluno)) {
            throw new Error(`Linha ${index + 2}: Email inválido`);
          }

          // Validação de telefone
          if (!validatePhone(item.telefoneAluno)) {
            throw new Error(
              `Linha ${
                index + 2
              }: Telefone inválido (deve ter 10 ou 11 dígitos)`
            );
          }

          // Validação da data de nascimento
          const birthDate = new Date(item.dataNascimentoAluno);
          const minDate = new Date("1900-01-01");
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          if (birthDate < minDate) {
            throw new Error(
              `Linha ${
                index + 2
              }: Data de nascimento não pode ser anterior a 1900`
            );
          }

          if (birthDate > today) {
            throw new Error(
              `Linha ${index + 2}: Data de nascimento não pode ser futura`
            );
          }

          // Padroniza os dados antes de enviar
          validData.push({
            nomeAluno: item.nomeAluno.trim(),
            emailAluno: item.emailAluno.trim(),
            telefoneAluno: item.telefoneAluno.toString().replace(/\D/g, ""),
            dataNascimentoAluno: item.dataNascimentoAluno,
            turmaId: id,
          });
        } catch (error) {
          errorMessages.push(error.message);
          toast.warn(error.message);
        }
      }

      // Verifica se há dados válidos
      if (validData.length === 0) {
        toast.warn("Nenhum registro válido para enviar");
        setIsLoading(false);
        return;
      }

      // Mostra resumo de erros se houver
      if (errorMessages.length > 0) {
        toast.warn(
          `${errorMessages.length} registro(s) com erro(s) - verifique acima`
        );
      }

      // Envio para API
      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://onacademy-e2h7csembwhrf2bu.brazilsouth-01.azurewebsites.net/api/students/list",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(validData),
        }
      );

      if (response.ok) {
        const result = await response.json();
        toast.success(`${validData.length} aluno(s) importado(s) com sucesso!`);
        setMessage(`${validData.length} aluno(s) importado(s) com sucesso`);
      } else {
        const errorResponse = await response.text();

        // Tratamento específico para erros 400 (e-mails duplicados)
        if (response.status === 400) {
          try {
            const errorData = JSON.parse(errorResponse);

            // Extrai os erros individuais de e-mail duplicado
            if (errorData.details && typeof errorData.details === "string") {
              const errorMessages = errorData.details.split(";");

              errorMessages.forEach((msg) => {
                const cleanMsg = msg.trim();
                if (cleanMsg) {
                  toast.warn(`${cleanMsg}`);
                }
              });
            }

            // Mensagem geral de erro
            toast.error(`${errorData.error || "Erro ao processar alunos"}`, {
              autoClose: 4000,
            });

            throw new Error(errorData.error || "Erro ao processar alunos");
          } catch (e) {
            // Se não conseguir parsear, mostra o erro original
            throw new Error(`Erro na API: ${errorResponse}`);
          }
        } else {
          throw new Error(`Erro na API: ${response.status} - ${errorResponse}`);
        }
      }
    } catch (error) {
      console.error("Erro ao enviar para API:", error);

      // Só mostra o toast genérico se não for um erro 400 (que já foi tratado)
      if (!error.message.includes("Erro ao criar estudantes")) {
        toast.warn(`⛔ ${error.message}`);
      }

      setMessage("Erro no envio dos dados");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="flex min-h-screen bg-[#F0F7FF] dark:bg-[#141414]">
        <Sidebar />

        <div className="flex-1 p-14">
          {/* Cabeçalho */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-blue-500">
                Criar novos alunos
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Selecione um arquivo CSV ou XLSX para criar alunos em lote.
              </p>
            </div>
            <Button onClick={toggleTheme} size="icon" variant="ghost">
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </Button>
          </div>

          {/* Seção de Upload */}
          <div className="mb-8 p-6 bg-white dark:bg-black rounded-lg shadow">
            <label className="block mb-4">
              <span className="block text-sm font-medium mb-2 dark:text-white">
                Selecione o arquivo
              </span>
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileUpload}
                disabled={isLoading}
                className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100
                dark:file:bg-blue-500 dark:file:text-blue-100
                dark:hover:file:bg-blue-800"
              />
            </label>

            {isLoading && (
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <Loader2 className="animate-spin" size={16} />
                <span>Carregando...</span>
              </div>
            )}

            {message && (
              <p
                className={`mt-4 text-sm ${
                  message.includes("sucesso")
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {message}
              </p>
            )}
          </div>

          {/* Tabela de Pré-visualização */}
          {data.length > 0 && (
            <div className="bg-white dark:bg-black rounded-lg shadow overflow-hidden">
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="font-semibold dark:text-white">
                  Dados Importados ({data.length} registros)
                </h3>
                <button
                  onClick={sendToAPI}
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="animate-spin" size={16} />
                      Criando...
                    </span>
                  ) : (
                    "Criar alunos"
                  )}
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50 dark:bg-black">
                    <tr>
                      {headers.map((header, index) => (
                        <th
                          key={index}
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-[#141414]">
                    {data.slice(0, 5).map((row, rowIndex) => (
                      <tr
                        key={rowIndex}
                        className={
                          rowIndex % 2 === 0
                            ? "bg-white dark:bg-black"
                            : "bg-gray-50 dark:bg-black"
                        }
                      >
                        {headers.map((header, colIndex) => (
                          <td
                            key={colIndex}
                            className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200"
                          >
                            {row[header]}
                          </td>
                        ))}
                      </tr>
                    ))}
                    {data.length > 5 && (
                      <tr className="bg-gray-50 dark:bg-gray-700">
                        <td
                          colSpan={headers.length}
                          className="px-4 py-3 text-center text-sm text-gray-500 dark:text-gray-400"
                        >
                          + {data.length - 5} registros não exibidos
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
