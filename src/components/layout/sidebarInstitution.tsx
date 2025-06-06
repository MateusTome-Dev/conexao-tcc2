"use client";
import { useState, useEffect } from "react";
import { FaRegAddressCard } from "react-icons/fa";
import Link from "next/link";
import {
  Home,
  User,
  FileText,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Epilogue } from "next/font/google";
import Image from "next/image";
import logo from "../../assets/images/logo.png";
import qrcode from "../../assets/images/qr-code-mobile.png";
import Modal from "@/components/modals/modalSidebar"; // Importando o modal
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const epilogue = Epilogue({ subsets: ["latin"], weight: ["400", "700"] });

const SidebarInstitution = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [nameInstitution, setNameInstitution] = useState<string>("Instituição");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if we're on mobile and auto-close sidebar
  useEffect(() => {
    const checkScreenSize = () => {
      const shouldCollapse = window.innerWidth < 1536;
      setIsCollapsed(shouldCollapse);
      if (shouldCollapse) setIsOpen(false);
      else setIsOpen(true);
    };

    // Initial check
    checkScreenSize();

    // Add event listener
    window.addEventListener("resize", checkScreenSize);

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    Cookies.remove("token");
    setIsModalOpen(false);
    router.push("/");
    // Limpa o localStorage relacionado ao welcome message
    localStorage.removeItem("hideWelcomeMessage");

    // Adiciona um marcador para indicar que o usuário acabou de logar
    sessionStorage.setItem("justLoggedIn", "true");
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const fetchInstitutionData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token não encontrado no localStorage");
        }
  
        const decoded: any = jwtDecode(token);
        const userId = decoded?.sub;
        if (!userId) {
          throw new Error("ID do usuário não encontrado no token");
        }
  
        const apiUrl = `https://onaback-fke4h4d2dkbfcsav.eastus2-01.azurewebsites.net/api/institution/${userId}`;
        
        console.log("Fazendo requisição para:", apiUrl); // Debug
  
        const response = await fetch(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(
            errorData?.message || `Erro HTTP: ${response.status}`
          );
        }
  
        const data = await response.json();
        console.log("Dados recebidos:", data); // Debug
        
        if (data.nameInstitution) {
          setNameInstitution(data.nameInstitution);
        } else {
          throw new Error("Nome da instituição não encontrado na resposta");
        }
      } catch (err: any) {
        console.error("Erro ao buscar dados da instituição:", err);
        setError(err.message);
        setNameInstitution("Instituição"); // Fallback
      } finally {
        setLoading(false);
      }
    };
  
    fetchInstitutionData();
  }, []);

  return (
    <>
      {/* Toggle button for mobile - always visible */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 2xl:hidden bg-white dark:bg-gray-800 p-2 rounded-md shadow-md"
        aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-blue-500" />
        ) : (
          <Menu className="w-6 h-6 text-blue-500" />
        )}
      </button>

      {/* Overlay when sidebar is open on mobile */}
      {isOpen && isCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } fixed 2xl:static z-40 w-64 max-2xl:h-screen bg-white dark:bg-black flex flex-col justify-between rounded-r-[20px] transition-transform duration-300 ease-in-out ${
          epilogue.className
        }`}
      >
        <div>
          <div className="flex items-center space-x-4 pb-6 justify-center mt-8">
            <Image
              src={logo}
              alt="Descrição da imagem"
              width={38}
              height={38}
            />
            <span className="text-[#6A95F4] text-xl font-bold">ONA</span>
          </div>
          <div className="flex items-center pb-2 justify-center">
            <span className="text-[#6A95F4] text-base font-bold">
              Olá, {nameInstitution}!
            </span>
          </div>
          <nav className="w-64 mt-24 short:mt-4">
            <ul>
              <li className="group pt-4 pb-4 short:pt-3 short:pb-3 flex flex-row justify-center hover:bg-[#F0F7FF] hover:text-blue-500 dark:hover:bg-[#141414] hover:border-l-4 border-blue-500 ">
                <Link
                  href="/institution"
                  className="flex items-center space-x-2 text-gray-500 w-32 text-center text-base font-semibold "
                  onClick={() => isCollapsed && setIsOpen(false)}
                >
                  <Home className="w-8 h-8 short:w-6 short:h-6 stroke-2 group-hover:text-blue-500" />
                  <span className="group-hover:text-blue-500">Home</span>
                </Link>
              </li>
              <li className="group pt-4 pb-4 short:pt-3 short:pb-3 flex flex-row justify-center hover:bg-[#F0F7FF] hover:text-blue-500 dark:hover:bg-[#141414] hover:border-l-4 border-blue-500">
                <Link
                  href="/institution/teacher"
                  className="flex items-center space-x-2 text-gray-500 w-32 text-center text-base font-semibold"
                  onClick={() => isCollapsed && setIsOpen(false)}
                >
                  <FaRegAddressCard className="w-8 h-8 short:w-6 short:h-6 stroke-2 group-hover:text-blue-500" />
                  <span className="group-hover:text-blue-500">Docentes</span>
                </Link>
              </li>
              <li className="group pt-4 pb-4 short:pt-3 short:pb-3 flex flex-row justify-center hover:bg-[#F0F7FF] hover:text-blue-500 dark:hover:bg-[#141414] hover:border-l-4 border-blue-500">
                <Link
                  href="/institution/class"
                  className="flex items-center space-x-2 text-gray-500 w-32 text-center text-base font-semibold"
                  onClick={() => isCollapsed && setIsOpen(false)}
                >
                  <User className="w-8 h-8 short:w-6 short:h-6 stroke-2 group-hover:text-blue-500" />
                  <span className="group-hover:text-blue-500">Turmas</span>
                </Link>
              </li>
              <li className="group pt-4 pb-4 short:pt-3 short:pb-3 flex flex-row justify-center hover:bg-[#F0F7FF] hover:text-blue-500 dark:hover:bg-[#141414] hover:border-l-4 border-blue-500">
                <Link
                  href="/institution/event"
                  className="flex items-center space-x-2 text-gray-500 w-32 text-center text-base font-semibold"
                  onClick={() => isCollapsed && setIsOpen(false)}
                >
                  <FileText className="w-8 h-8 short:w-6 short:h-6 stroke-2 group-hover:text-blue-500" />
                  <span className="group-hover:text-blue-500">Eventos</span>
                </Link>
              </li>
              <li className="relative group pt-4 pb-4 short:pt-3 short:pb-3 flex flex-row justify-center">
                {/* Botão/Link visível */}
                <button className="flex items-center space-x-2 text-gray-500 w-32 text-center text-base font-semibold group-hover:text-blue-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-8 h-8 short:w-6 short:h-6 stroke-2 group-hover:text-blue-500"
                  >
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                    <path d="M12 18v-6" />
                    <path d="m9 15 3 3 3-3" />
                  </svg>
                  <a href="https://www.mediafire.com/folder/nn3gdf0kvizof/ONA">
                    <span>Baixar app</span>
                  </a>
                </button>

                {/* QR Code que aparece abaixo no hover */}
                <div className="absolute hidden group-hover:block left-1/2 transform -translate-x-1/2 top-full mt-2 z-50 bg-white p-3 rounded-lg shadow-xl border border-gray-200">
                  <Image
                    src={qrcode}
                    alt="Baixe o app ONA"
                    width={140}
                    height={140}
                    className="rounded"
                  />
                  <p className="text-xs text-center mt-2 text-gray-600">
                    Escaneie para baixar o app
                  </p>
                </div>
              </li>
            </ul>
          </nav>
        </div>
        <div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 justify-center text-red-500 text-center text-base font-semibold pb-8 w-full short:p-6"
          >
            <LogOut className="w-8 h-8 stroke-2 short:w-6 short:h-6" />
            <span>Sair</span>
          </button>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleLogout}
        confirmButtonColor="bg-red-600" // Cor personalizada
        confirmButtonText="Sair"
      >
        <h2 className="text-lg font-bold mb-4 dark:text-white">
          Confirmar saída
        </h2>
        <p className="dark:text-white">Tem certeza que deseja sair?</p>
      </Modal>
    </>
  );
};

export default SidebarInstitution;
