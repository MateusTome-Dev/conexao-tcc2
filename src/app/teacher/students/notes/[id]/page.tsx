"use client"; // Indicates this is a Client Component in Next.js

// Importing components and libraries
import Table from "@/components/ui/teacher/gradeTableStudents"; // Component for displaying grades table
import Sidebar from "@/components/layout/sidebarTeacher"; // Teacher sidebar navigation component
import { Button } from "@/components/ui/alunos/button"; // Custom button component
import { Moon, Sun, ArrowLeft } from "lucide-react"; // Icons for dark/light theme toggle
import { useTheme } from "@/components/ThemeProvider"; // Theme context provider
import { useRouter } from 'next/navigation';

// Main component for the Notes page
export default function Notes({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  // Using theme context to manage dark/light mode
  const { darkMode, toggleTheme } = useTheme();
  const router = useRouter();

  return (
    // Main container with dark mode support
    <div className="flex min-h-screen bg-[#F0F7FF] dark:bg-[#141414]">
      {/* Sidebar navigation */}
      <Sidebar />
      
      {/* Main content area */}
      <main className="flex-1">
        {/* Content container with padding */}
        <div className="p-8">
          {/* Theme toggle button positioned at top-right */}
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
          
          {/* Grades table component */}
          <Table />
        </div>
      </main>
    </div>
  );
}