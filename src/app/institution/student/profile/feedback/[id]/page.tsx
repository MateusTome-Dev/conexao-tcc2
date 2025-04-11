"use client";

import { useState, useEffect } from "react";
import { OccurrencesTable } from "@/components/ui/alunos/occurrences-table";
import Sidebar from "@/components/layout/sidebarInstitution";
import { Button } from "@/components/ui/alunos/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { useParams } from "next/navigation";
import TablePerformance from "@/components/ui/tablePerfomance";

const dataByBimester = {
  "1º Bimestre": [
    { name: "Engajamento", value: 80 },
    { name: "Disposição", value: 60 },
    { name: "Entrega", value: 90 },
    { name: "Atenção", value: 70 },
    { name: "Comportamento", value: 40 },
  ],
  "2º Bimestre": [
    { name: "Engajamento", value: 85 },
    { name: "Disposição", value: 65 },
    { name: "Entrega", value: 95 },
    { name: "Atenção", value: 75 },
    { name: "Comportamento", value: 50 },
  ],
  "3º Bimestre": [
    { name: "Engajamento", value: 70 },
    { name: "Disposição", value: 55 },
    { name: "Entrega", value: 80 },
    { name: "Atenção", value: 65 },
    { name: "Comportamento", value: 45 },
  ],
  "4º Bimestre": [
    { name: "Engajamento", value: 90 },
    { name: "Disposição", value: 75 },
    { name: "Entrega", value: 85 },
    { name: "Atenção", value: 80 },
    { name: "Comportamento", value: 60 },
  ],
};

type Bimester = "1º Bimestre" | "2º Bimestre" | "3º Bimestre" | "4º Bimestre";

export default function Feedback() {
  const { darkMode, toggleTheme } = useTheme();
  const params = useParams();
  const id = params.id as string; // Extrai o ID da URL

  const [selectedBimester, setSelectedBimester] = useState<Bimester>("1º Bimestre");

  const options = Object.keys(dataByBimester).map((bimester) => ({
    value: bimester,
    label: bimester,
  }));

  const chartData = dataByBimester[selectedBimester] || [];

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-[#F0F7FF] dark:bg-[#141414] flex flex-row">
      <Sidebar />
      <div className="container mx-auto p-4">
        <div className="w-full flex flex-row justify-end">
          <Button onClick={toggleTheme}>
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
        </div>
        <div className="space-y-6 bg-[#FFFFFF] dark:bg-black dark:text-[#ffffffd8] p-8 rounded-2xl max-h-[800px] overflow-y-auto pr scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-200 mt-6">
          <OccurrencesTable />
          <div className="w-full flex justify-center items-center">
            <div className="bg-white dark:bg-black p-6 w-[800px]">
            <TablePerformance />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}