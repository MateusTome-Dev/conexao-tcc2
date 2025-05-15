"use client";

import { Plus, User, Table } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface Button {
  id?: string;
}

export default function FloatingButton({ id }: Button) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className="fixed bottom-6 right-6 flex flex-col items-end gap-2"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {isOpen && (
        <div className="flex flex-col bg-white rounded-lg shadow-lg overflow-hidden">
          <Link
            href={`../../student/createStudent/${id}`}
            className="flex items-center gap-2 px-4 py-3 text-gray-800 hover:bg-gray-100 transition"
          >
            <User size={18} />
            Criar Individualmente
          </Link>
          <Link
            href={`../../student/createStudent/csv/${id}`}
            className="flex items-center gap-2 px-4 py-3 text-gray-800 hover:bg-gray-100 transition border-t border-gray-200"
          >
            <Table size={18} />
            Criar com Planilha
          </Link>
        </div>
      )}

      <button
        className="bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition"
      >
        <Plus size={24} />
      </button>
    </div>
  );
}