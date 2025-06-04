"use client";

import type React from "react";

import { useState } from "react";
import { Sun, Moon, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import Illustration from "../assets/images/Illustration.png";
import Image from "next/image";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useTheme } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/alunos/button";

export default function LoginPage() {
  const { darkMode, toggleTheme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [identifierCode, setIdentifierCode] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const user = {
      identifierCode,
      password,
    };
    if (identifierCode.startsWith("p")) {
      try {
        const response = await fetch(
          "https://onaback-fke4h4d2dkbfcsav.eastus2-01.azurewebsites.net/api/teacher/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
          }
        );

        if (response.ok) {
          console.log("Login realizado como professor!");
          const data = await response.json();
          console.log(data);
          const token = data.token;
          if (token) {
            localStorage.setItem("token", token); // Armazena o token no localStorage
            Cookies.set("token", token, { path: "/" });
            console.log("Token gerado com sucesso!");
            router.push("/teacher");
          } else {
            console.log("Erro: Token não recebido.");
          }
          setIdentifierCode("");
          setPassword("");
        } else {
          console.log("Erro no professor!");
          toast.error("Matrícula ou senha incorreta!");
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Erro ao enviar os dados:", error);
      }
    } else if (identifierCode.startsWith("a")) {
      try {
        const response = await fetch(
          "https://onaback-fke4h4d2dkbfcsav.eastus2-01.azurewebsites.net/api/student/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
          }
        );

        if (response.ok) {
          console.log("Login realizado como aluno!");
          const data = await response.json();
          console.log(data);
          const token = data.token;
          if (token) {
            localStorage.setItem("token", token); // Armazena o token no localStorage
            Cookies.set("token", token, { path: "/" });
            console.log("Token gerado com sucesso!");
            router.push("/student");
          } else {
            console.log("Erro: Token não recebido.");
          }
          setIdentifierCode("");
          setPassword("");
        } else {
          console.log("Erro no aluno!");
          toast.error("Matrícula ou senha incorreta!");
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Erro ao enviar os dados:", error);
      }
    } else {
      try {
        const response = await fetch(
          "https://onaback-fke4h4d2dkbfcsav.eastus2-01.azurewebsites.net/api/institution/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
          }
        );

        if (response.ok) {
          console.log("Login realizado como instituição!");
          const data = await response.json();
          console.log(data);
          const token = data.token;
          if (token) {
            localStorage.setItem("token", token); // Armazena o token no localStorage
            Cookies.set("token", token, { path: "/" });
            console.log("Token gerado com sucesso!");
            router.push("/institution");
          } else {
            console.log("Erro: Token não recebido.");
          }
          setIdentifierCode("");
          setPassword("");
        } else {
          console.log("Erro!");
          toast.error("Matrícula ou senha incorreta!");
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Erro ao enviar os dados:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <ToastContainer />
      <main className={`min-h-screen w-full ${darkMode ? "dark" : ""}`}>
        <div className="container mx-auto px-4 2xl:px-28 py-8 flex min-h-screen relative">
          <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-4 md:gap-8 z-10">
            <div className="w-full lg:w-1/2 space-y-4 md:space-y-6 text-center lg:text-left mb-8 lg:mb-0">
              <h1
                className={`text-3xl sm:text-4xl md:text-5xl font-bold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Bem-vindo ao <br />
                On Academy!
              </h1>
              <p
                className={`text-base sm:text-lg ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                } max-w-md mx-auto lg:mx-0`}
              >
                Acompanhe seu desempenho, receba notificações e explore recursos
                personalizados. Faça login para começar!
              </p>
            </div>

            <div className="w-full lg:w-1/2 flex flex-col items-center z-10">
              <div className="w-full flex justify-end mb-8">
                <Button onClick={toggleTheme}>
                  {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                </Button>
              </div>

              <div
                className={`w-full max-w-md p-6 sm:p-8 rounded-2xl shadow-xl ${
                  darkMode ? "bg-black" : "bg-white"
                }`}
              >
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div>
                    <input
                      type="text"
                      placeholder="Matrícula"
                      value={identifierCode}
                      onChange={(e) => setIdentifierCode(e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg ${
                        darkMode ? "bg-[#141414] text-white" : "bg-gray-50"
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Senha"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg ${
                        darkMode
                          ? "bg-[#1E1E1E] text-white [color-scheme:dark]"
                          : "bg-gray-50 text-gray-900"
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex justify-center items-center"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
                    ) : (
                      "Login"
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 sm:w-72 md:w-80 lg:w-96 pointer-events-none">
          <Image
            src={Illustration || "/placeholder.svg"}
            alt="Character illustration"
            width={400}
            height={400}
            priority
            className="w-full h-auto"
          />
        </div>
      </main>
    </>
  );
}