"use client"; // Indicates this is a Client Component in Next.js

// Importing necessary React hooks and components
import { useEffect, useState } from "react";
import { Moon, Sun, ArrowLeft } from "lucide-react"; // Icons for theme toggle
import { Button } from "@/components/ui/alunos/button"; // Custom button component
import Sidebar from "@/components/layout/sidebarTeacher"; // Teacher sidebar component
import GlobalTablePerformance from "@/components/ui/globalTablePerformance"; // Performance table component
import SearchInput from "@/components/ui/search"; // Search input component
import { useParams } from "next/navigation"; // Next.js hook for route parameters
import { useTheme } from "@/components/ThemeProvider"; // Theme management hook
import Link from "next/link"; // Next.js link component for client-side navigation
import { useRouter } from 'next/navigation';

// Interface defining the structure of a Student object
interface Student {
  id: number; // Unique identifier for the student
  nomeAluno: string; // Student's name
  identifierCode: number; // Student's identification code
}

// Main component for the Students page
export default function StudentsPage({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  // Getting route parameters
  const params = useParams();
  const id = params.id as string; // Extracting class ID from URL
  
  // State management
  const [estudante, setEstudante] = useState<Student[]>([]); // Stores student data
  const { darkMode, toggleTheme } = useTheme(); // Theme management
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const [search, setSearch] = useState(""); // Search term state
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const studentsPerPage = 10; // Number of students per page
  const router = useRouter();

  // Effect to fetch students when component mounts or class ID changes
  useEffect(() => {
    if (!id) return; // Skip if no class ID

    const fetchStudents = async () => {
      try {
        // Fetch students from API
        const response = await fetch(
          `https://backendona-amfeefbna8ebfmbj.eastus2-01.azurewebsites.net/api/class/students/${id}`
        );
        if (!response.ok) throw new Error("Erro ao buscar alunos");
        const data = await response.json();
        // Set students data, ensuring it's always an array
        setEstudante(Array.isArray(data.students) ? data.students : []);
      } catch (err: any) {
        setError(err.message); // Set error message if request fails
      } finally {
        setLoading(false); // Always set loading to false when done
      }
    };

    fetchStudents();
  }, [id]);

  // Filter students based on search term
  const filteredStudents = estudante.filter((student) =>
    student.nomeAluno.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  // Get students for current page
  const displayedStudents = filteredStudents.slice(
    (currentPage - 1) * studentsPerPage,
    currentPage * studentsPerPage
  );

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // Main component render
  return (
    <div className="min-h-screen bg-[#F0F7FF] flex flex-col md:flex-row dark:bg-[#141414]">
      {/* Sidebar component */}
      <Sidebar />
      
      {/* Main content area */}
      <div className="w-full flex flex-col items-center mt-4 md:mt-8 px-4">
      <div className="grid grid-cols-3 items-center mb-6 w-full">
          {/* Botão Voltar (esquerda) */}
          <div className="col-start-1">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-blue-500 font-semibold transition-colors"
            >
              <ArrowLeft size={20} />
              Voltar
            </button>
          </div>

          {/* Espaço vazio do meio */}
          <div className="col-start-2"></div>

          {/* Botão Tema (direita) */}
          <div className="col-start-3 flex justify-end">
            <Button onClick={toggleTheme}>
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </Button>
          </div>
        </div>
        
        {/* Students table container */}
        <div className="w-full md:w-[85%] mx-auto p-4 border dark:border-black rounded-lg bg-white rounded-3xl dark:bg-black mb-4">
          {/* Search input */}
          <div className="relative w-full md:max-w-md mx-auto flex justify-center items-center mb-4 md:mb-6">
            <SearchInput
              placeholder="Buscar aluno..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          {/* Scrollable table area */}
          <div className="overflow-x-auto overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-200">
            {/* Loading state */}
            {loading ? (
              <p>Carregando...</p>
            ) : error ? ( // Error state
              <p className="text-red-500">{error}</p>
            ) : (
              /* Students table */
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse border border-[#1A85FF] dark:border-black">
                  {/* Table header */}
                  <thead>
                    <tr className="bg-[#1A85FF] text-white">
                      <th className="p-2 border border-blue-500 bg-[#F0F7FF] text-blue-500 dark:bg-[#141414] text-sm md:text-base">
                        Nome do aluno
                      </th>
                      <th className="p-2 border border-blue-500 bg-[#F0F7FF] text-blue-500 dark:bg-[#141414] text-sm md:text-base">
                        Matrícula
                      </th>
                      <th className="p-2 border border-blue-500 bg-[#F0F7FF] text-blue-500 dark:bg-[#141414] text-sm md:text-base">
                        Perfil
                      </th>
                      <th className="p-2 border border-blue-500 bg-[#F0F7FF] text-blue-500 dark:bg-[#141414] text-sm md:text-base">
                        Notas
                      </th>
                    </tr>
                  </thead>
                  
                  {/* Table body */}
                  <tbody>
                    {/* Map through displayed students */}
                    {displayedStudents.map((student) => (
                      <tr key={student.id} className="border border-blue-500">
                        <td className="p-2 border border-blue-500 dark:text-white text-sm md:text-base">
                          {student.nomeAluno}
                        </td>
                        <td className="p-2 border border-blue-500 dark:text-[#8A8A8A] text-sm md:text-base">
                          {student.identifierCode}
                        </td>
                        <td className="p-2 border border-blue-500 dark:text-white text-sm md:text-base">
                          {/* Link to student profile */}
                          <Link
                            href={`/teacher/students/profile/${student.id}`}
                            className="text-blue-500 hover:underline"
                          >
                            Ver perfil
                          </Link>
                        </td>
                        <td className="p-2 border border-blue-500 cursor-pointer text-sm md:text-base">
                          {/* Link to student grades */}
                          <Link
                            href={`/teacher/students/notes/${student.id}`}
                            className="text-blue-500 hover:underline"
                          >
                            Ver Notas
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          
          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4 md:mt-6 flex-wrap">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 md:px-4 md:py-2 mx-1 my-1 rounded-md transition text-sm md:text-base ${
                    currentPage === i + 1
                      ? "bg-blue-500 text-white" // Active page style
                      : "bg-gray-200 text-blue-500 hover:bg-gray-300" // Inactive page style
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Global performance table component */}
        <GlobalTablePerformance/>
      </div>
    </div>
  );
}