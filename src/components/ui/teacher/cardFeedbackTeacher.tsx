"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";


interface CardFeedbackProps {
  persons?: string[];
  rote?: string;
}

export default function CardFeedback({ persons = [], rote = "/" }: CardFeedbackProps) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 6;
  const [darkMode, setDarkMode] = useState(false);

  // Inicializa o modo escuro no cliente
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // Filtra os estudantes com base na pesquisa
  const filteredStudents = persons.filter((person) =>
    person.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const displayedStudents = filteredStudents.slice(
    (currentPage - 1) * studentsPerPage,
    currentPage * studentsPerPage
  );

  return (
    <div>

      {/* Lista de estudantes */}
      <div className="grid grid-cols-3 gap-6">
        {displayedStudents.map((person, index) => (
          <Link key={index} href={rote}>
            <div className="flex flex-col items-center p-4 rounded-lg shadow-md bg-[#F0F7FF] dark:bg-[#141414] dark:text-white border-[#F0F7FF] dark:border-[#141414] cursor-pointer">
              <div className="w-16 h-16 bg-gray-200 rounded-full mb-2 flex items-center justify-center">
                🎓
              </div>
              <span className="font-medium">{person}</span>
              <span className="text-green-600">Ativo(a)</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
