"use client";
import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";

interface CardFeedbackProps {
  person: string;
  rote?: string;
  imageUrl?: string; 
}

export default function CardFeedback({ person, rote = "/", imageUrl }: CardFeedbackProps) {
  const [isSelected, setIsSelected] = useState(false);

  return (
    <button
      onClick={() => setIsSelected(!isSelected)}
      className="flex flex-col items-center p-4 rounded-lg shadow-md bg-[#F0F7FF] dark:bg-[#141414] dark:text-white border-[#F0F7FF] dark:border-[#141414] cursor-pointer">
      <div className="w-16 h-16 bg-gray-200 rounded-full mb-2 flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={`Foto de ${person}`}
            width={64}
            height={64}
            className="object-cover w-full h-full"
          />
        ) : (
          <span className="text-gray-500">Sem foto</span>
        )}
      </div>
      <span className="font-medium dark:text-white max-w-80 break-words">{person}</span>
      <Link href={rote}>
        <div className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
          Ver
        </div>
      </Link>
    </button>
  );
}