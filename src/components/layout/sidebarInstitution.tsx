"use client";
import { useState, useEffect } from "react";
import { FaRegAddressCard } from "react-icons/fa";
import Link from "next/link";
import {
  Home,
  User,
  FileText,
  Calendar,
  AlertTriangle,
  Brain,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Epilogue } from "next/font/google";
import Image from "next/image";
import logo from "../../assets/images/logo.png";
import Modal from "@/components/modals/modalSidebar"; // Importando o modal
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const epilogue = Epilogue({ subsets: ["latin"], weight: ["400", "700"] });

const SidebarInstitution = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

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
    localStorage.removeItem('hideWelcomeMessage');

    // Adiciona um marcador para indicar que o usuário acabou de logar
    sessionStorage.setItem('justLoggedIn', 'true');
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

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
        className={`${isOpen ? "translate-x-0" : "-translate-x-full"
          } fixed 2xl:static z-40 w-64 max-2xl:h-screen bg-white dark:bg-black flex flex-col justify-between rounded-r-[20px] transition-transform duration-300 ease-in-out ${epilogue.className
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
            <span className="text-[#6A95F4] text-base font-bold">INSTITUIÇÃO</span>
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
        <h2 className="text-lg font-bold mb-4 dark:text-white">Confirmar saída</h2>
        <p className="dark:text-white">Tem certeza que deseja sair?</p>
      </Modal>
    </>
  );
};

export default SidebarInstitution;