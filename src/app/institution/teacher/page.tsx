"use client";
// Importing necessary components and libraries
import SidebarInstitution from "@/components/layout/sidebarInstitution";
import { Button } from "@/components/ui/alunos/button";
import CardFeedback from "@/components/ui/institution/cardFeedback";
import FloatingButton from "@/components/ui/institution/FloatingButton";
import SearchInput from "@/components/ui/search";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "@/components/ThemeProvider";

// Interface defining the structure of a Teacher Profile
interface TeacherProfile {
  id: number;
  nomeDocente: string;
  imageUrl?: string;
  classes: Array<{
    nomeTurma: string;
    id: number;
    quantidadeAlunos: number;
  }>;
}

// Main component for Teachers List page
export default function Page() {
  // State variables for component data
  const [docenteData, setDocenteData] = useState<TeacherProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { darkMode, toggleTheme } = useTheme();
  
  // State for search functionality
  const [search, setSearch] = useState("");
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const teachersPerPage = 6; // Number of teachers to display per page

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // Fetch teacher data on component mount
  useEffect(() => {
    fetchDocenteData();
  }, []);

  // Function to fetch teacher data from API
  const fetchDocenteData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token não encontrado");

      const response = await fetch(`https://backendona-amfeefbna8ebfmbj.eastus2-01.azurewebsites.net/api/teacher`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error("Não foi possível carregar os dados dos docentes");
      }

      const data = await response.json();
      setDocenteData(data); // Update teachers list
    } catch (err: any) {
      setError(err.message); // Set error message
    } finally {
      setLoading(false); // Finish loading
    }
  };

  // Filter teachers based on search term
  const filteredTeachers = docenteData
    ? docenteData.filter((docente) =>
        docente.nomeDocente.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  // Calculate pagination values
  const totalPages = Math.ceil(filteredTeachers.length / teachersPerPage);
  
  // Get teachers for current page
  const displayedTeachers = filteredTeachers.slice(
    (currentPage - 1) * teachersPerPage,
    currentPage * teachersPerPage
  );

  return (
    <div className="flex min-h-screen bg-[#F0F7FF] dark:bg-[#141414]">
      {/* Institution sidebar */}
      <SidebarInstitution />
      
      {/* Main content area */}
      <main className="flex-1">
        {/* Theme toggle button section */}
        <div className="p-8">
          <div className="flex items-center justify-end mb-8 w-full">
            <Button onClick={toggleTheme}>
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </Button>
          </div>
        </div>

        {/* Teachers list container */}
        <div className="w-[80%] mx-auto bg-white rounded-[20px] dark:bg-black p-10">
          {/* Search input */}
          <div className="w-full flex flex-row justify-center items-center mb-8">
            <SearchInput
              placeholder="Digite o nome do docente"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Loading, error, or content display */}
          {loading ? (
            <p>Carregando...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <>
              {/* Teachers grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {displayedTeachers.map((docente) => (
                  <CardFeedback
                    imageUrl={docente.imageUrl}
                    key={docente.id}
                    person={docente.nomeDocente}
                    rote={`/institution/teacher/profile/viewprofile/${docente.id}`}
                  />
                ))}
              </div>

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-4 py-2 mx-1 rounded-md transition ${
                        currentPage === i + 1
                          ? "bg-blue-500 text-white dark:text-black"
                          : "bg-[#F0F7FF] text-blue-500 hover:bg-gray-300 dark:bg-[#141414]"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
      
      {/* Floating action button for creating new teacher */}
      <FloatingButton rote="teacher/profile/createprofile" />
    </div>
  );
}